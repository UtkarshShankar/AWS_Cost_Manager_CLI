#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const os = require('os');
const path = require('path');

const fetchCost = require('./awsCostFetcher.js');
const parseQuery = require('./llmParser.js');

const program = new Command();

const CONFIG_DIR = path.join(os.homedir(), '.aws-cost-analyzer-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const allowedLLMs = ['perplexity', 'gemini'];

if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

let config = {};
if (fs.existsSync(CONFIG_FILE)) {
  const raw = fs.readFileSync(CONFIG_FILE);
  config = JSON.parse(raw);
}

async function ensurePerplexityKey() {
  if (!config.PERPLEXITY_API_KEY) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your Perplexity API Key:',
        validate: input => input.trim() !== '' || 'API Key cannot be empty'
      }
    ]);

    config.PERPLEXITY_API_KEY = answers.apiKey.trim();

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('✅ Perplexity API key saved successfully.');
  } else {
    console.log('✅ Using Perplexity.');
  }
}
async function ensureGeminiKey() {
  if (!config.GEMINI_API_KEY) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your Gemini API Key:',
        validate: input => input.trim() !== '' || 'API Key cannot be empty'
      }
    ]);

    config.GEMINI_API_KEY = answers.apiKey.trim();

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('✅ Gemini API key saved successfully.');
  } else {
    console.log('✅ Using Gemini.');
  }
}
async function editApiKey(llmProvider) {
  if (llmProvider === 'perplexity') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your new Perplexity API Key:',
        validate: input => input.trim() !== '' || 'API Key cannot be empty'
      }
    ]);
    config.PERPLEXITY_API_KEY = answers.apiKey.trim();

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('✅ Perplexity API key updated successfully.');

  } else if (llmProvider === 'gemini') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your new Gemini API Key:',
        validate: input => input.trim() !== '' || 'API Key cannot be empty'
      }
    ]);
    config.GEMINI_API_KEY = answers.apiKey.trim();

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('✅ Gemini API key updated successfully.');
  }
}
async function getValidLLM(passedLLM) {
  let llm = passedLLM?.toLowerCase();
  if (!allowedLLMs.includes(llm)) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'llm',
        message: 'Invalid LLM provider selected. Please choose a valid one:',
        choices: allowedLLMs,
        default: 'perplexity'
      }
    ]);
    llm = answer.llm;
  }
  config.lastLLM = llm; // 'gemini' or 'perplexity'
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  return llm;
}
async function promptForRegion() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'awsregion',
      message: 'Enter your default AWS region:',
      validate: input => input.trim() !== '' || 'Default region required'
    }
  ]);
  config.AWS_REGION = answers.awsregion.trim();

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log('✅ Default AWS region updated.');
}
async function printReadableCost(costData, service, granularity) {
  const result = costData.ResultsByTime[0];

  console.log(`\n🧾 AWS Cost Summary\n`);

  console.log(`Service: ${service}`);
  console.log(`Time Period: ${result.TimePeriod.Start} to ${result.TimePeriod.End}`);
  console.log(`Granularity: ${granularity}`);
  console.log(`Estimated: ${result.Estimated ? 'Yes' : 'No'}`);

  const totalCost = result.Total.UnblendedCost.Amount;
  const unit = result.Total.UnblendedCost.Unit;

  console.log(`Total Cost: $${parseFloat(totalCost).toFixed(2)} ${unit}\n`);
}
async function main(query, llmProvider) {
  try {
    let API_KEY;
    if (llmProvider == 'perplexity') {
      await ensurePerplexityKey();
      API_KEY = config.PERPLEXITY_API_KEY;
    } else {
      await ensureGeminiKey();
      API_KEY = config.GEMINI_API_KEY;
    }

    console.log(`🔎 Processing query: "${query}"`);

    // Pass API key to parser if needed
    const parsed = await parseQuery(query, API_KEY, llmProvider);
    if (!config.AWS_REGION) {
      await promptForRegion();
    }
    const costData = await fetchCost(
      parsed.service,
      parsed.start_date,
      parsed.end_date,
      parsed.granularity
    );

    printReadableCost(costData, parsed.service, parsed.granularity);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

program
  .name('cost')
  .description('AWS Cost Manager CLI with NLP')
  .version('1.0.0')
  .option('--edit-api-key', 'Edit Perplexity API Key')
  .option('--llm <provider>', 'Specify LLM provider: perplexity or gemini')
  .arguments('[query...]')
  .action(async (query) => {
    // Check if --edit-api-key is passed
    let llmProvider = config.lastLLM;
    if(program.opts().llm){
      llmProvider = await getValidLLM(program.opts().llm);
    }
    
    if (program.opts().editApiKey) {
      await editApiKey(llmProvider);
      process.exit(0);
    }

    let joinedQuery = query.join(" ");
    if (!joinedQuery.trim()) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'userQuery',
          message: 'Enter your AWS cost query:',
          validate: input => input.trim() !== '' || 'Query cannot be empty'
        }
      ]);
      joinedQuery = answer.userQuery.trim();
    }
    await main(joinedQuery, llmProvider);
  });
program.addHelpText('before', `
Examples:
  $ cost how much did I spend on EC2 last month
  $ cost --edit-api-key
  $ cost --llm gemini
`);
program.parse();