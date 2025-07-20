const dotenv =require('dotenv');
dotenv.config();
const fetchCost  = require('./awsCostFetcher.js');
const parseQuery= require('./llmParser.js');

// const userQuery = process.argv.slice(2).join(" ");
const userQuery = 'what is the cost of my ec2 services this month';

async function main() {
  const parsed = await parseQuery(userQuery);
  const costData = await fetchCost(parsed.service, parsed.start_date, parsed.end_date, parsed.granularity);

  console.log("🧾 AWS Cost Summary");
  console.log(JSON.stringify(costData));
//   console.log(JSON.stringify(costData, null, 2));
}

main();