const quizData = [
    {
        question: "Какой поисковик принадлежит компании Яндекс?",
        options: ["Google", "Bing", "Yandex", "DuckDuckGo"],
        correct: 2
    },
    {
        question: "Какой браузер создала компания Google?",
        options: ["Firefox", "Safari", "Chrome", "Opera"],
        correct: 2
    },
    {
        question: "Что такое 'операционная система'?",
        options: ["Программа для рисования", "Программа для печати текста", "Программное обеспечение для управления компьютером", "Антивирусная программа"],
        correct: 2
    },
    {
        question: "Что такое Wi-Fi?",
        options: ["Проводное подключение к интернету", "Беспроводная сеть", "Тип компьютера", "Клавиатура"],
        correct: 1
    },
    {
        question: "Как расшифровывается 'USB'?",
        options: ["Universal Serial Bus", "United System Board", "Universal Service Box", "Under System Base"],
        correct: 0
    },
    {
        question: "Что делает клавиша 'Ctrl + C'?",
        options: ["Вырезать", "Вставить", "Копировать", "Сохранить"],
        correct: 2
    },
    {
        question: "Что такое 'IP-адрес'?",
        options: ["Пароль от Wi-Fi", "Название сайта", "Уникальный идентификатор устройства в сети", "Тип браузера"],
        correct: 2
    },
    {
        question: "Какой из этих языков используется для стилей?",
        options: ["HTML", "CSS", "PHP", "Python"],
        correct: 1
    },
    {
        question: "Что такое 'облачное хранилище'?",
        options: ["Хранение файлов на сервере в интернете", "Флешка", "Внешний жесткий диск", "DVD-диск"],
        correct: 0
    },
    {
	question: "Что означает аббревиатура 'HTML'?",
        options: ["Home Tool Markup Language", "Hyper Text Markup Language", "Hyperlinks Text Management Language", "High Tech Modern Language"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);
let isQuizFinished = false;

const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextButton = document.getElementById('nextButton');
const resultsButton = document.getElementById('resultsButton');
const resultsContainer = document.getElementById('resultsContainer');

function updateProgressAndCounter() {
    const percent = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = percent + '%';
    questionCounter.textContent = 'Вопрос ' + (currentQuestionIndex + 1) + ' из ' + quizData.length;
}

function renderCurrentQuestion() {
    const question = quizData[currentQuestionIndex];
    questionText.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'option-btn';
        
        const userAnswer = userAnswers[currentQuestionIndex];
        if (userAnswer !== null) {
            btn.disabled = true;
            
            if (idx === question.correct) {
                btn.classList.add('correct');
            }
            
            if (idx === userAnswer && idx !== question.correct) {
                btn.classList.add('wrong');
            }
        } else {
            btn.addEventListener('click', function() {
                userAnswers[currentQuestionIndex] = idx;
                renderCurrentQuestion();
                checkIfAllQuestionsAnswered();
            });
        }
        
        optionsContainer.appendChild(btn);
    });
    
    const isAnswered = userAnswers[currentQuestionIndex] !== null;
    nextButton.style.display = isAnswered ? 'block' : 'none';
}

function checkIfAllQuestionsAnswered() {
    const allAnswered = userAnswers.every(function(answer) {
        return answer !== null;
    });
    
    if (allAnswered && !isQuizFinished) {
        resultsButton.style.display = 'block';
    } else {
        resultsButton.style.display = 'none';
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex + 1 >= quizData.length) {
        nextButton.style.display = 'none';
        checkIfAllQuestionsAnswered();
        return;
    }
    
    currentQuestionIndex++;
    updateProgressAndCounter();
    renderCurrentQuestion();
    checkIfAllQuestionsAnswered();
}

function calculateScore() {
    let score = 0;
    for (let i = 0; i < quizData.length; i++) {
        if (userAnswers[i] === quizData[i].correct) {
            score++;
        }
    }
    return score;
}

function showResults() {
    if (!isQuizFinished) {
        isQuizFinished = true;
        
        document.querySelector('.question-header').style.display = 'none';
        questionText.style.display = 'none';
        optionsContainer.style.display = 'none';
        nextButton.style.display = 'none';
        resultsButton.style.display = 'none';
        
        resultsContainer.style.display = 'block';
        
        const score = calculateScore();
        const total = quizData.length;
        
        const finalScoreDiv = document.getElementById('finalScore');
        finalScoreDiv.textContent = 'Правильных ответов: ' + score + ' из ' + total + ' (' + Math.round(score/total*100) + '%)';
        
        const answersReviewDiv = document.getElementById('answersReview');
        answersReviewDiv.innerHTML = '';
        
        for (let i = 0; i < quizData.length; i++) {
            const q = quizData[i];
            const userAnswerIdx = userAnswers[i];
            const isCorrect = (userAnswerIdx === q.correct);
            
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            if (isCorrect) {
                reviewItem.classList.add('correct-review');
            } else {
                reviewItem.classList.add('wrong-review');
            }
            
            const userAnswerText = (userAnswerIdx !== null) ? q.options[userAnswerIdx] : 'Нет ответа';
            const correctAnswerText = q.options[q.correct];
            
            reviewItem.innerHTML = '<strong>Вопрос ' + (i + 1) + ':</strong> ' + q.question + '<br>' +
                'Ваш ответ: ' + userAnswerText + '<br>' +
                'Правильный ответ: ' + correctAnswerText;
            
            answersReviewDiv.appendChild(reviewItem);
        }
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    isQuizFinished = false;
    
    resultsContainer.style.display = 'none';
    
    document.querySelector('.question-header').style.display = 'flex';
    questionText.style.display = 'block';
    optionsContainer.style.display = 'flex';
    
    updateProgressAndCounter();
    renderCurrentQuestion();
    resultsButton.style.display = 'none';
    nextButton.style.display = 'none';
}

function init() {
    updateProgressAndCounter();
    renderCurrentQuestion();
    checkIfAllQuestionsAnswered();
    
    nextButton.addEventListener('click', goToNextQuestion);
    resultsButton.addEventListener('click', showResults);
    document.getElementById('restartButton').addEventListener('click', restartQuiz);
}

init();