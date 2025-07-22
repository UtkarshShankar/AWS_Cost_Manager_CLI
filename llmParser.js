const OpenAI = require('openai');


const parseQuery = async (userQuery, PERPLEXITY_API_KEY) => {
    const client = new OpenAI({
        apiKey: PERPLEXITY_API_KEY,
        baseURL: "https://api.perplexity.ai"
    });

    const prompt = `You are a strict API parser that converts user cost queries into structured JSON for an AWS Cost Analyzer CLI tool.

Your task:
- Analyze the user's question about AWS costs.
- Return only a valid JSON object with these keys:
  - "service": The exact AWS service name in Title Case (e.g., "Amazon Simple Storage Service"). If no specific service is mentioned, set this to "ALL".
  - "start_date": The start date in the pattern (\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}Z)? representing YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ. If no date range is specified, default to 7 days ago from today in YYYY-MM-DD format.
  - "end_date": The end date in the same pattern as above. If no date range is specified, default to today in YYYY-MM-DD format.
  - "granularity": The granularity level based on the user's query. It must be one of these values: "DAILY", "MONTHLY", or "HOURLY". Choose:
    - "MONTHLY" if the user asks for monthly summaries or refers to a month.
    - "DAILY" if the user asks for daily summaries or specific date ranges.
    - "HOURLY" only if the user specifically asks for hourly breakdowns. Otherwise, do not set it as HOURLY.

Guidelines:
- Do not include any explanation, notes, markdown, or additional text outside the JSON.
- The output must be only valid JSON without code blocks.
- Ensure the start_date is before or equal to end_date.
- Follow the official AWS Cost Explorer API parameter expectations for GetCostAndUsage requests as per https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html#API_GetCostAndUsage_Examples.

Example input:
What was my EC2 cost last week?

Example output:
{
  "service": "Amazon Elastic Compute Cloud",
  "start_date": "2025-07-08",
  "end_date": "2025-07-15",
  "granularity": "DAILY"
}

Now convert this query:

"${userQuery}"
`;

    let parsedRes;
    try {

        const response = await client.chat.completions.create({
            model: "sonar-pro",
            messages: [
                { role: "system", content: "Be precise and concise." },
                { role: "user", content: prompt }
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

        parsedRes = JSON.parse(response.choices[0].message.content);
        console.log('Json res:' + JSON.stringify(parsedRes));

        const g = parsedRes.granularity.trim().toUpperCase();
        const allowedGranularity = ["DAILY", "MONTHLY", "HOURLY"];

        if (!allowedGranularity.includes(g)) {
            // console.log('gra value: ' + g);
            throw new Error(`Invalid granularity value from LLM: ${g}`);
        }

    } catch (error) {
        console.error('Error Occured: ' + error);
    }
    // console.log(parsedRes.granularity);
    return {
        service: parsedRes.service,
        start_date: parsedRes.start_date,
        end_date: parsedRes.end_date,
        granularity: parsedRes.granularity
    }
}

module.exports = parseQuery;