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
        q: "Pessoas com tuberculose sempre apresentam sintomas imediatamente?",
        o: ["Verdadeiro", "Falso"],
        a: 1,
        exp: "Algumas pessoas podem não apresentar sintomas logo no início."
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

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");

const qNumber = document.getElementById("q-number");
const qText = document.getElementById("q-text");
const optionsContainer = document.getElementById("options-container");

const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");

const liveScore = document.getElementById("live-score");
const kidsMessage = document.getElementById("kids-message");
const statusDelivery = document.getElementById("status-delivery");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz() {
    const studentInput = document.getElementById("student-name");

    studentName = studentInput ? studentInput.value.trim() : "";

    if (!studentName) {
        alert("Por favor, preencha seu nome antes de iniciar!");
        return;
    }

    quizQuestions = rawQuestions.map(item => {
        const correctText = item.o[item.a];
        const shuffledOptions = [...item.o];

        shuffle(shuffledOptions);

        return {
            q: item.q,
            o: shuffledOptions,
            a: shuffledOptions.indexOf(correctText),
            correctText: correctText,
            exp: item.exp
        };
    });

    shuffle(quizQuestions);

    currentQuestionIndex = 0;
    score = 0;
    selectedOptionIndex = null;

    if (liveScore) {
        liveScore.textContent = "0";
    }

    if (statusDelivery) {
        statusDelivery.innerHTML = "📤 Enviando nota...";
    }

    startScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    questionScreen.classList.add("active");

    if (progressContainer) {
        progressContainer.style.display = "block";
    }

    loadQuestion();
}

function loadQuestion() {
    selectedOptionIndex = null;
    nextBtn.disabled = true;

    const currentQuestion = quizQuestions[currentQuestionIndex];

    qNumber.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
    qText.textContent = currentQuestion.q;

    if (progressBar) {
        progressBar.style.width = `${(currentQuestionIndex / quizQuestions.length) * 100}%`;
    }

    optionsContainer.innerHTML = "";

    if (kidsMessage) {
        kidsMessage.innerHTML = "🧠 Escolha uma resposta!";
    }

    currentQuestion.o.forEach((option, index) => {
        const li = document.createElement("li");

        li.className = "option-item";
        li.textContent = option;

        li.addEventListener("click", () => {
            if (selectedOptionIndex !== null) return;

            selectedOptionIndex = index;

            const allOptions = optionsContainer.querySelectorAll(".option-item");

            allOptions.forEach(item => {
                item.style.pointerEvents = "none";
            });

            if (index === currentQuestion.a) {
                li.classList.add("correct");
                score++;

                if (liveScore) {
                    liveScore.textContent = score;
                }

                if (kidsMessage) {
                    kidsMessage.innerHTML = `
                        🎉 Muito bem! Você acertou!
                        <br>
                        <small>${currentQuestion.exp}</small>
                    `;
                }
            } else {
                li.classList.add("wrong");

                if (allOptions[currentQuestion.a]) {
                    allOptions[currentQuestion.a].classList.add("correct");
                }

                if (kidsMessage) {
                    kidsMessage.innerHTML = `
                        😔 Quase! A resposta correta era:
                        <strong>${currentQuestion.correctText}</strong>
                        <br>
                        <small>${currentQuestion.exp}</small>
                    `;
                }
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
    questionScreen.classList.remove("active");
    resultScreen.classList.add("active");

    if (progressBar) {
        progressBar.style.width = "100%";
    }

    const finalScore = document.getElementById("final-score");
    const feedback = document.getElementById("feedback-msg");

    if (finalScore) {
        finalScore.textContent = score;
    }

    if (feedback) {
        if (score >= 10) {
            feedback.innerHTML = "🏆 Excelente! Você mandou muito bem!";
            feedback.style.color = "var(--correct)";
        } else if (score >= 6) {
            feedback.innerHTML = "👏 Muito bom! Continue estudando!";
            feedback.style.color = "var(--primary)";
        } else {
            feedback.innerHTML = "📚 Continue praticando! Você consegue melhorar!";
            feedback.style.color = "var(--wrong)";
        }
    }

    enviarResultado();
}

function enviarResultado() {
    if (statusDelivery) {
        statusDelivery.innerHTML = "📤 Enviando nota para o professor...";
    }

    const dados = {
        nome: studentName,
        nota: `${score} de ${quizQuestions.length}`,
        acertos: score,
        total: quizQuestions.length,
        data: new Date().toLocaleString("pt-BR")
    };

    fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (response.ok) {
            if (statusDelivery) {
                statusDelivery.innerHTML = "✅ Nota enviada com sucesso para o professor!";
            }
        } else {
            if (statusDelivery) {
                statusDelivery.innerHTML = "⚠️ Quiz concluído, mas houve erro ao enviar a nota.";
            }
        }
    })
    .catch(() => {
        if (statusDelivery) {
            statusDelivery.innerHTML = "❌ Erro de conexão. Use Live Server ou localhost para testar.";
        }
    });
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOptionIndex = null;
    studentName = "";

    if (liveScore) {
        liveScore.textContent = "0";
    }

    if (kidsMessage) {
        kidsMessage.innerHTML = "";
    }

    if (progressBar) {
        progressBar.style.width = "0%";
    }

    if (progressContainer) {
        progressContainer.style.display = "none";
    }

    resultScreen.classList.remove("active");
    questionScreen.classList.remove("active");
    startScreen.classList.add("active");
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);