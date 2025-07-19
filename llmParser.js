// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();

// const openai = new OpenAI();

// export async function parseQuery(query) {
//     const prompt = `
// Convert the following user query into JSON with keys: service, start_date, end_date.
// Query: "${query}"
// Return only valid JSON.
//   `;

//     const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//     });

//     return JSON.parse(response.choices[0].message.content);
// }

// import OpenAI from 'openai';
const OpenAI = require('openai');
const client = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: "https://api.perplexity.ai"
});


const parseQuery = async (userQuery) => {
    const response = await client.chat.completions.create({
        model: "sonar-pro",
        messages: [
            { role: "system", content: "Be precise and concise." },
            { role: "user", content: userQuery }
        ],
        search_mode: "web", // tweak these parameters to control the search results
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        presence_penalty: 0,
        frequency_penalty: 0,
        stream: false,
        search_domain_filter: ["wikipedia.org"],
        search_recency_filter: "month",
        return_citations: true
    });
    console.log(response.choices[0].message.content);
    console.log(`Citations: ${response.citations}`);
}

module.exports = parseQuery;