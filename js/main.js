let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

let questions;
async function getQuestions() {
    let data = await fetch("https://api.json-generator.com/templates/AZJTOjkgYMnx/data?access_token=x3bg40xi3ycgfn1w7oqcekl3pqlsm1nf4aj38qf6");
    questions = await data.json();
    console.log(questions)
    addQuestions(questions[currentIndex], questions.length)
    creatBullets(questions.length)
    countdown(questions.length)
    submitButton.onclick = function () {
        let theRightAnswer = questions[currentIndex].right_answer;
        currentIndex++;
        
        checkAnswer(theRightAnswer, questions.length)
        
        answersArea.innerHTML = ""
        quizArea.innerHTML = ""
        
        clearInterval(countdownInterval)
        countdown(questions.length)
        
        addQuestions(questions[currentIndex], questions.length)
        showResults(questions.length)
        handleBullets()
    }
}
getQuestions()

function addQuestions(obj, count) {
    if (currentIndex < count) {
        // Create H2 Question Title
        let questionTitle = document.createElement("h2");
        let questionTitleText = document.createTextNode(obj["title"]);
        questionTitle.appendChild(questionTitleText)
        // Create The Answers
        for (let j = 1; j < 5; j++) {
            let divAnswer = document.createElement("div");
            divAnswer.className = "answer";
            // Create Radio Input
            let input = document.createElement("input");
            // Add Type + Name + Id + Data-Attribute
            input.type = "radio";
            input.name = "question";
            input.id = `answer_${j}`;
            input.dataset.answer = obj[`answer_${j}`];
            if (j === 1) {
                input.checked = true;
            }
            // Create Label Text
            let label = document.createElement("label");
            // Add For + Text to Label
            let labelText = document.createTextNode(obj[`answer_${j}`]);
            label.htmlFor = `answer_${j}`
            label.appendChild(labelText)
            // Add Input + Label To div Answer
            divAnswer.appendChild(input);
            divAnswer.appendChild(label);
            // Append All Divs To Answers Area
            answersArea.appendChild(divAnswer);
            // Make First Option Selected
        }
        quizArea.appendChild(questionTitle);
        countSpan.textContent--;
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let checker;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            checker = answers[i].dataset.answer
        }
    }
    if (rAnswer === checker) {
        rightAnswers++;
        console.log(rightAnswers)
    }
}

function creatBullets(num) {
    countSpan.innerHTML = num
    for (let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.classList.add("on")
        }
        bulletsSpanContainer.appendChild(bullet)
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    bulletsSpans.forEach(span => {
        span.classList.remove("on")
    })
    if (currentIndex < 9) {
        bulletsSpans[currentIndex].classList.add("on")
    }
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        countSpan.textContent = 0;
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers < count && rightAnswers > count / 2) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }

}

function countdown(count) {
    if (currentIndex < count) {
        countdownElement.innerHTML = "Time: "
        let span = document.createElement("span");
        let spanText = document.createTextNode(5);
        span.appendChild(spanText)
        countdownElement.appendChild(span)
        countdownInterval = setInterval(() => {
            spanText.textContent--;
            if (spanText.textContent == "0") {
                clearInterval(countdownInterval)
                submitButton.click();
            }
        }, 1000)
    }

}