/* =========================================================
   QUIZLAB
   Single questions.json version
========================================================= */

const THEMES = [
    {
        name: "General Knowledge",
        icon: "🌍",
        description: "People, places, facts and everyday knowledge."
    },
    {
        name: "Science",
        icon: "🧪",
        description: "Physics, chemistry, biology and discovery."
    },
    {
        name: "Mathematics",
        icon: "∑",
        description: "Numbers, logic, geometry and problem solving."
    },
    {
        name: "History",
        icon: "🏛️",
        description: "Civilizations, events and remarkable people."
    },
    {
        name: "Geography",
        icon: "🗺️",
        description: "Countries, cities, oceans and landscapes."
    },
    {
        name: "Space",
        icon: "🚀",
        description: "Planets, stars, galaxies and the universe."
    },
    {
        name: "Technology",
        icon: "⚡",
        description: "Technology, innovation and digital life."
    },
    {
        name: "Sports",
        icon: "🏆",
        description: "Games, players, rules and sporting history."
    },
    {
        name: "Animals & Nature",
        icon: "🦁",
        description: "Wildlife, ecosystems and natural wonders."
    },
    {
        name: "Literature",
        icon: "📚",
        description: "Books, authors, poetry and famous stories."
    },
    {
        name: "Computers",
        icon: "💻",
        description: "Programming, hardware, software and networks."
    },
    {
        name: "Arts & Culture",
        icon: "🎨",
        description: "Art, music, traditions and world culture."
    }
];


const AGE_GROUPS = [
    {
        name: "Kids",
        icon: "🧒",
        description: "Fun questions for curious young minds."
    },
    {
        name: "Teens",
        icon: "🎓",
        description: "A balanced academic challenge."
    },
    {
        name: "General",
        icon: "🌟",
        description: "Questions for everyday quiz players."
    },
    {
        name: "Advanced",
        icon: "🧠",
        description: "Deeper questions for serious quizzers."
    }
];


/* =========================================================
   GAME STATE
========================================================= */

const state = {
    ageGroup: null,
    theme: null,
    mode: null,

    setting: 10,

    allQuestions: [],
    questions: [],

    currentQuestion: 0,

    correct: 0,
    wrong: 0,
    answered: 0,

    startedAt: null,
    finishedAt: null,

    deadline: null,
    timerInterval: null,

    answerLocked: false,

    soundEnabled: true,
    darkMode: true,

    usedQuestionIds: new Set()
};


/* =========================================================
   SHORT DOM HELPER
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    renderAgeGroups();

    renderThemes();

    setupNavigation();

    setupModeButtons();

    setupGlobalButtons();

    loadPreferences();

    loadQuestionDatabase();

}


/* =========================================================
   LOAD YOUR EXISTING questions.json
========================================================= */

async function loadQuestionDatabase() {

    try {

        const response =
            await fetch("data/questions.json");

        if (!response.ok) {
            throw new Error(
                "Could not load questions.json"
            );
        }

        const rawData =
            await response.json();

        state.allQuestions =
            normalizeQuestions(rawData);

        console.log(
            `QuizLab loaded ${state.allQuestions.length} questions.`
        );

    } catch (error) {

        console.error(error);

        state.allQuestions = [];

        showToast(
            "Question database could not be loaded."
        );
    }
}


/* =========================================================
   NORMALIZE DIFFERENT JSON FORMATS
========================================================= */

function normalizeQuestions(data) {

    /*
        FORMAT 1

        [
            {
                "id": 1,
                "theme": "Science",
                "ageGroup": "Kids",
                "question": "...",
                "options": ["A", "B", "C", "D"],
                "answer": 1,
                "explanation": "..."
            }
        ]
    */

    if (Array.isArray(data)) {

        return data.map(
            (question, index) => {

                return {
                    ...question,

                    id:
                        question.id ??
                        `question-${index + 1}`,

                    theme:
                        question.theme ??
                        "General Knowledge",

                    ageGroup:
                        question.ageGroup ??
                        "General",

                    options:
                        question.options ?? [],

                    answer:
                        normalizeAnswer(
                            question.answer,
                            question.options
                        )
                };

            }
        ).filter(
            validQuestion
        );
    }


    /*
        FORMAT 2

        {
            "Science": [
                {...},
                {...}
            ],
            "History": [
                {...}
            ]
        }
    */

    if (
        data &&
        typeof data === "object"
    ) {

        const result = [];

        Object.entries(data).forEach(
            ([theme, questions]) => {

                if (!Array.isArray(questions)) {
                    return;
                }

                questions.forEach(
                    (question, index) => {

                        result.push({

                            ...question,

                            id:
                                question.id ??
                                `${theme}-${index + 1}`,

                            theme:
                                question.theme ??
                                theme,

                            ageGroup:
                                question.ageGroup ??
                                "General",

                            options:
                                question.options ?? [],

                            answer:
                                normalizeAnswer(
                                    question.answer,
                                    question.options
                                )

                        });

                    }
                );

            }
        );

        return result.filter(
            validQuestion
        );
    }


    return [];
}


/* =========================================================
   VALIDATE QUESTION
========================================================= */

function validQuestion(question) {

    return (
        question &&
        typeof question.question === "string" &&
        Array.isArray(question.options) &&
        question.options.length >= 2 &&
        Number.isInteger(question.answer)
    );
}


/* =========================================================
   NORMALIZE ANSWER
========================================================= */

function normalizeAnswer(
    answer,
    options
) {

    if (
        Number.isInteger(answer)
    ) {

        return answer;
    }


    if (
        typeof answer === "string" &&
        Array.isArray(options)
    ) {

        const index =
            options.findIndex(
                option =>
                    String(option)
                        .toLowerCase()
                        .trim() ===
                    answer
                        .toLowerCase()
                        .trim()
            );

        if (index >= 0) {
            return index;
        }


        /*
            Also support:

            "A"
            "B"
            "C"
            "D"
        */

        const letter =
            answer
                .trim()
                .toUpperCase();

        if (
            /^[A-Z]$/.test(letter)
        ) {

            const index =
                letter.charCodeAt(0) -
                65;

            if (
                index >= 0 &&
                index < options.length
            ) {

                return index;
            }
        }
    }


    return -1;
}


/* =========================================================
   AGE GROUPS
========================================================= */

function renderAgeGroups() {

    const container =
        $("#ageGroups");

    container.innerHTML = "";


    AGE_GROUPS.forEach(
        group => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "age-option";

            button.dataset.age =
                group.name;

            button.innerHTML = `

                <div class="age-icon">
                    ${group.icon}
                </div>

                <strong>
                    ${group.name}
                </strong>

                <small>
                    ${group.description}
                </small>

            `;

            button.addEventListener(
                "click",
                () =>
                    selectAgeGroup(
                        group.name
                    )
            );

            container.appendChild(
                button
            );

        }
    );
}


/* =========================================================
   SELECT AGE GROUP
========================================================= */

function selectAgeGroup(age) {

    state.ageGroup =
        age;


    $$(".age-option").forEach(
        button => {

            button.classList.toggle(
                "selected",
                button.dataset.age === age
            );

        }
    );


    $("#themeSection")
        .classList.remove(
            "hidden"
        );


    showToast(
        `${age} mode selected`
    );


    setTimeout(
        () => {

            $("#themeSection")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        },
        100
    );
}


/* =========================================================
   THEMES
========================================================= */

function renderThemes() {

    const container =
        $("#themes");

    container.innerHTML = "";


    THEMES.forEach(
        theme => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "theme-card";

            button.dataset.theme =
                theme.name;

            button.innerHTML = `

                <div class="theme-icon">
                    ${theme.icon}
                </div>

                <strong>
                    ${theme.name}
                </strong>

                <small>
                    ${theme.description}
                </small>

            `;


            button.addEventListener(
                "click",
                () =>
                    selectTheme(
                        theme
                    )
            );


            container.appendChild(
                button
            );

        }
    );
}


/* =========================================================
   SELECT THEME
========================================================= */

function selectTheme(theme) {

    if (!state.ageGroup) {

        showToast(
            "Choose your age group first."
        );

        return;
    }


    state.theme =
        theme.name;


    $("#setupTheme")
        .textContent =
        theme.name;


    $("#setupDescription")
        .textContent =
        `${state.ageGroup} mode • ${theme.description}`;


    showScreen(
        $("#setupScreen")
    );
}


/* =========================================================
   SCREEN SWITCHING
========================================================= */

function showScreen(screen) {

    $$(".screen").forEach(
        item =>
            item.classList.remove(
                "active"
            )
    );


    screen.classList.add(
        "active"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $("#backToHome")
        .addEventListener(
            "click",
            goHome
        );


    $("#quitQuiz")
        .addEventListener(
            "click",
            quitQuiz
        );


    $("#homeButton")
        .addEventListener(
            "click",
            goHome
        );


    $("#replayButton")
        .addEventListener(
            "click",
            replayQuiz
        );
}


/* =========================================================
   MODE BUTTONS
========================================================= */

function setupModeButtons() {

    $$(".mode-card").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openModeOptions(
                        button.dataset.mode
                    );

                }
            );

        }
    );
}


/* =========================================================
   OPEN MODE OPTIONS
========================================================= */

function openModeOptions(mode) {

    state.mode =
        mode;


    $("#optionsPanel")
        .classList.remove(
            "hidden"
        );


    if (mode === "time") {

        renderTimeOptions();

    } else {

        renderQuestionOptions();

    }
}


/* =========================================================
   TIME MODE
========================================================= */

function renderTimeOptions() {

    const options = [
        [30, "30 seconds"],
        [60, "1 minute"],
        [120, "2 minutes"],
        [180, "3 minutes"],
        [300, "5 minutes"]
    ];


    state.setting = 60;


    $("#optionsContent")
        .innerHTML = `

        <h3>
            Select your time
        </h3>

        <div class="option-list">

            ${options.map(
                option => `

                    <button
                        class="option ${
                            option[0] === state.setting
                                ? "selected"
                                : ""
                        }"
                        data-value="${option[0]}"
                    >
                        ${option[1]}
                    </button>

                `
            ).join("")}

        </div>

        <button
            id="startQuizButton"
            class="start-button"
        >
            Start timed quiz →
        </button>
    `;


    setupOptionButtons();


    $("#startQuizButton")
        .addEventListener(
            "click",
            startQuiz
        );
}


/* =========================================================
   QUESTION MODE
========================================================= */

function renderQuestionOptions() {

    const options = [
        5,
        10,
        15,
        20,
        25,
        30,
        40,
        50
    ];


    state.setting = 10;


    $("#optionsContent")
        .innerHTML = `

        <h3>
            Select number of questions
        </h3>

        <div class="option-list">

            ${options.map(
                number => `

                    <button
                        class="option ${
                            number === state.setting
                                ? "selected"
                                : ""
                        }"
                        data-value="${number}"
                    >
                        ${number} questions
                    </button>

                `
            ).join("")}

        </div>

        <button
            id="startQuizButton"
            class="start-button"
        >
            Start quiz →
        </button>
    `;


    setupOptionButtons();


    $("#startQuizButton")
        .addEventListener(
            "click",
            startQuiz
        );
}


/* =========================================================
   OPTIONS
========================================================= */

function setupOptionButtons() {

    $$(".option").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    $$(".option").forEach(
                        item =>
                            item.classList.remove(
                                "selected"
                            )
                    );


                    button.classList.add(
                        "selected"
                    );


                    state.setting =
                        Number(
                            button.dataset.value
                        );

                }
            );

        }
    );
}


/* =========================================================
   FILTER QUESTIONS
========================================================= */

function getThemeQuestions() {

    let questions =
        [...state.allQuestions];


    /*
        Theme filtering
    */

    questions =
        questions.filter(
            question =>
                normalizeText(
                    question.theme
                ) ===
                normalizeText(
                    state.theme
                )
        );


    /*
        If theme isn't explicitly stored
        in JSON, don't break the quiz.
    */

    if (
        questions.length === 0
    ) {

        questions =
            [...state.allQuestions];

    }


    /*
        Age filtering
    */

    if (
        state.ageGroup &&
        state.ageGroup !== "General"
    ) {

        const ageQuestions =
            questions.filter(
                question =>
                    normalizeText(
                        question.ageGroup
                    ) ===
                    normalizeText(
                        state.ageGroup
                    )
            );


        /*
            Use age-specific questions
            only if they exist.
        */

        if (
            ageQuestions.length > 0
        ) {

            questions =
                ageQuestions;

        }

    }


    return questions;
}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(value) {

    return String(
        value ?? ""
    )
        .toLowerCase()
        .trim()
        .replace(
            /&/g,
            "and"
        )
        .replace(
            /\s+/g,
            " "
        );
}


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    const result =
        [...array];


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }


    return result;
}


/* =========================================================
   CREATE QUESTION
========================================================= */

function prepareQuestion(question) {

    const correctAnswer =
        question.options[
            question.answer
        ];


    const options =
        shuffle(
            question.options
        );


    return {

        ...question,

        options,

        answer:
            options.indexOf(
                correctAnswer
            )

    };
}


/* =========================================================
   PREPARE QUIZ
========================================================= */

function prepareQuizQuestions() {

    let available =
        getThemeQuestions();


    /*
        Remove previously used questions
        when possible.
    */

    const fresh =
        available.filter(
            question =>
                !state.usedQuestionIds.has(
                    question.id
                )
        );


    if (
        fresh.length > 0
    ) {

        available =
            fresh;

    }


    available =
        shuffle(
            available
        );


    let selected;


    if (
        state.mode === "questions"
    ) {

        selected =
            available.slice(
                0,
                Math.min(
                    state.setting,
                    available.length
                )
            );

    } else {

        /*
            Timed mode needs a large pool.
        */

        selected =
            available.slice(
                0,
                Math.min(
                    100,
                    available.length
                )
            );
    }


    selected =
        selected.map(
            prepareQuestion
        );


    selected.forEach(
        question =>
            state.usedQuestionIds.add(
                question.id
            )
    );


    return selected;
}


/* =========================================================
   START QUIZ
========================================================= */

function startQuiz() {

    if (
        state.allQuestions.length === 0
    ) {

        showToast(
            "Questions are still loading. Try again in a moment."
        );

        return;
    }


    state.questions =
        prepareQuizQuestions();


    if (
        state.questions.length === 0
    ) {

        showToast(
            "No questions were found for this theme."
        );

        return;
    }


    resetGame();


    showScreen(
        $("#quizScreen")
    );


    $("#quizTheme")
        .textContent =
        state.theme;


    if (
        state.mode === "time"
    ) {

        state.deadline =
            Date.now() +
            state.setting * 1000;
    }


    renderQuestion();

    startTimer();
}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    clearInterval(
        state.timerInterval
    );


    state.currentQuestion = 0;

    state.correct = 0;

    state.wrong = 0;

    state.answered = 0;

    state.startedAt =
        Date.now();

    state.finishedAt =
        null;

    state.answerLocked =
        false;

    state.deadline =
        null;
}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearInterval(
        state.timerInterval
    );


    updateTimer();


    state.timerInterval =
        setInterval(
            updateTimer,
            250
        );
}


function updateTimer() {

    if (
        !state.startedAt
    ) {
        return;
    }


    if (
        state.mode === "time"
    ) {

        const remaining =
            Math.max(
                0,
                state.deadline -
                Date.now()
            );


        const seconds =
            Math.ceil(
                remaining / 1000
            );


        $("#quizTimer")
            .textContent =
            formatTime(
                seconds
            );


        if (
            remaining <= 10000
        ) {

            $("#quizTimer")
                .classList.add(
                    "danger"
                );

        } else if (
            remaining <= 30000
        ) {

            $("#quizTimer")
                .classList.add(
                    "warning"
                );

        }


        if (
            remaining <= 0
        ) {

            finishQuiz();

        }

    } else {

        const seconds =
            Math.floor(
                (
                    Date.now() -
                    state.startedAt
                ) / 1000
            );


        $("#quizTimer")
            .textContent =
            formatTime(
                seconds
            );
    }
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    seconds =
        Math.max(
            0,
            seconds
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return (
        String(minutes).padStart(
            2,
            "0"
        ) +
        ":" +
        String(remaining).padStart(
            2,
            "0"
        )
    );
}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

    if (
        state.currentQuestion >=
        state.questions.length
    ) {

        finishQuiz();

        return;
    }


    state.answerLocked =
        false;


    const question =
        state.questions[
            state.currentQuestion
        ];


    $("#questionNumber")
        .textContent =
        `QUESTION ${String(
            state.currentQuestion + 1
        ).padStart(2, "0")}`;


    $("#questionText")
        .textContent =
        question.question;


    $("#questionExplanation")
        .classList.add(
            "hidden"
        );


    if (
        state.mode === "questions"
    ) {

        $("#quizProgress")
            .textContent =
            `${state.currentQuestion + 1} / ${state.questions.length}`;


        $("#progressBar")
            .style.width =
            `${
                (
                    state.currentQuestion /
                    state.questions.length
                ) * 100
            }%`;

    } else {

        $("#quizProgress")
            .textContent =
            `Question ${state.currentQuestion + 1}`;

        $("#progressBar")
            .style.width =
            "100%";
    }


    const answers =
        $("#answers");


    answers.innerHTML =
        "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer-button";


            button.dataset.index =
                index;


            button.innerHTML = `

                <span class="answer-letter">
                    ${String.fromCharCode(
                        65 + index
                    )}
                </span>

                ${escapeHTML(option)}

            `;


            button.addEventListener(
                "click",
                () =>
                    submitAnswer(
                        index
                    )
            );


            answers.appendChild(
                button
            );

        }
    );
}


/* =========================================================
   ANSWER QUESTION
========================================================= */

function submitAnswer(index) {

    if (
        state.answerLocked
    ) {
        return;
    }


    state.answerLocked =
        true;


    const question =
        state.questions[
            state.currentQuestion
        ];


    const buttons =
        $$(".answer-button");


    buttons.forEach(
        (button, buttonIndex) => {

            button.classList.add(
                "disabled"
            );


            if (
                buttonIndex ===
                question.answer
            ) {

                button.classList.add(
                    "correct"
                );
            }


            if (
                buttonIndex === index &&
                buttonIndex !==
                question.answer
            ) {

                button.classList.add(
                    "wrong"
                );
            }

        }
    );


    if (
        index === question.answer
    ) {

        state.correct++;

        playSound(
            "correct"
        );

    } else {

        state.wrong++;

        playSound(
            "wrong"
        );
    }


    state.answered++;


    if (
        question.explanation
    ) {

        const explanation =
            $("#questionExplanation");


        explanation.textContent =
            question.explanation;


        explanation.classList.remove(
            "hidden"
        );
    }


    setTimeout(
        nextQuestion,
        550
    );
}


/* =========================================================
   NEXT QUESTION
========================================================= */

function nextQuestion() {

    if (
        state.mode === "time" &&
        Date.now() >=
        state.deadline
    ) {

        finishQuiz();

        return;
    }


    state.currentQuestion++;


    if (
        state.currentQuestion >=
        state.questions.length
    ) {

        finishQuiz();

        return;
    }


    renderQuestion();
}


/* =========================================================
   FINISH QUIZ
========================================================= */

function finishQuiz() {

    if (
        !state.startedAt
    ) {
        return;
    }


    clearInterval(
        state.timerInterval
    );


    state.finishedAt =
        Date.now();


    const elapsed =
        Math.max(
            1,
            Math.floor(
                (
                    state.finishedAt -
                    state.startedAt
                ) / 1000
            )
        );


    const accuracy =
        state.answered > 0
            ? Math.round(
                (
                    state.correct /
                    state.answered
                ) * 100
            )
            : 0;


    /*
        Score:
        10 points per correct answer.
    */

    const score =
        state.correct * 10;


    $("#finalScore")
        .textContent =
        score;


    $("#finalCorrect")
        .textContent =
        state.correct;


    $("#finalWrong")
        .textContent =
        state.wrong;


    $("#finalAccuracy")
        .textContent =
        `${accuracy}%`;


    $("#finalTime")
        .textContent =
        formatResultTime(
            elapsed
        );


    setResultMessage(
        accuracy
    );


    showScreen(
        $("#resultsScreen")
    );
}


/* =========================================================
   RESULT MESSAGE
========================================================= */

function setResultMessage(
    accuracy
) {

    if (
        accuracy >= 90
    ) {

        $("#resultsTitle")
            .textContent =
            "Outstanding!";

        $("#resultsDescription")
            .textContent =
            "You absolutely dominated this challenge.";

    } else if (
        accuracy >= 75
    ) {

        $("#resultsTitle")
            .textContent =
            "Excellent work!";

        $("#resultsDescription")
            .textContent =
            "A very strong performance.";

    } else if (
        accuracy >= 60
    ) {

        $("#resultsTitle")
            .textContent =
            "Great effort!";

        $("#resultsDescription")
            .textContent =
            "You are building a strong quiz streak.";

    } else if (
        accuracy >= 40
    ) {

        $("#resultsTitle")
            .textContent =
            "Keep going!";

        $("#resultsDescription")
            .textContent =
            "Every round is another chance to improve.";

    } else {

        $("#resultsTitle")
            .textContent =
            "Nice try!";

        $("#resultsDescription")
            .textContent =
            "Ready for another round?";

    }
}


/* =========================================================
   RESULT TIME
========================================================= */

function formatResultTime(seconds) {

    if (
        seconds < 60
    ) {

        return `${seconds}s`;
    }


    return (
        Math.floor(
            seconds / 60
        ) +
        "m " +
        (
            seconds % 60
        ) +
        "s"
    );
}


/* =========================================================
   REPLAY
========================================================= */

function replayQuiz() {

    if (
        !state.theme
    ) {

        goHome();

        return;
    }


    /*
        prepareQuizQuestions()
        removes questions used before,
        preventing immediate repetition.
    */

    state.questions =
        prepareQuizQuestions();


    if (
        state.questions.length === 0
    ) {

        /*
            If the player has eventually
            exhausted the unused pool,
            reset the session history.
        */

        state.usedQuestionIds.clear();


        state.questions =
            prepareQuizQuestions();
    }


    resetGame();


    showScreen(
        $("#quizScreen")
    );


    $("#quizTheme")
        .textContent =
        state.theme;


    if (
        state.mode === "time"
    ) {

        state.deadline =
            Date.now() +
            state.setting * 1000;
    }


    renderQuestion();

    startTimer();
}


/* =========================================================
   QUIT
========================================================= */

function quitQuiz() {

    clearInterval(
        state.timerInterval
    );


    if (
        state.answered === 0 ||
        confirm(
            "Leave this quiz? Your current progress will be lost."
        )
    ) {

        goHome();
    }
}


/* =========================================================
   HOME
========================================================= */

function goHome() {

    clearInterval(
        state.timerInterval
    );


    showScreen(
        $("#homeScreen")
    );


    $("#optionsPanel")
        .classList.add(
            "hidden"
        );


    state.mode =
        null;
}


/* =========================================================
   GLOBAL BUTTONS
========================================================= */

function setupGlobalButtons() {

    $("#soundButton")
        .addEventListener(
            "click",
            toggleSound
        );


    $("#themeButton")
        .addEventListener(
            "click",
            toggleAppearance
        );


    document.addEventListener(
        "keydown",
        keyboardControls
    );
}


/* =========================================================
   KEYBOARD ANSWERS
========================================================= */

function keyboardControls(event) {

    if (
        !$("#quizScreen")
            .classList.contains(
                "active"
            )
    ) {
        return;
    }


    if (
        state.answerLocked
    ) {
        return;
    }


    const keys = {
        a: 0,
        b: 1,
        c: 2,
        d: 3
    };


    const index =
        keys[
            event.key.toLowerCase()
        ];


    if (
        index !== undefined
    ) {

        const question =
            state.questions[
                state.currentQuestion
            ];


        if (
            question &&
            index <
            question.options.length
        ) {

            submitAnswer(
                index
            );
        }
    }
}


/* =========================================================
   SOUND
========================================================= */

function toggleSound() {

    state.soundEnabled =
        !state.soundEnabled;


    $("#soundButton")
        .textContent =
        state.soundEnabled
            ? "🔊"
            : "🔇";


    localStorage.setItem(
        "quizlab-sound",
        state.soundEnabled
    );
}


function playSound(type) {

    if (
        !state.soundEnabled
    ) {
        return;
    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.frequency.value =
            type === "correct"
                ? 660
                : 220;


        gain.gain.setValueAtTime(
            0.0001,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.05,
            context.currentTime + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + 0.14
        );


        oscillator.start();


        oscillator.stop(
            context.currentTime + 0.14
        );

    } catch (error) {

        console.log(
            "Audio unavailable."
        );

    }
}


/* =========================================================
   APPEARANCE
========================================================= */

function toggleAppearance() {

    state.darkMode =
        !state.darkMode;


    document.body.classList.toggle(
        "light",
        !state.darkMode
    );


    $("#themeButton")
        .textContent =
        state.darkMode
            ? "☾"
            : "☀";


    localStorage.setItem(
        "quizlab-dark",
        state.darkMode
    );
}


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadPreferences() {

    const sound =
        localStorage.getItem(
            "quizlab-sound"
        );


    if (
        sound !== null
    ) {

        state.soundEnabled =
            sound === "true";
    }


    $("#soundButton")
        .textContent =
        state.soundEnabled
            ? "🔊"
            : "🔇";


    const dark =
        localStorage.getItem(
            "quizlab-dark"
        );


    if (
        dark !== null
    ) {

        state.darkMode =
            dark === "true";
    }


    document.body.classList.toggle(
        "light",
        !state.darkMode
    );


    $("#themeButton")
        .textContent =
        state.darkMode
            ? "☾"
            : "☀";
}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

    const toast =
        $("#toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(value);


    return element.innerHTML;
}


/* =========================================================
   DEBUG
========================================================= */

window.QuizLab = {
    state,
    reloadQuestions:
        loadQuestionDatabase
};
