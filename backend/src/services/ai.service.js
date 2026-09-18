const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

const analyzeMeeting = async (transcript) => {
    const response = await client.chat.completions.create({
    model: "openrouter/free",

    provider: {
        allow_fallbacks: true,
    },

    messages: [
        {
            role: "system",
            content: `
You are an AI meeting intelligence assistant.

Analyze the meeting transcript and return ONLY valid JSON.

Extract:

1. summary
2. actionItems
3. decisions
4. responsibilities

Rules:
- Extract every concrete action item.
- Identify the owner when clearly mentioned.
- Do not invent owners.
- Extract deadlines only when explicitly mentioned.
- Do not invent dates.
- Include only actual decisions or agreements.
- Do not hallucinate information.

Return exactly this structure:

{
  "summary": "string",
  "actionItems": [
    {
      "task": "string",
      "owner": "string or null",
      "deadline": "string or null"
    }
  ],
  "decisions": [
    "string"
  ],
  "responsibilities": [
    {
      "person": "string",
      "responsibilities": ["string"]
    }
  ]
}
            `,
        },
        {
            role: "user",
            content: transcript,
        },
    ],

    temperature: 0.2,
});

let content = response.choices[0].message.content;

console.log("AI model:", response.model);
console.log("Raw AI response:", content);

if (!content) {
    throw new Error("AI returned an empty response");
}

content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

try {
    return JSON.parse(content);
} catch (parseError) {
    console.error(
        "Failed to parse AI response:",
        content
    );

    throw new Error("AI returned invalid JSON");
}
};

module.exports = {
    analyzeMeeting,
};