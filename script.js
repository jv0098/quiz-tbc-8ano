// Link Formspree oficial configurado do Administrador
const FORMSPREE_URL = "https://formspree.io/f/xaqkdlby"; 

const rawQuestions = [
    { q: "O que é a tuberculose?", o: ["Uma doença causada por vírus", "Uma doença causada por bactéria", "Uma alergia respiratória", "Uma doença genética"], a: 1 },
    { q: "Qual destes é um sintoma comum da tuberculose?", o: ["Dor de ouvido", "Tosse persistente", "Quebra de braço", "Coceira na pele"], a: 1 },
    { q: "Como a tuberculose pode ser transmitida?", o: ["Pelo consumo de água contaminada", "Pelo ar, através da tosse e espirro", "Pelo toque nas mãos", "Pela picada de mosquito"], a: 1 },
    { q: "Qual destes NÃO é sintoma da tuberculose?", o: ["Tosse longa", "Febre", "Suor noturno", "Quebra de braço"], a: 3 },
    { q: "Se uma pessoa tosse por muitas semanas, ela deve:", o: ["Ignorar", "Procurar atendimento médico", "Fazer exercício", "Tomar sorvete"], a: 1 },
    { q: "Qual hábito ajuda a evitar doenças respiratórias?", o: ["Lavar as mãos", "Compartilhar garrafas", "Ficar em locais fechados", "Não tomar água"], a: 0 },
    { q: "A tuberculose tem cura?", o: ["Não", "Sim, com tratamento correto", "Apenas em crianças", "Apenas com cirurgia"], a: 1 },
    { q: "Qual órgão do corpo é mais afetado pela tuberculose?", o: ["Coração", "Pele", "Pulmões", "Estômago"], a: 2 },
    { q: "A vacina que ajuda a proteger contra formas graves da tuberculose chama-se:", o: ["HPV", "Influenza", "BCG", "Tríplice Viral"], a: 2 },
    { q: "A tuberculose pode atingir outras partes do corpo além dos pulmões?", o: ["Verdadeiro", "Falso"], a: 0 },
    { q: "Pessoas com tuberculose sempre apresentam sintomas imediatamente", o: ["Verdadeiro", "Falso"], a: 1 },
    { q: "Qual é o sintoma mais comum?", o: ["Dor no pé", "Tosse persistente", "Coceira", "Dor de dente"], a: 1 },
    { q: "A tuberculose é:", o: ["Genética", "Contagiosa", "Autoimune", "Nutricional"], a: 1 }
];

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let studentName = "";
let studentClass = "";

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
    studentClass = document.getElementById('student-class').value;

    if (!studentName || !studentClass) {
        alert("Por favor, preencha seu nome e selecione sua turma antes de iniciar!");
        return;
    }

    if (checkLock()) return;

    quizQuestions = rawQuestions.map(item => {
        const correctText = item.o[item.a];
        let shuffledOptions = [...item.o];
        shuffle(shuffledOptions);
        return {
            question: item.q,
            options: shuffledOptions,
            answer: shuffledOptions.indexOf(correctText)
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
            optionsContainer.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
            li.classList.add('selected');
            selectedOptionIndex = index;
            nextBtn.disabled = false;
        });
        optionsContainer.appendChild(li);
    });
}

function nextQuestion() {
    if (selectedOptionIndex === quizQuestions[currentQuestionIndex].answer) {
        score++;
    }
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
    if (score >= 10) { feedback.textContent = "✨ Excelente pontuação!"; feedback.style.color = "var(--correct)"; }
    else if (score >= 6) { feedback.textContent = "👍 Muito bom trabalho!"; feedback.style.color = "var(--primary)"; }
    else { feedback.textContent = "📚 Valeu o esforço!"; feedback.style.color = "var(--wrong)"; }

    localStorage.setItem('quiz_tb_concluido', 'true');

    const dados = {
        Nome: studentName,
        Turma: studentClass,
        Nota: `${score} de 13`
    };

    fetch(FORMSPREE_URL, {
        method: "POST",
        body: JSON.stringify(dados),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    }).then(response => {
        document.getElementById('status-delivery').textContent = "✅ Nota salva no banco do Professor com sucesso!";
    }).catch(error => {
        document.getElementById('status-delivery').textContent = "⚠️ Concluído! Lembre o professor de checar os envios.";
    });
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
window.onload = checkLock;