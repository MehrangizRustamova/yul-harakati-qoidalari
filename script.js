// Enhanced Language and Theme Management
let currentLanguage = 'uz';
let currentTheme = 'light';

// Enhanced language switching with animations
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-uz], [data-ru]').forEach(element => {
        if (element.tagName === 'BUTTON') {
            element.textContent = element.getAttribute(`data-${lang}`);
        } else {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Update quiz questions if on quiz page
    if (document.getElementById('quiz')) {
        updateQuizLanguage(lang);
    }
}

// Enhanced theme switching with smooth transitions
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (currentTheme === 'light') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.textContent = '🌙';
        currentTheme = 'dark';
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.textContent = '🌞';
        currentTheme = 'light';
    }
}

// Enhanced quiz functionality
function buildQuiz() {
    const quizContainer = document.getElementById('quiz');
    const output = [];
    
    // Add loading spinner
    quizContainer.innerHTML = '<div class="spinner"></div>';
    
    setTimeout(() => {
        quizData[currentLanguage].forEach((currentQuestion, questionNumber) => {
            const options = [];
            
            for (let i = 0; i < currentQuestion.options.length; i++) {
                options.push(
                    `<label class="option-label fade-in" style="animation-delay: ${i * 0.1}s; display: block; margin-bottom: 15px; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">
                        <input type="radio" name="question${questionNumber}" value="${i}" style="margin-right: 10px;">
                        <span class="option-text">${currentQuestion.options[i]}</span>
                    </label>`
                );
            }

            output.push(
                `<div class="question fade-in" style="animation-delay: ${questionNumber * 0.2}s; margin-bottom: 40px; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background-color: white; border: none;">
                    <h3 style="margin-bottom: 20px; padding-bottom: 10px;">${questionNumber + 1}. ${currentQuestion.question}</h3>
                    <div class="options" style="margin-left: 15px">
                        ${options.join('')}
                    </div>
                </div>`
            );
        });

        // Bosh sahifaga qaytish tugmasini qo'shish
        output.push(`
            <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
                <a href="index.html" class="back-button" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Bosh sahifaga qaytish</a>
            </div>
        `);

        quizContainer.innerHTML = output.join('');
    }, 500);
}

// Enhanced form handling with validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message error';
            errorMessage.textContent = getTranslation(
                'Bu maydonni to\'ldirish majburiy',
                'Это поле обязательно для заполнения'
            );
            input.parentNode.appendChild(errorMessage);
            
            // Remove error class and message after 3 seconds
            setTimeout(() => {
                input.classList.remove('error');
                errorMessage.remove();
            }, 3000);
        }
    });
    
    return isValid;
}

// Enhanced feedback system
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) return;
    
    const feedbackData = {
        title: document.getElementById('feedbackTitle').value,
        text: document.getElementById('feedbackText').value,
        rating: document.getElementById('feedbackRating').value,
        date: new Date().toLocaleDateString(),
        user: localStorage.getItem('personalData') ? JSON.parse(localStorage.getItem('personalData')).fullName : 'Anonim'
    };
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner"></div>';
    
    // Simulate API call
    setTimeout(() => {
        // Save feedback to localStorage
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.push(feedbackData);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        
        // Display the feedback
        displayFeedback(feedbackData);
        
        // Reset form
        e.target.reset();
        document.getElementById('feedbackRating').value = '0';
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'message success';
        successMessage.textContent = getTranslation(
            'Fikringiz uchun rahmat!',
            'Спасибо за ваш отзыв!'
        );
        e.target.appendChild(successMessage);
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }, 1000);
}

// Enhanced personal cabinet functionality
function handlePersonalFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) return;
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        passport: document.getElementById('passport').value,
        license: document.getElementById('license').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        carModel: document.getElementById('carModel').value,
        carNumber: document.getElementById('carNumber').value,
        carYear: document.getElementById('carYear').value
    };
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner"></div>';
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage
        localStorage.setItem('personalData', JSON.stringify(formData));
        
        // Display the information
        displayPersonalInfo(formData);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'message success';
        successMessage.textContent = getTranslation(
            'Ma\'lumotlar saqlandi',
            'Данные сохранены'
        );
        e.target.appendChild(successMessage);
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }, 1000);
}

// Enhanced more fines button functionality
function handleMoreFinesClick() {
    const showMoreFinesBtn = document.getElementById('showMoreFines');
    const moreFinesSection = document.getElementById('moreFines');
    
    isMoreFinesVisible = !isMoreFinesVisible;
    
    if (isMoreFinesVisible) {
        moreFinesSection.style.display = 'block';
        moreFinesSection.classList.add('fade-in');
        showMoreFinesBtn.textContent = getTranslation('Kamroq', 'Меньше');
    } else {
        moreFinesSection.classList.remove('fade-in');
        setTimeout(() => {
            moreFinesSection.style.display = 'none';
        }, 300);
        showMoreFinesBtn.textContent = getTranslation('Batafsil', 'Подробнее');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for language and theme
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.getAttribute('data-lang'));
        });
    });
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Initialize quiz if on quiz page
    if (document.getElementById('quiz')) {
        buildQuiz();
    }
    
    // Add event listeners for forms if they exist
    const personalForm = document.getElementById('personalForm');
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (personalForm) {
        personalForm.addEventListener('submit', handlePersonalFormSubmit);
    }
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
    
    // Add event listener for more fines button if it exists
    const showMoreFinesBtn = document.getElementById('showMoreFines');
    if (showMoreFinesBtn) {
        showMoreFinesBtn.addEventListener('click', handleMoreFinesClick);
    }
    
    // Load saved data if on personal cabinet page
    if (document.getElementById('personalInfo')) {
        const savedData = localStorage.getItem('personalData');
        if (savedData) {
            displayPersonalInfo(JSON.parse(savedData));
        }
        
        const savedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        savedFeedbacks.forEach(feedback => displayFeedback(feedback));
    }
});

// Quiz questions in both languages
const quizData = {
    uz: [
        {
            question: "Tezlik chegarasi shahar ichida qancha?",
            options: ["60 km/soat", "70 km/soat", "80 km/soat", "90 km/soat"],
            correct: 0
        },
        {
            question: "Qizil chiroq nimani anglatadi?",
            options: ["To'xtash", "Tayyorlanish", "Harakatlanish", "Ogohlantirish"],
            correct: 0
        },
        {
            question: "Kamar bog'lash...",
            options: ["Majburiy", "Ixtiyoriy", "Faqat shaharda", "Faqat shahar tashqarisida"],
            correct: 0
        },
        {
            question: "Piyodalar qayerdan o'tishi kerak?",
            options: ["Belgilangan joylardan", "Har qanday joydan", "Avtomobil yo'lidan", "Tramvay yo'lidan"],
            correct: 0
        },
        {
            question: "O'tish qanday tomondan amalga oshirilishi kerak?",
            options: ["Chap tomondan", "O'ng tomondan", "Har qanday tomondan", "Markazdan"],
            correct: 0
        },
        {
            question: "Spirtli ichimlik ichib haydash...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 2
        },
        {
            question: "Sariq chiroq nimani anglatadi?",
            options: ["To'xtash", "Tayyorlanish", "Harakatlanish", "Ogohlantirish"],
            correct: 1
        },
        {
            question: "Yashil chiroq nimani anglatadi?",
            options: ["To'xtash", "Tayyorlanish", "Harakatlanish", "Ogohlantirish"],
            correct: 2
        },
        {
            question: "Qo'l telefonidan foydalanib haydash...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 2
        },
        {
            question: "Farlarni yoqish...",
            options: ["Tungi vaqtda majburiy", "Ixtiyoriy", "Faqat shahar tashqarisida", "Faqat shaharda"],
            correct: 0
        },
        {
            question: "Avtobus bekati qayerda joylashgan?",
            options: ["Yo'lning o'ng tomonida", "Yo'lning chap tomonida", "Yo'lning markazida", "Har qanday joyda"],
            correct: 0
        },
        {
            question: "Tramvay yo'lidan o'tish...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 2
        },
        {
            question: "Yuk mashinasi tezligi...",
            options: ["60 km/soat", "70 km/soat", "80 km/soat", "90 km/soat"],
            correct: 0
        },
        {
            question: "Avtobus bekati oldida to'xtash...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 2
        },
        {
            question: "Piyodalar o'tish joyi oldida to'xtash...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 2
        },
        {
            question: "Tungi vaqtda farlarni yoqish...",
            options: ["Majburiy", "Ixtiyoriy", "Faqat shaharda", "Faqat shahar tashqarisida"],
            correct: 0
        },
        {
            question: "Avtomobil yo'lida piyodalar...",
            options: ["Yurishi mumkin", "Yurishi taqiqlanadi", "Faqat kechasi", "Faqat kunduzi"],
            correct: 1
        },
        {
            question: "Avtobus bekati oldida tezlik...",
            options: ["Kamaytirilishi kerak", "Oshirilishi kerak", "O'zgarmas bo'lishi kerak", "To'xtatilishi kerak"],
            correct: 0
        },
        {
            question: "Yuk mashinasi orqasida haydash...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 0
        },
        {
            question: "Avtobus bekati oldida to'xtash...",
            options: ["Ruxsat etiladi", "Jarimalanadi", "Taqiqlanadi", "Ogohlantiriladi"],
            correct: 2
        }
    ],
    ru: [
        {
            question: "Какое ограничение скорости в городе?",
            options: ["60 км/ч", "70 км/ч", "80 км/ч", "90 км/ч"],
            correct: 0
        },
        {
            question: "Что означает красный свет?",
            options: ["Стоп", "Приготовиться", "Движение", "Предупреждение"],
            correct: 0
        },
        {
            question: "Пристегивание ремня безопасности...",
            options: ["Обязательно", "По желанию", "Только в городе", "Только за городом"],
            correct: 0
        },
        {
            question: "Где должны переходить пешеходы?",
            options: ["В установленных местах", "В любом месте", "Только в городе", "Только за городом"],
            correct: 0
        },
        {
            question: "С какой стороны должен осуществляться обгон?",
            options: ["Слева", "Справа", "С любой стороны", "По центру"],
            correct: 0
        },
        {
            question: "Вождение в состоянии алкогольного опьянения...",
            options: ["Разрешено", "Штрафуется", "Запрещено", "Предупреждается"],
            correct: 2
        },
        {
            question: "Что означает желтый свет?",
            options: ["Стоп", "Приготовиться", "Движение", "Предупреждение"],
            correct: 1
        },
        {
            question: "Что означает зеленый свет?",
            options: ["Стоп", "Приготовиться", "Движение", "Предупреждение"],
            correct: 2
        },
        {
            question: "Использование мобильного телефона во время вождения...",
            options: ["Разрешено", "Штрафуется", "Запрещено", "Предупреждается"],
            correct: 2
        },
        {
            question: "Включение фар...",
            options: ["Обязательно ночью", "По желанию", "Только за городом", "Только в городе"],
            correct: 0
        },
        {
            question: "Где расположена автобусная остановка?",
            options: ["С правой стороны дороги", "С левой стороны дороги", "В центре дороги", "В любом месте"],
            correct: 0
        },
        {
            question: "Пересечение трамвайных путей...",
            options: ["Разрешено", "Штрафуется", "Запрещено", "Предупреждается"],
            correct: 2
        },
        {
            question: "Скорость грузового автомобиля...",
            options: ["60 км/ч", "70 км/ч", "80 км/ч", "90 км/ч"],
            correct: 0
        },
        {
            question: "Остановка перед автобусной остановкой...",
            options: ["Разрешена", "Штрафуется", "Запрещена", "Предупреждается"],
            correct: 2
        },
        {
            question: "Остановка перед пешеходным переходом...",
            options: ["Разрешена", "Штрафуется", "Запрещена", "Предупреждается"],
            correct: 2
        },
        {
            question: "Включение фар в ночное время...",
            options: ["Обязательно", "По желанию", "Только в городе", "Только за городом"],
            correct: 0
        },
        {
            question: "Пешеходы на проезжей части...",
            options: ["Могут ходить", "Запрещено ходить", "Только ночью", "Только днем"],
            correct: 1
        },
        {
            question: "Скорость перед автобусной остановкой...",
            options: ["Должна быть снижена", "Должна быть увеличена", "Должна быть постоянной", "Должна быть остановлена"],
            correct: 0
        },
        {
            question: "Движение за грузовым автомобилем...",
            options: ["Разрешено", "Штрафуется", "Запрещено", "Предупреждается"],
            correct: 0
        },
        {
            question: "Остановка перед автобусной остановкой...",
            options: ["Разрешена", "Штрафуется", "Запрещена", "Предупреждается"],
            correct: 2
        }
    ]
};

// Update quiz language
function updateQuizLanguage(lang) {
    currentLanguage = lang;
    buildQuiz();
}

// Show results
function showResults() {
    const quizContainer = document.getElementById('quiz');
    const answerContainers = quizContainer.querySelectorAll('.options');
    let numCorrect = 0;

    quizData[currentLanguage].forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        if (userAnswer == currentQuestion.correct) {
            numCorrect++;
            answerContainers[questionNumber].style.color = '#4CAF50';
        } else {
            answerContainers[questionNumber].style.color = '#f44336';
        }
    });

    const resultsContainer = document.getElementById('results');
    const percentage = Math.round((numCorrect / quizData[currentLanguage].length) * 100);
    let message = '';
    
    if (currentLanguage === 'uz') {
        if (percentage >= 80) {
            message = 'Ajoyib! Siz juda yaxshi natija ko\'rsatdingiz!';
        } else if (percentage >= 60) {
            message = 'Yaxshi! Siz yaxshi natija ko\'rsatdingiz!';
        } else {
            message = 'Qayta o\'rganish tavsiya etiladi!';
        }
    } else {
        if (percentage >= 80) {
            message = 'Отлично! Вы показали очень хороший результат!';
        } else if (percentage >= 60) {
            message = 'Хорошо! Вы показали хороший результат!';
        } else {
            message = 'Рекомендуется повторить обучение!';
        }
    }

    resultsContainer.innerHTML = `
        <div class="results-message">
            <h3>${message}</h3>
            <p>${currentLanguage === 'uz' ? 'Siz' : 'Вы'} ${numCorrect} ${currentLanguage === 'uz' ? 'та savoldan to\'g\'ri javob berdingiz' : 'вопросов ответили правильно'} (${quizData[currentLanguage].length} ${currentLanguage === 'uz' ? 'та savoldan' : 'вопросов'})</p>
            <p>${currentLanguage === 'uz' ? 'Natija' : 'Результат'}: ${percentage}%</p>
        </div>
    `;
}

// Personal Cabinet Form Handling
const personalForm = document.getElementById('personalForm');
const personalInfo = document.getElementById('personalInfo');
const infoDisplay = document.querySelector('.info-display');

// Function to display personal information
function displayPersonalInfo(data) {
    const translations = {
        'To\'liq Ism': ['To\'liq Ism', 'Полное Имя'],
        'Pasport': ['Pasport Seriyasi va Raqami', 'Серия и Номер Паспорта'],
        'Guvohnoma': ['Haydovchilik Guvohnomasi', 'Водительское Удостоверение'],
        'Telefon': ['Telefon Raqami', 'Номер Телефона'],
        'Email': ['Elektron Pochta', 'Электронная Почта'],
        'Manzil': ['Manzil', 'Адрес'],
        'Avtomobil': ['Avtomobil Ma\'lumotlari', 'Данные Автомобиля']
    };
    
    const currentLang = document.querySelector('.lang-btn.active').dataset.lang;
    
    infoDisplay.innerHTML = `
        <div class="info-item">
            <strong>${translations['To\'liq Ism'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.fullName}</span>
        </div>
        <div class="info-item">
            <strong>${translations['Pasport'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.passport}</span>
        </div>
        <div class="info-item">
            <strong>${translations['Guvohnoma'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.license}</span>
        </div>
        <div class="info-item">
            <strong>${translations['Telefon'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.phone}</span>
        </div>
        <div class="info-item">
            <strong>${translations['Email'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.email}</span>
        </div>
        <div class="info-item">
            <strong>${translations['Manzil'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.address}</span>
        </div>
        <div class="info-item">
            <strong>${translations['Avtomobil'][currentLang === 'uz' ? 0 : 1]}:</strong>
            <span>${data.carModel}, ${data.carNumber}, ${data.carYear}</span>
        </div>
    `;
}

// Feedback System
const feedbackForm = document.getElementById('feedbackForm');
const feedbackList = document.getElementById('feedbackList');
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('feedbackRating');

// Star rating functionality
stars.forEach(star => {
    star.addEventListener('click', function() {
        const rating = this.dataset.rating;
        ratingInput.value = rating;
        
        stars.forEach(s => {
            if (s.dataset.rating <= rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
    
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        stars.forEach(s => {
            if (s.dataset.rating <= rating) {
                s.style.color = '#f1c40f';
            }
        });
    });
    
    star.addEventListener('mouseout', function() {
        const currentRating = ratingInput.value;
        stars.forEach(s => {
            if (s.dataset.rating <= currentRating) {
                s.style.color = '#f1c40f';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
});

// Function to display feedback
function displayFeedback(feedback) {
    const currentLang = document.querySelector('.lang-btn.active').dataset.lang;
    const translations = {
        'Baholash': ['Baholash', 'Оценка'],
        'Yuborilgan sana': ['Yuborilgan sana', 'Дата отправки']
    };
    
    const feedbackItem = document.createElement('div');
    feedbackItem.className = 'feedback-item';
    feedbackItem.innerHTML = `
        <div class="feedback-item-header">
            <div class="feedback-item-title">${feedback.title}</div>
            <div class="feedback-item-rating">${'★'.repeat(feedback.rating)}</div>
        </div>
        <div class="feedback-item-text">${feedback.text}</div>
        <div class="feedback-item-meta">
            <div class="feedback-item-user">${feedback.user}</div>
            <div class="feedback-item-date">${translations['Yuborilgan sana'][currentLang === 'uz' ? 0 : 1]}: ${feedback.date}</div>
        </div>
    `;
    
    feedbackList.appendChild(feedbackItem);
}

// More Fines Button Functionality
const showMoreFinesBtn = document.getElementById('showMoreFines');
const moreFinesSection = document.getElementById('moreFines');
let isMoreFinesVisible = false;

// Test savollari
const questions = [
    {
        question: "Shahar ichida maksimal tezlik chegarasi qancha?",
        options: ["50 km/soat", "60 km/soat", "70 km/soat", "80 km/soat"],
        correctAnswer: 1
    },
    {
        question: "Qizil chiroq yonganda nima qilish kerak?",
        options: ["To'xtash", "Sekinlash", "O'tib ketish", "Signal berish"],
        correctAnswer: 0
    },
    // ... boshqa savollar ...
];

let currentQuestion = 0;
let correctAnswers = 0;
let timer;

// Boshlash tugmasini ishga tushirish
document.getElementById('startQuiz').addEventListener('click', function() {
    document.querySelector('.quiz-start').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    showQuestion();
    startTimer();
});

// Savolni ko'rsatish
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    
    const options = document.querySelectorAll('.option-btn');
    options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.onclick = () => checkAnswer(index);
    });
    
    document.getElementById('current-question').textContent = currentQuestion + 1;
}

// Javobni tekshirish
function checkAnswer(selectedOption) {
    const question = questions[currentQuestion];
    if (selectedOption === question.correctAnswer) {
        correctAnswers++;
    }
    
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
        resetTimer();
    } else {
        showResults();
    }
}

// Natijalarni ko'rsatish
function showResults() {
    clearInterval(timer);
    document.getElementById('quiz-questions').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    const percentage = (correctAnswers / questions.length) * 100;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('wrong-answers').textContent = questions.length - correctAnswers;
    
    const resultCircle = document.querySelector('.result-circle');
    const statusText = document.getElementById('status-text');
    const statusDescription = document.getElementById('status-description');
    
    if (percentage >= 71) {
        resultCircle.style.backgroundColor = '#4CAF50';
        statusText.textContent = 'Test muvaffaqiyatli topshirildi';
        statusDescription.textContent = 'Tabriklaymiz! Siz testdan muvaffaqiyatli o\'tdingiz.';
    } else if (percentage >= 51) {
        resultCircle.style.backgroundColor = '#FFC107';
        statusText.textContent = 'Yaxshi natija';
        statusDescription.textContent = 'Yaxshi natija, lekin takrorlash kerak.';
    } else {
        resultCircle.style.backgroundColor = '#F44336';
        statusText.textContent = 'Test topshirilmadi';
        statusDescription.textContent = 'Test qayta topshirilishi kerak.';
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
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion();
                startTimer();
            } else {
                showResults();
            }
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