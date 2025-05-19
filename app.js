// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWB1TIH1RIddytQj2lbo8x5Nj5J_fyHwg",
    authDomain: "survey-4756f.firebaseapp.com",
    projectId: "survey-4756f",
    storageBucket: "survey-4756f.firebasestorage.app",
    messagingSenderId: "420924298018",
    appId: "1:420924298018:web:afd6c43332ce4e92818b7b",
    measurementId: "G-5G3DDYWC1J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore
const db = firebase.firestore();

// Références aux éléments du DOM
const createSurveySection = document.getElementById('create-survey-section');
const participateSurveySection = document.getElementById('participate-survey-section');
const viewResultsSection = document.getElementById('view-results-section');

const createSurveyForm = document.getElementById('create-survey-form');
const surveyTitleInput = document.getElementById('survey-title');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const surveyCodeDisplay = document.getElementById('survey-code-display');
const generatedSurveyCode = document.getElementById('generated-survey-code');

const loadSurveyForm = document.getElementById('load-survey-form');
const participateSurveyCodeInput = document.getElementById('participate-survey-code');
const surveyParticipationArea = document.getElementById('survey-participation-area');
const loadedSurveyTitle = document.getElementById('loaded-survey-title');
const loadedQuestionsContainer = document.getElementById('loaded-questions-container');
const submitAnswersForm = document.getElementById('submit-answers-form');
const participationMessage = document.getElementById('participation-message');

const loadResultsForm = document.getElementById('load-results-form');
const resultsSurveyCodeInput = document.getElementById('results-survey-code');
const surveyResultsArea = document.getElementById('survey-results-area');
const resultsSurveyTitle = document.getElementById('results-survey-title');
const resultsContainer = document.getElementById('results-container');
const resultsMessage = document.getElementById('results-message');

let questionCount = 0; // Compteur pour les questions
// --- language selectore
const langSwitcher = document.getElementById("language-switcher");

function setLanguage(lang) {
    document.documentElement.lang = lang;
document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

    fetch(`lang/${lang}.json`)
        .then(response => {
            if (!response.ok) throw new Error("Language file not found");
            return response.json();
        })
        .then(data => {
            const map = [
                ["header h1", data.title],
                ["nav button:nth-child(1)", data.create],
                ["nav button:nth-child(2)", data.participate],
                ["nav button:nth-child(3)", data.results],
                ["#create-survey-section h2", data.createSurvey],
                ["label[for='survey-title']", data.surveyTitleLabel],
                ["#add-question-btn", data.addQuestion],
                ["#create-survey-form button[type='submit']", data.submitSurvey],
                ["#survey-code-display p", data.surveyCreated],
                ["#survey-code-display button", data.copyCode],
                ["#participate-survey-section h2", data.participateSurvey],
                ["label[for='participate-survey-code']", data.enterCode],
                ["#load-survey-form button", data.loadSurvey],
                ["#submit-answers-form button", data.submitAnswers],
                ["#view-results-section h2", data.viewResults],
                ["label[for='results-survey-code']", data.enterCode],
                ["#load-results-form button", data.viewResultsBtn]
            ];

            map.forEach(([selector, text]) => {
                const el = document.querySelector(selector);
                if (el && typeof text === "string") {
                    el.textContent = text;
                } else if (!el) {
                    console.warn(`Element not found for selector: ${selector}`);
                } else if (typeof text !== "string") {
                    console.warn(`Missing translation key for selector: ${selector}`);
                }
            });

            // Handle all "Copy Code" buttons reliably
            document.getElementById("copy-btn-1").textContent = data.copyCode || "Copy Code";
            document.getElementById("copy-btn-2").textContent = data.copyCode || "Copy Code";
            
            document.title = data.title || "Survey App";
            localStorage.setItem("lang", lang);
        })
        .catch(err => {
            console.error("Language loading error:", err);
        });
}

langSwitcher.addEventListener("change", (e) => setLanguage(e.target.value));

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "fr";
    langSwitcher.value = savedLang;
    setLanguage(savedLang);
});


// --- Fonctions Utilitaires ---

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    participationMessage.classList.add('hidden');
    resultsMessage.classList.add('hidden');
}

function clearForm(formElement) {
    formElement.reset();
    if (formElement.id === 'create-survey-form') {
        questionsContainer.innerHTML = '';
        questionCount = 0;
    }
    surveyCodeDisplay.classList.add('hidden');
    surveyParticipationArea.classList.add('hidden');
    surveyResultsArea.classList.add('hidden');
    participationMessage.classList.add('hidden');
    resultsMessage.classList.add('hidden');
}

function showMessage(element, message, type = 'success') {
    element.textContent = message;
    element.classList.remove('hidden');
    element.classList.remove('success-message', 'error-message');
    element.classList.add(`${type}-message`);
}

function copySurveyCode() {
    const code = generatedSurveyCode.textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code du sondage copié dans le presse-papiers !');
    }).catch(err => {
        console.error('Erreur lors de la copie du code: ', err);
    });
}

// --- Création de Sondage ---

function addQuestion() {
    questionCount++;
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-item');
    questionDiv.dataset.questionIndex = questionCount;
    questionDiv.innerHTML = `
        <label>Question ${questionCount}:</label>
        <input type="text" class="question-text" placeholder="Ex: Quelle est votre couleur préférée ?" required>
        <div class="options-container">
            <label>Options :</label>
            <div class="option-item">
                <input type="text" class="option-text" placeholder="Option 1" required>
                <button type="button" class="remove-option-btn">X</button>
            </div>
            <div class="option-item">
                <input type="text" class="option-text" placeholder="Option 2" required>
                <button type="button" class="remove-option-btn">X</button>
            </div>
        </div>
        <button type="button" class="add-option-btn">Ajouter une Option</button>
        <button type="button" class="remove-question-btn">Supprimer la Question</button>
    `;
    questionsContainer.appendChild(questionDiv);

    questionDiv.querySelector('.add-option-btn').addEventListener('click', (e) => addOption(e.target.closest('.question-item').querySelector('.options-container')));
    questionDiv.querySelector('.remove-question-btn').addEventListener('click', (e) => e.target.closest('.question-item').remove());
    questionDiv.querySelectorAll('.remove-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => removeOption(e.target.closest('.option-item')));
    });
}

function addOption(optionsContainer) {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option-item');
    optionDiv.innerHTML = `
        <input type="text" class="option-text" placeholder="Nouvelle option" required>
        <button type="button" class="remove-option-btn">X</button>
    `;
    optionsContainer.appendChild(optionDiv);
    optionDiv.querySelector('.remove-option-btn').addEventListener('click', (e) => removeOption(e.target.closest('.option-item')));
}

function removeOption(optionElement) {
    if (optionElement.closest('.options-container').querySelectorAll('.option-item').length > 2) {
        optionElement.remove();
    } else {
        alert('Une question doit avoir au moins deux options.');
    }
}

addQuestionBtn.addEventListener('click', addQuestion);

createSurveyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const surveyTitle = surveyTitleInput.value.trim();
    if (!surveyTitle) {
        alert('Veuillez entrer un titre pour le sondage.');
        return;
    }

    const questions = [];
    document.querySelectorAll('.question-item').forEach(qItem => {
        const questionText = qItem.querySelector('.question-text').value.trim();
        if (!questionText) {
            alert('Veuillez remplir toutes les questions.');
            return;
        }
        const options = [];
        qItem.querySelectorAll('.option-text').forEach(opt => {
            const optionText = opt.value.trim();
            if (optionText) {
                options.push(optionText);
            }
        });
        if (options.length < 2) {
            alert(`La question "${questionText}" doit avoir au moins deux options.`);
            return;
        }
        questions.push({ text: questionText, options: options });
    });

    if (questions.length === 0) {
        alert('Veuillez ajouter au moins une question.');
        return;
    }

    try {
        const docRef = await db.collection('surveys').add({
            title: surveyTitle,
            questions: questions,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
       // clearForm(createSurveyForm);
        generatedSurveyCode.textContent = docRef.id;
        //clearForm(createSurveyForm);
        surveyCodeDisplay.classList.remove('hidden');
        clearForm(createSurveyForm);
        showMessage(surveyCodeDisplay, `Votre sondage a été créé ! Partagez ce code : ${docRef.id}`, 'success');
    } catch (error) {
        console.error("Erreur lors de la création du sondage: ", error);
        alert("Erreur lors de la création du sondage. Veuillez réessayer.");
    }
});

// --- Participation à un Sondage ---

loadSurveyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const surveyCode = participateSurveyCodeInput.value.trim();
    if (!surveyCode) {
        showMessage(participationMessage, 'Veuillez entrer un code de sondage.', 'error');
        return;
    }

    try {
        const doc = await db.collection('surveys').doc(surveyCode).get();
        if (!doc.exists) {
            showMessage(participationMessage, 'Ce code de sondage n\'existe pas.', 'error');
            surveyParticipationArea.classList.add('hidden');
            return;
        }

        const survey = doc.data();
        loadedSurveyTitle.textContent = survey.title;
        loadedQuestionsContainer.innerHTML = '';

        survey.questions.forEach((q, qIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');
            questionDiv.innerHTML = `
                <p><strong>${q.text}</strong></p>
                <div class="options-container">
                    ${q.options.map((option) => `
                        <label>
                            <input type="radio" name="question-${qIndex}" value="${option}" required>
                            ${option}
                        </label>
                    `).join('')}
                </div>
            `;
            loadedQuestionsContainer.appendChild(questionDiv);
        });
        surveyParticipationArea.classList.remove('hidden');
        participationMessage.classList.add('hidden');
    } catch (error) {
        console.error("Erreur lors du chargement du sondage: ", error);
        showMessage(participationMessage, 'Erreur lors du chargement du sondage. Veuillez réessayer.', 'error');
        surveyParticipationArea.classList.add('hidden');
    }
});

submitAnswersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const surveyCode = participateSurveyCodeInput.value.trim();
    const answers = {};
    let allAnswered = true;

    document.querySelectorAll('#loaded-questions-container .question-item').forEach((qItem, qIndex) => {
        const selectedOption = qItem.querySelector(`input[name="question-${qIndex}"]:checked`);
        if (selectedOption) {
            answers[qIndex] = selectedOption.value;
        } else {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        showMessage(participationMessage, 'Veuillez répondre à toutes les questions.', 'error');
        return;
    }

    try {
        await db.collection('responses').add({
            surveyId: surveyCode,
            answers: answers,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showMessage(participationMessage, 'Vos réponses ont été soumises avec succès !', 'success');
        clearForm(loadSurveyForm);
    } catch (error) {
        console.error("Erreur lors de la soumission des réponses: ", error);
        showMessage(participationMessage, 'Erreur lors de la soumission des réponses. Veuillez réessayer.', 'error');
    }
});

// --- Affichage des Résultats ---

loadResultsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const surveyCode = resultsSurveyCodeInput.value.trim();
    if (!surveyCode) {
        showMessage(resultsMessage, 'Veuillez entrer un code de sondage.', 'error');
        return;
    }

    try {
        const surveyDoc = await db.collection('surveys').doc(surveyCode).get();
        if (!surveyDoc.exists) {
            showMessage(resultsMessage, 'Ce code de sondage n\'existe pas.', 'error');
            surveyResultsArea.classList.add('hidden');
            return;
        }
        const surveyData = surveyDoc.data();
        resultsSurveyTitle.textContent = `Résultats du sondage : ${surveyData.title}`;
        resultsContainer.innerHTML = '';

        const responsesSnapshot = await db.collection('responses').where('surveyId', '==', surveyCode).get();
        const allResponses = responsesSnapshot.docs.map(doc => doc.data().answers);

        if (allResponses.length === 0) {
            showMessage(resultsMessage, 'Aucune réponse n\'a été soumise pour ce sondage pour le moment.', 'info');
            surveyResultsArea.classList.add('hidden');
            return;
        }
        resultsMessage.classList.add('hidden');

        surveyData.questions.forEach((question, qIndex) => {
            const questionResultDiv = document.createElement('div');
            questionResultDiv.classList.add('result-item');
            questionResultDiv.innerHTML = `<h4>${question.text}</h4>`;

            const optionCounts = {};
            question.options.forEach(option => {
                optionCounts[option] = 0;
            });

            allResponses.forEach(response => {
                const answer = response[qIndex];
                if (answer && optionCounts.hasOwnProperty(answer)) {
                    optionCounts[answer]++;
                }
            });

            const totalResponsesForQuestion = Object.values(optionCounts).reduce((sum, count) => sum + count, 0);

            question.options.forEach(option => {
                const count = optionCounts[option];
                const percentage = totalResponsesForQuestion > 0 ? ((count / totalResponsesForQuestion) * 100).toFixed(1) : 0;

                const optionResultDiv = document.createElement('div');
                optionResultDiv.innerHTML = `
                    <p>${option} : ${count} votes (${percentage}%)</p>
                    <div class="result-bar-container">
                        <div class="result-bar" style="width: ${percentage}%">${percentage > 0 ? `${percentage}%` : ''}</div>
                    </div>
                `;
                questionResultDiv.appendChild(optionResultDiv);
            });
            resultsContainer.appendChild(questionResultDiv);
        });
        surveyResultsArea.classList.remove('hidden');
    } catch (error) {
        console.error("Erreur lors du chargement des résultats: ", error);
        showMessage(resultsMessage, 'Erreur lors du chargement des résultats. Veuillez réessayer.', 'error');
        surveyResultsArea.classList.add('hidden');
    }
});

// --- Initialisation : Ajouter une première question au démarrage ---
document.addEventListener('DOMContentLoaded', () => {
    addQuestion();
    showSection('create-survey-section');
});