const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');
const fs = require('fs');
const os = require('os');
const path = require('path');



const fetchCost = async (service, startDate, endDate, granularity) => {
    const CONFIG_DIR = path.join(os.homedir(), '.aws-cost-analyzer-cli');
    const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE);
        config = JSON.parse(raw);
    }
    const client = new CostExplorerClient({ region: config.AWS_REGION });
    
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