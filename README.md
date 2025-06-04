# 📊 Simple Survey Platform

[![Firebase](https://img.shields.io/badge/Firebase-Backend-yellow?logo=firebase)](https://firebase.google.com/)
[![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Developed by **Mohamed Ali**

---

## 🚀 Features

- **Create Surveys**: Design surveys with custom titles and multiple-choice questions.
- **Participate in Surveys**: Join surveys using unique codes.
- **View Results**: Real-time vote counts and percentages displayed as charts.
- **Dynamic Management**: Add/remove questions and options on the fly.
- **Multi-language Support**: Switch between 🇫🇷 French, 🇺🇸 English, and 🇸🇦 Arabic. Preferences are saved locally.
- **Firebase Backend**: Reliable NoSQL database using Google Cloud Firestore.
- **Shareable Codes**: Auto-generated codes with copy-ready HTML email templates.

---

## 📚 How to Use

### 📝 Create a Survey

- Navigate to **Créer un Sondage**
- Enter a **title**
- Click **Ajouter une Question** to add a question
- Use **Ajouter une Option** to add at least 2 options per question
- Finalize with **Créer le Sondage**
- Share the generated **survey code**

### ✅ Participate in a Survey

- Go to **Participer à un Sondage**
- Enter the **survey code**
- Click **Charger le Sondage**
- Answer all questions
- Submit with **Soumettre les Réponses**

### 📊 View Results

- Navigate to **Voir les Résultats**
- Enter the **survey code**
- Click **Voir les Résultats** to display analytics

---

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Firebase Firestore (NoSQL)
- **Hosting**: Firebase Hosting (optional)

---

## 🧰 Development & Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/simple-survey-platform.git
cd simple-survey-platform

2. Set Up Firebase

Create a Firebase project on Firebase Console

Register a web app and copy the config


3. Configure Firebase

Edit app.js:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

4. Enable Firestore

In Firebase Console > Firestore Database > Create database

Choose "Production Mode" or adjust rules as needed


5. Optional: Firebase Hosting

npm install -g firebase-tools
firebase login
firebase init
firebase deploy


---

🗂️ Project Structure

.
├── index.html                  # Main UI
├── style.css                   # Styling
├── app.js                      # JS logic & Firebase
├── lang/
│   ├── en.json                 # English
│   ├── fr.json                 # French
│   └── ar.json                 # Arabic
└── survey_code_template.html   # Email template


---

📄 License

This project is licensed under the MIT License.


---

📬 Contact

Made with ❤️ by Mohamed Ali
📧 Contact Mohamed Ali



