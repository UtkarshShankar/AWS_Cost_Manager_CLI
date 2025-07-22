#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const fetchCost = require('./awsCostFetcher.js');
const parseQuery = require('./llmParser.js');

const program = new Command();

const CONFIG_DIR = path.join(os.homedir(), '.aws-cost-analyzer-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Load existing config or initialize
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
  }
}
async function editApiKey() {
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
async function main(query) {
  try {
    await ensurePerplexityKey();

    console.log(`🔎 Processing query: "${query}"`);

    // Pass API key to parser if needed
    const parsed = await parseQuery(query, config.PERPLEXITY_API_KEY);
    if (!config.AWS_REGION) {
      await promptForRegion();
    }
    const costData = await fetchCost(
      parsed.service,
      parsed.start_date,
      parsed.end_date,
      parsed.granularity
    );

    console.log("🧾 AWS Cost Summary");
    console.log(JSON.stringify(costData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

program
  .name('cost')
  .description('AWS Cost Analyzer CLI with NLP')
  .version('1.0.0')
  .option('--edit-api-key', 'Edit Perplexity API Key')
  .arguments('[query...]')
  .action(async (query) => {
    // Check if --edit-api-key is passed
    if (program.opts().editApiKey) {
      await editApiKey();
      process.exit(0);
    }

    const joinedQuery = query.join(" ");
    await main(joinedQuery);
  });

program.parse();
