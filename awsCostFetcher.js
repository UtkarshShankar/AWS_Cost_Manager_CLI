const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');

const client = new CostExplorerClient({ region: process.env.AWS_REGION });

const fetchCost = async (service, startDate, endDate, granularity) => {

    console.log(typeof (granularity))
    let g = granularity
    // g = granularity.trim().toUpperCase();
    const allowedGranularity = ["DAILY", "MONTHLY", "HOURLY"];
    if (!allowedGranularity.includes(g)) {
        throw new Error(`Invalid granularity: ${g}`);
    }
    const params = {
        TimePeriod: {
            Start: startDate,
            End: endDate,
        },
        Granularity: g,
        Metrics: ["UnblendedCost"],
        Filter: {
            Dimensions: {
                Key: "SERVICE",
                Values: [service],
            },
        },
    };

    const command = new GetCostAndUsageCommand(params);
    let response = '';
    try {
        response = await client.send(command);
    } catch (error) {
        console.error('Error Occured: ' + error);
    }

    return response;
}

module.exports = fetchCost;