const OpenAI = require("openai");

const {
    generateEmbedding,
} = require("./embedding.service");

const {
    cosineSimilarity,
} = require("../utils/similarity");


const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});


const askMeetings = async (
    question,
    meetings,
    history = []
) => {

        if (!Array.isArray(history)) {
        history = [];
    }

    // 1. Generate embedding for user question

    const recentHistory = history
    .filter(
        (message) =>
            message &&
            (message.role === "user" ||
                message.role === "assistant") &&
            typeof message.content === "string"
    )
    .slice(-4)
    .map((message) => {
        return `${message.role}: ${message.content.slice(0, 2000)}`;
    })
    .join("\n");

const retrievalQuery = recentHistory
    ? `${recentHistory}\nuser: ${question}`
    : question;

console.log(
    "🔎 Retrieval query:",
    retrievalQuery
);

const questionEmbedding =
    await generateEmbedding(retrievalQuery);


    // 2. Calculate similarity

    const SIMILARITY_THRESHOLD = 0.25;

const rankedMeetings = meetings
    .filter((meeting) => meeting.embedding)
    .map((meeting) => {
        const similarity = cosineSimilarity(
            questionEmbedding,
            meeting.embedding
        );

        return {
            ...meeting,
            similarity,
        };
    })
    .filter(
        (meeting) =>
            meeting.similarity >= SIMILARITY_THRESHOLD
    )
    .sort(
        (a, b) =>
            b.similarity - a.similarity
    );


// Remove duplicate titles
const uniqueMeetings = [];
const seenTitles = new Set();

for (const meeting of rankedMeetings) {
    const title =
        meeting.title.trim().toLowerCase();

    if (!seenTitles.has(title)) {
        seenTitles.add(title);
        uniqueMeetings.push(meeting);
    }
}

const selectedMeetings =
    uniqueMeetings.slice(0, 5);


if (selectedMeetings.length === 0) {
    return {
        answer:
            "I couldn't find that information in the meetings.",
        sources: [],
    };
}
    // 3. Build context

const context =
    selectedMeetings
        .map(
            (meeting, index) => `
MEETING ${index + 1}

SOURCE MEETING:
${meeting.title}

Meeting ID:
${meeting.id}

Transcript:
${meeting.description}

AI Summary:
${meeting.aiSummary || "N/A"}

Action Items:
${JSON.stringify(
    meeting.aiActionItems || []
)}

Decisions:
${JSON.stringify(
    meeting.aiDecisions || []
)}
            `
        )
        .join("\n\n");

    console.log(
        "🧠 Retrieved meetings:",
        selectedMeetings.map(
            (meeting) => ({
                title: meeting.title,
                similarity:
                    meeting.similarity,
            })
        )
    );


    // 4. Ask the LLM

    let response;

try {
    response =
        await client.chat.completions.create({
            model: "openrouter/free",

            messages: [
                {
                    role: "system",
                    content: `
You are MeetMind AI, an AI meeting assistant.

Answer the user's question using ONLY
the meeting context provided below.

Rules:

- Do not invent information.
- Do not use outside knowledge.
- Use conversation history to understand
  follow-up questions.
- The meeting context is the only source
  of factual information.
- If the answer cannot be found in the
  meeting context, say:

"I couldn't find that information in the meetings."

- Be concise and clear.
- For factual claims, mention the meeting
  that supports the information when useful.
- Prefer statements such as:
  "The launch is scheduled for next Monday
   (Source: Testing Meet)."
- Never claim that a meeting supports
  information unless that information
  actually appears in that meeting.
- If multiple meetings contain the same
  information, do not repeat the same source
  unnecessarily.

MEETING CONTEXT:

${context}
                    `,
                },

                ...history
    .filter(
        (message) =>
            message &&
            (message.role === "user" ||
                message.role === "assistant") &&
            typeof message.content === "string"
    )
    .slice(-10)
    .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 2000),
    })),

                {
                    role: "user",
                    content: question,
                },
            ],

            temperature: 0.2,
        });

} catch (error) {

    console.error(
        "LLM generation failed:",
        error?.error?.metadata?.raw ||
        error.message
    );

    if (error.status === 429) {
        throw new Error(
            "AI service is temporarily rate-limited. Please try again shortly."
        );
    }

    throw error;
}


    console.log(
        "🤖 RAG model used:",
        response.model
    );


    return {

        answer:
            response.choices[0]
                .message.content,

        sources:
            selectedMeetings.map(
                (meeting) => ({
                    id: meeting.id,

                    title:
                        meeting.title,

                    similarity:
                        meeting.similarity,
                })
            ),

    };
};


module.exports = {
    askMeetings,
};