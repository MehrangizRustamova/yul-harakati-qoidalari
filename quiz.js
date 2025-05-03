import quizData from './quizData.js';

let currentQuestions = [];
let currentQuestion = 0;
let mistakes = 0;
let correctAnswers = 0;
let currentLanguage = 'uz';
let timer;
let canContinueAfterTwoMistakes = false;

// 20 ta tasodifiy savolni tanlash
function selectRandomQuestions() {
    const allQuestions = [...quizData[currentLanguage]];
    const selected = [];
    
    // Belgilangan savollarni birinchi navbatda qo'shish
    const markedQuestions = allQuestions.filter(q => q.marked);
    markedQuestions.forEach(q => {
        selected.push(q);
        const index = allQuestions.findIndex(aq => aq.id === q.id);
        allQuestions.splice(index, 1);
    });
    
    // Qolgan savollarni tasodifiy tanlash
    while (selected.length < 20 && allQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selected.push(allQuestions[randomIndex]);
        allQuestions.splice(randomIndex, 1);
    }
    
    return selected;
}

// Test boshlash
function startQuiz() {
    currentQuestions = selectRandomQuestions();
    currentQuestion = 0;
    mistakes = 0;
    correctAnswers = 0;
    document.querySelector('.quiz-start').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    showQuestion();
    startTimer();
}

// Savolni ko'rsatish
function showQuestion() {
    if (currentQuestion >= currentQuestions.length) {
        showResults(true);
        return;
    }

    const question = currentQuestions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    
    const options = document.querySelectorAll('.option-btn');
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.onclick = () => checkAnswer(index);
    });
    
    // Savolni belgilash tugmasini ko'rsatish
    const markButton = document.createElement('button');
    markButton.textContent = question.marked ? '★' : '☆';
    markButton.onclick = () => toggleMarkQuestion(question.id);
    document.querySelector('.question-container').appendChild(markButton);
    
    document.getElementById('current-question').textContent = `${currentQuestion + 1}/20`;
    document.getElementById('mistakes').textContent = `Xatolar: ${mistakes}/3`;
}

// Savolni belgilash
function toggleMarkQuestion(questionId) {
    const question = quizData[currentLanguage].find(q => q.id === questionId);
    question.marked = !question.marked;
    showQuestion();
}

// Javobni tekshirish
function checkAnswer(selectedOption) {
    const question = currentQuestions[currentQuestion];
    if (selectedOption === question.correctAnswer) {
        correctAnswers++;
    } else {
        mistakes++;
        if (mistakes === 2 && !canContinueAfterTwoMistakes) {
            showContinueOption();
            return;
        }
        if (mistakes === 3) {
            showResults(false);
            return;
        }
    }
    
    currentQuestion++;
    showQuestion();
    resetTimer();
}

// 2 ta xatodan keyin davom ettirish imkoniyatini ko'rsatish
function showContinueOption() {
    const continueDialog = document.createElement('div');
    continueDialog.innerHTML = `
        <h4>Siz 2 ta xato qildingiz</h4>
        <p>Testni davom ettirishni xohlaysizmi?</p>
        <button onclick="continueTesting()">Ha</button>
        <button onclick="showResults(false)">Yo'q</button>
    `;
    document.getElementById('quiz-questions').appendChild(continueDialog);
}

// Testni davom ettirish
function continueTesting() {
    canContinueAfterTwoMistakes = true;
    document.querySelector('.continue-dialog').remove();
    showQuestion();
}

// Natijalarni ko'rsatish
function showResults(completed) {
    if (currentQuestion < 20) {
        return; // Agar 20 ta savol tugamagan bo'lsa, natijalarni ko'rsatmaymiz
    }

    clearInterval(timer);
    document.getElementById('quiz-questions').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    const percentage = (correctAnswers / 20) * 100;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('wrong-answers').textContent = mistakes;
    
    const resultCircle = document.querySelector('.result-circle');
    const statusText = document.getElementById('status-text');
    const statusDescription = document.getElementById('status-description');
    
    if (!completed || mistakes >= 3) {
        resultCircle.style.backgroundColor = '#F44336';
        statusText.textContent = 'Test topshirilmadi';
        statusDescription.textContent = 'Test qayta topshirilishi kerak.';
    } else if (percentage >= 71) {
        resultCircle.style.backgroundColor = '#4CAF50';
        statusText.textContent = 'Test muvaffaqiyatli topshirildi';
        statusDescription.textContent = 'Tabriklaymiz! Siz testdan muvaffaqiyatli o\'tdingiz.';
    } else {
        resultCircle.style.backgroundColor = '#FFC107';
        statusText.textContent = 'Yaxshi natija';
        statusDescription.textContent = 'Yaxshi natija, lekin takrorlash kerak.';
    }
}

// Vaqt hisoblagichi
function startTimer() {
    let time = 60;
    document.getElementById('timer').textContent = time;
    
    timer = setInterval(() => {
        time--;
        document.getElementById('timer').textContent = time;
        
        if (time <= 0) {
            clearInterval(timer);
            currentQuestion++;
            showQuestion();
            startTimer();
        }
    }, 1000);
}

// Vaqtni qayta o'rnatish
function resetTimer() {
    clearInterval(timer);
    startTimer();
}

// Testni qayta boshlash
function retakeQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    showQuestion();
    startTimer();
}

// Tilni o'zgartirish
function switchLanguage(lang) {
    currentLanguage = lang;
    if (document.getElementById('quiz-questions').style.display === 'block') {
        showQuestion();
    }
}

// Event listener'larni qo'shish
document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.getAttribute('data-lang')));
});