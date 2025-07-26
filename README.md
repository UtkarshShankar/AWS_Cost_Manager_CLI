# 🚀 AWS Cost Analyzer CLI with Natural Language Processing

![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📝 Overview

**AWS Cost Analyzer CLI** is a powerful command-line tool enabling developers, cloud architects, and finance teams to **analyze their AWS costs using natural language queries**.

It leverages:

- **AWS Cost Explorer API** for accurate cost and usage data
- **Large Language Models (LLMs)** like ChatGPT or Perplexity to parse human-friendly questions into structured API calls

---

## ✨ Key Features

✅ Query AWS cost data using plain English  
✅ Supports **daily, monthly, or hourly granularity**  
✅ Filters costs by specific AWS services or across all services  
✅ Outputs clean, readable summaries in your terminal  
✅ Automatic prompt to set AWS region and API key if missing  
✅ CLI options including `--edit-api-key`, `--help`, and `--version`  
✅ Secure config stored in `~/.aws-cost-analyzer-cli/config.json`  
✅ Modular, extensible, and ready for CI/CD integration

---

## 💡 Example Use Cases

🔹 “What was my EC2 cost last week?”  
🔹 “Show my monthly S3 spend for June 2025.”  
🔹 “How much did I spend on Lambda yesterday?”

---

## 📦 Installation

```bash
git clone https://github.com/UtkarshShankar/AWS_Cost_Manager_CLI.git
cd aws-cost-analyzer-cli
npm install
npm install -g . # (for global CLI access as `cost`)
```

---

## 🔑 Prerequisites

1. **AWS Account** with Cost Explorer enabled
2. **IAM user** with `AWSBillingReadOnlyAccess` permissions
3. **AWS credentials** configured via environment variables or AWS CLI
4. **Perplexity API Key** (or OpenAI key if modified)
5. **Node.js v18.x or above**

> ⚠️ **Security Tip:** Your config file stores the API key in plain text. Ensure it is not shared or committed.

---

## ⚙️ Configuration

On the first run, the CLI will prompt for your **Perplexity API Key** and **AWS region**. These are securely stored in:  
`~/.aws-cost-analyzer-cli/config.json`

---

## 🚀 Usage

Run the CLI with a natural language query:

```bash
cost "What was my EC2 cost last week?"
```

Edit your saved API key:

```bash
cost --edit-api-key
```

Show help and usage:

```bash
cost --help
```

### 📤 Sample Output

```
🧾 AWS Cost Summary
Service: Amazon Elastic Compute Cloud
Time Period: 2025-07-01 to 2025-07-22
Granularity: MONTHLY
Estimated: Yes
Total Cost: $0.00 USD
```

---

## 🛠️ Tech Stack

- **Node.js**
- **AWS SDK v3**
- **Perplexity or OpenAI API**
- **dotenv** (legacy support) / local config
- **Commander.js** for CLI framework
- **Inquirer.js** for prompts

---

## 📚 CLI Options

| Option           | Description                             |
| ---------------- | --------------------------------------- |
| `--edit-api-key` | Prompt to update the Perplexity API Key |
| `--help`         | Show command usage info                 |
| `--version`      | Display the CLI version                 |

---

## 📈 Roadmap & Future Enhancements

✅ **MVP (Current)**

- Natural language parsing for AWS cost queries
- CLI prompts for config setup
- Formatted cost summaries in terminal

🔜 **Upcoming Features**

- 🔧 **Alexa Skill Integration** to ask AWS cost questions via voice
- 🤖 **Slack/Teams notifications** for daily cost summaries
- 🧪 **Mock/demo mode** for users without billing data
- 📁 **Export to CSV/JSON**
- 🧠 **Query history support** for repeat usage

---

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Contact

Built with ❤️ by [Utkarsh Shankar](https://github.com/UtkarshShankar).

For enterprise usage, integrations, or training queries, reach out at [utkarshshankar9@gmail.com](mailto:utkarshshankar9@gmail.com).

---

## ⭐ Support

If you find this project helpful, please star ⭐ the repository to support continued development and enhancements.
