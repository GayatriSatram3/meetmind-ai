const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});


const generateWorkspaceSummary = async (
    analytics
) => {

    const prompt = `
You are MeetMind AI, an AI workspace analytics assistant.

Analyze the following workspace statistics.

Workspace statistics:

Total meetings:
${analytics.totalMeetings}

Meeting hours:
${analytics.totalMeetingHours}

Total action items:
${analytics.totalTasks}

Completed:
${analytics.completedTasks}

In progress:
${analytics.inProgressTasks}

Pending:
${analytics.pendingTasks}

Completion rate:
${analytics.completionRate}%

Write a concise workspace summary.

Rules:

- Use ONLY the provided statistics.
- Do not invent information.
- Do not make assumptions about people.
- Mention notable patterns in the provided numbers.
- Do not label the team as productive or unproductive.
- Do not infer performance quality from completion rate alone.
- Describe the backlog factually when many tasks remain pending.
- Keep the response between 2 and 4 sentences.
- Do not use markdown.
`;

    try {

        const response =
            await client.chat.completions.create({

                model: "openrouter/free",

                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],

                temperature: 0.2,
            });


        const content =
            response?.choices?.[0]?.message?.content;


        if (!content) {
            throw new Error(
                "AI returned an empty response"
            );
        }


        return content.trim();

    } catch (error) {

        console.error(
            "Workspace AI summary error:",
            error
        );


        if (error.status === 429) {

            const rateLimitError =
                new Error(
                    "AI service is temporarily rate-limited"
                );

            rateLimitError.status = 429;

            throw rateLimitError;
        }


        throw error;
    }
};


module.exports = {
    generateWorkspaceSummary,
};