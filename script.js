// Link Formspree oficial configurado do Administrador
const FORMSPREE_URL = "https://formspree.io/f/xaqkdlby";

const rawQuestions = [
    {
        q: "O que é a tuberculose?",
        o: ["Uma doença causada por vírus", "Uma doença causada por bactéria", "Uma alergia respiratória", "Uma doença genética"],
        a: 1,
        exp: "A tuberculose é causada por uma bactéria."
    },
    {
        q: "Qual destes é um sintoma comum da tuberculose?",
        o: ["Dor de ouvido", "Tosse persistente", "Quebra de braço", "Coceira na pele"],
        a: 1,
        exp: "A tosse persistente é um dos sintomas mais comuns."
    },
    {
        q: "Como a tuberculose pode ser transmitida?",
        o: ["Pelo consumo de água contaminada", "Pelo ar, através da tosse e espirro", "Pelo toque nas mãos", "Pela picada de mosquito"],
        a: 1,
        exp: "A transmissão acontece pelo ar, quando uma pessoa doente tosse ou espirra."
    },
    {
        q: "Qual destes NÃO é sintoma da tuberculose?",
        o: ["Tosse longa", "Febre", "Suor noturno", "Quebra de braço"],
        a: 3,
        exp: "Quebra de braço não tem relação com tuberculose."
    },
    {
        q: "Se uma pessoa tosse por muitas semanas, ela deve:",
        o: ["Ignorar", "Procurar atendimento médico", "Fazer exercício", "Tomar sorvete"],
        a: 1,
        exp: "Tosse por muitas semanas precisa ser avaliada por um profissional de saúde."
    },
    {
        q: "Qual hábito ajuda a evitar doenças respiratórias?",
        o: ["Lavar as mãos", "Compartilhar garrafas", "Ficar em locais fechados", "Não tomar água"],
        a: 0,
        exp: "Lavar as mãos ajuda a prevenir várias doenças."
    },
    {
        q: "A tuberculose tem cura?",
        o: ["Não", "Sim, com tratamento correto", "Apenas em crianças", "Apenas com cirurgia"],
        a: 1,
        exp: "A tuberculose tem cura quando o tratamento é feito corretamente."
    },
    {
        q: "Qual órgão do corpo é mais afetado pela tuberculose?",
        o: ["Coração", "Pele", "Pulmões", "Estômago"],
        a: 2,
        exp: "A tuberculose afeta principalmente os pulmões."
    },
    {
        q: "A vacina que ajuda a proteger contra formas graves da tuberculose chama-se:",
        o: ["HPV", "Influenza", "BCG", "Tríplice Viral"],
        a: 2,
        exp: "A vacina BCG ajuda a proteger contra formas graves da tuberculose."
    },
    {
        q: "A tuberculose pode atingir outras partes do corpo além dos pulmões?",
        o: ["Verdadeiro", "Falso"],
        a: 0,
        exp: "A tuberculose pode afetar outras partes do corpo além dos pulmões."
    },
    {
        q: "Pessoas com tuberculose sempre apresentam sintomas imediatamente",
        o: ["Verdadeiro", "Falso"],
        a: 1,
        exp: "Algumas pessoas podem não apresentar sintomas logo no início."
    },
    {
        q: "Qual é o sintoma mais comum?",
        o: ["Dor no pé", "Tosse persistente", "Coceira", "Dor de dente"],
        a: 1,
        exp: "A tosse persistente é o sintoma mais comum da tuberculose pulmonar."
    },
    {
        q: "A tuberculose é:",
        o: ["Genética", "Contagiosa", "Autoimune", "Nutricional"],
        a: 1,
        exp: "A tuberculose é contagiosa e pode ser transmitida pelo ar."
    }
];

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let studentName = "";

const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const lockScreen = document.getElementById('lock-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');

const qNumber = document.getElementById('q-number');
const qText = document.getElementById('q-text');
const optionsContainer = document.getElementById('options-container');

const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkLock() {
    if (localStorage.getItem('quiz_tb_concluido')) {
        startScreen.classList.remove('active');
        questionScreen.classList.remove('active');
        resultScreen.classList.remove('active');
        lockScreen.classList.add('active');
        progressContainer.style.display = 'none';
        return true;
    }

    return false;
}

function startQuiz() {
    studentName = document.getElementById('student-name').value.trim();

    if (!studentName) {
        alert("Por favor, preencha seu nome antes de iniciar!");
        return;
    }

    if (checkLock()) return;

    quizQuestions = rawQuestions.map(item => {
        const correctText = item.o[item.a];
        const shuffledOptions = [...item.o];

        shuffle(shuffledOptions);

        return {
            question: item.q,
            options: shuffledOptions,
            answer: shuffledOptions.indexOf(correctText),
            correctText: correctText,
            explanation: item.exp
        };
    });

    shuffle(quizQuestions);

    startScreen.classList.remove('active');
    questionScreen.classList.add('active');

    progressContainer.style.display = 'block';

    loadQuestion();
}

function loadQuestion() {
    selectedOptionIndex = null;
    nextBtn.disabled = true;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    qNumber.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
    progressBar.style.width = `${(currentQuestionIndex / quizQuestions.length) * 100}%`;
    qText.textContent = currentQuestion.question;

    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');

        li.className = 'option-item';
        li.textContent = option;

        li.addEventListener('click', () => {
            if (selectedOptionIndex !== null) return;

            selectedOptionIndex = index;

            const allOptions = optionsContainer.querySelectorAll('.option-item');

            allOptions.forEach(item => {
                item.classList.remove('selected');
                item.style.pointerEvents = 'none';
            });

            if (index === currentQuestion.answer) {
                li.classList.add('correct');
                score++;
            } else {
                li.classList.add('wrong');
                allOptions[currentQuestion.answer].classList.add('correct');
            }

            const explanation = document.createElement('div');
            explanation.className = 'answer-feedback';

            explanation.innerHTML = `
                <div class="feedback-title">✅ Resposta correta:</div>
                <div class="feedback-answer">${currentQuestion.correctText}</div>
                <div class="feedback-exp">${currentQuestion.explanation}</div>
            `;

            optionsContainer.appendChild(explanation);
            nextBtn.disabled = false;
        });

        optionsContainer.appendChild(li);
    });
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');

    progressBar.style.width = '100%';

    document.getElementById('final-score').textContent = score;

    const feedback = document.getElementById('feedback-msg');

    if (score >= 10) {
        feedback.textContent = "✨ Excelente pontuação!";
        feedback.style.color = "var(--correct)";
    } else if (score >= 6) {
        feedback.textContent = "👍 Muito bom trabalho!";
        feedback.style.color = "var(--primary)";
    } else {
        feedback.textContent = "📚 Valeu o esforço!";
        feedback.style.color = "var(--wrong)";
    }

    localStorage.setItem('quiz_tb_concluido', 'true');

    const dados = {
        Nome: studentName,
        Nota: `${score} de ${quizQuestions.length}`
    };

    fetch(FORMSPREE_URL, {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        document.getElementById('status-delivery').textContent =
            "✅ Nota salva no banco do Professor com sucesso!";
    })
    .catch(error => {
        document.getElementById('status-delivery').textContent =
            "⚠️ Concluído! Lembre o professor de checar os envios.";
    });
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);

window.onload = checkLock;