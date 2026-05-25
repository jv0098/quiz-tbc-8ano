const FORMSPREE_URL = "https://formspree.io/f/xaqkdlby";

const rawQuestions = [
    {
        q: "O que é a tuberculose?",
        o: [
            "Uma doença causada por vírus",
            "Uma doença causada por bactéria",
            "Uma alergia respiratória",
            "Uma doença genética"
        ],
        a: 1,
        exp: "A tuberculose é causada por uma bactéria."
    },

    {
        q: "Qual destes é um sintoma comum da tuberculose?",
        o: [
            "Dor de ouvido",
            "Tosse persistente",
            "Quebra de braço",
            "Coceira na pele"
        ],
        a: 1,
        exp: "A tosse persistente é um dos sintomas mais comuns."
    },

    {
        q: "Como a tuberculose pode ser transmitida?",
        o: [
            "Pelo consumo de água contaminada",
            "Pelo ar, através da tosse e espirro",
            "Pelo toque nas mãos",
            "Pela picada de mosquito"
        ],
        a: 1,
        exp: "A transmissão acontece pelo ar."
    },

    {
        q: "Qual destes NÃO é sintoma da tuberculose?",
        o: [
            "Tosse longa",
            "Febre",
            "Suor noturno",
            "Quebra de braço"
        ],
        a: 3,
        exp: "Quebra de braço não tem relação com tuberculose."
    },

    {
        q: "Se uma pessoa tosse por muitas semanas, ela deve:",
        o: [
            "Ignorar",
            "Procurar atendimento médico",
            "Fazer exercício",
            "Tomar sorvete"
        ],
        a: 1,
        exp: "É importante procurar ajuda médica."
    },

    {
        q: "Qual hábito ajuda a evitar doenças respiratórias?",
        o: [
            "Lavar as mãos",
            "Compartilhar garrafas",
            "Ficar em locais fechados",
            "Não tomar água"
        ],
        a: 0,
        exp: "Lavar as mãos ajuda a prevenir doenças."
    },

    {
        q: "A tuberculose tem cura?",
        o: [
            "Não",
            "Sim, com tratamento correto",
            "Apenas em crianças",
            "Apenas com cirurgia"
        ],
        a: 1,
        exp: "A tuberculose tem cura."
    },

    {
        q: "Qual órgão do corpo é mais afetado pela tuberculose?",
        o: [
            "Coração",
            "Pele",
            "Pulmões",
            "Estômago"
        ],
        a: 2,
        exp: "A tuberculose afeta principalmente os pulmões."
    },

    {
        q: "A vacina que ajuda a proteger contra formas graves da tuberculose chama-se:",
        o: [
            "HPV",
            "Influenza",
            "BCG",
            "Tríplice Viral"
        ],
        a: 2,
        exp: "A vacina BCG ajuda na proteção."
    },

    {
        q: "A tuberculose pode atingir outras partes do corpo além dos pulmões?",
        o: ["Verdadeiro", "Falso"],
        a: 0,
        exp: "Ela pode atingir outras partes do corpo."
    },

    {
        q: "Pessoas com tuberculose sempre apresentam sintomas imediatamente?",
        o: ["Verdadeiro", "Falso"],
        a: 1,
        exp: "Nem sempre os sintomas aparecem rápido."
    },

    {
        q: "A tuberculose é:",
        o: [
            "Genética",
            "Contagiosa",
            "Autoimune",
            "Nutricional"
        ],
        a: 1,
        exp: "A tuberculose é contagiosa."
    }
];

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');

const qNumber = document.getElementById('q-number');
const qText = document.getElementById('q-text');
const optionsContainer = document.getElementById('options-container');

const progressBar = document.getElementById('progress-bar');
const liveScore = document.getElementById('live-score');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz() {

    quizQuestions = [...rawQuestions];

    shuffle(quizQuestions);

    startScreen.classList.remove('active');
    questionScreen.classList.add('active');

    document.getElementById('progress-container').style.display = 'block';

    loadQuestion();
}

function loadQuestion() {

    selectedOptionIndex = null;

    nextBtn.disabled = true;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    qNumber.textContent =
        `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;

    qText.textContent = currentQuestion.q;

    progressBar.style.width =
        `${(currentQuestionIndex / quizQuestions.length) * 100}%`;

    optionsContainer.innerHTML = "";

    document.getElementById('kids-message').innerHTML = "";

    currentQuestion.o.forEach((option, index) => {

        const li = document.createElement('li');

        li.className = 'option-item';

        li.textContent = option;

        li.addEventListener('click', () => {

            if (selectedOptionIndex !== null) return;

            selectedOptionIndex = index;

            const allOptions =
                optionsContainer.querySelectorAll('.option-item');

            allOptions.forEach(item => {
                item.style.pointerEvents = 'none';
            });

            if (index === currentQuestion.a) {

                li.classList.add('correct');

                score++;

                liveScore.textContent = score;

                document.getElementById('kids-message').innerHTML =
                    "🎉 Muito bem! Você acertou!";

            } else {

                li.classList.add('wrong');

                allOptions[currentQuestion.a]
                    .classList.add('correct');

                document.getElementById('kids-message').innerHTML =
                    "😔 Quase! Continue tentando!";
            }

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

    document.getElementById('final-score').textContent = score;

    const feedback = document.getElementById('feedback-msg');

    if (score >= 10) {

        feedback.innerHTML = "🏆 Excelente!";

    } else if (score >= 6) {

        feedback.innerHTML = "👏 Muito bom!";

    } else {

        feedback.innerHTML = "📚 Continue estudando!";
    }
}

startBtn.addEventListener('click', startQuiz);

nextBtn.addEventListener('click', nextQuestion);    