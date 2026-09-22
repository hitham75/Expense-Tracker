Markdown
# 💰 Expense Tracker Application

An Angular-based standalone web application designed to track daily expenses, manage overall budgets, and visualize financial summaries efficiently.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### 📋 Prerequisites

Ensure you have the following installed on your system:
* **Node.js**: (v18.x or higher) -> [Download Node.js](https://nodejs.org/)
* **Angular CLI**: Installed globally via `npm install -g @angular/cli`
* **Git**: For repository control

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/hitham75/Expense-Tracker.git](https://github.com/hitham75/Expense-Tracker.git)
   cd Expense-Tracker
Install project dependencies:

Bash
npm install
🖥️ How to Run the Backend Server (JSON-Server)
The application can communicate with a mock REST API server powered by json-server. Follow these steps to get the server running:

Step 1: Ensure db.json exists
Make sure you have a db.json file in the root directory of the project with initial data:

JSON
{
  "expenses": [
    {
      "id": "1",
      "title": "Grocery Shopping",
      "category": "Food",
      "amount": 120,
      "date": "2026-09-20",
      "note": "Weekly groceries"
    },
    {
      "id": "2",
      "title": "Uber Ride",
      "category": "Transport",
      "amount": 25,
      "date": "2026-09-21",
      "note": "Commute to office"
    }
  ]
}
Step 2: Start the JSON-Server
Open a terminal inside the project directory and run:

Bash
npx json-server --watch db.json --port 3000
💡 Note: Keep this terminal window open. The API server will run at:

API Endpoint: http://localhost:3000/expenses

🏃 How to Run the Frontend (Angular App)
Open a second terminal window (keep the server terminal running).

Run the Angular development server:

Bash
ng serve
Open your browser and navigate to:

Plaintext
http://localhost:4200/
💾 LocalStorage Mode (No Server Required)
If you prefer to run the application offline without starting json-server, the app is equipped with a LocalStorage fallback mode:

Simply run ng serve directly.

All added, updated, or deleted expenses will automatically sync with your browser's local storage.

📦 Build & Deployment
Build for Production
To build the application for deployment with custom base href:

Bash
ng build --base-href /Expense-Tracker/
Deploy to GitHub Pages
To publish the latest build directly to your gh-pages branch:

Bash
npx angular-cli-ghpages --dir=dist/expense-tracker/browser
✨ Features
📝 Full CRUD Operations: Create, read, update, and delete expenses seamlessly.

📊 Budget Tracking: Automatic calculations for total expenditure and remaining balance.

🌐 REST API & LocalStorage Support: Works with json-server or standalone via browser storage.

⚠️ Form Validation & Alerts: Real-time form validation and user notifications for smooth UX.
