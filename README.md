# 🚀 AWS Cost Analyzer CLI with Natural Language Processing

&#x20;

---

## 📝 Overview

**AWS Cost Analyzer CLI** is a powerful command-line tool enabling developers, cloud architects, and finance teams to **analyze their AWS costs using natural language queries**.

It leverages:

- **AWS Cost Explorer API** for accurate cost and usage data
- **Large Language Models (LLMs)** like ChatGPT or Perplexity to parse human-friendly questions into structured API calls

---

## ✨ Key Features

✅ Query AWS cost data using plain English\
✅ Supports **daily, monthly, or hourly granularity**\
✅ Filters costs by specific AWS services or across all services\
✅ Outputs clean, readable summaries in your terminal\
✅ Secure integration using environment variables\
✅ Modular, extensible, and ready for CI/CD integration

---

## 💡 Example Use Cases

🔹 “What was my EC2 cost last week?”\
🔹 “Show my monthly S3 spend for June 2025.”\
🔹 “How much did I spend on Lambda yesterday?”

---

## 📦 Installation

```bash
git clone https://github.com/UtkarshShankar/AWS_Cost_Manager_CLI.git
cd aws-cost-analyzer-cli
npm install
```

---

## 🔑 Prerequisites

1. **AWS Account** with Cost Explorer enabled
2. **IAM user** with `AWSBillingReadOnlyAccess` permissions
3. **AWS credentials** configured via environment variables or AWS CLI
4. **OpenAI or Perplexity API Key** for natural language parsing
5. **Node.js v18.x or above**

---

## ⚙️ Configuration

Create a `.env` file in the project root:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

OPENAI_API_KEY=your_openai_api_key
```

---

## 🚀 Usage

Run the CLI with your query:

```bash
node index.js "What was my EC2 cost last week?"
```

### 📤 Sample Output

```
🧾 AWS Cost Summary
Service: Amazon Elastic Compute Cloud
Time Period: 2025-07-08 to 2025-07-15
Granularity: DAILY
Total Cost: $23.54
```

---

## 🛠️ Tech Stack

- **Node.js**
- **AWS SDK v3**
- **OpenAI or Perplexity API**
- **dotenv** for environment management

---

## 📈 Roadmap & Future Enhancements

✅ **MVP (Current)**

- Natural language parsing for AWS cost queries
- Daily and monthly cost summaries
- CLI interface

🔜 **Upcoming Features**

- 🔧 **Alexa Skill Integration** to ask AWS cost questions via voice
- 🤖 **Integration with Slack or Teams for daily cost reports**

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
