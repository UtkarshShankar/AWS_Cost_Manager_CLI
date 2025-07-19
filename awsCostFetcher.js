const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');

const client = new CostExplorerClient({ region: process.env.AWS_REGION });

const fetchCost = async (service, startDate, endDate) => {
    const params = {
        TimePeriod: {
            Start: startDate,
            End: endDate,
        },
        Granularity: "DAILY",
        Metrics: ["UnblendedCost"],
        Filter: {
            Dimensions: {
                Key: "SERVICE",
                Values: [service],
            },
        },
    };

    const command = new GetCostAndUsageCommand(params);
    const response = await client.send(command);
    return response;
}

module.exports = fetchCost;