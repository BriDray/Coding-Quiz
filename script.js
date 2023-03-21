let timerTag = document.querySelector("#timerTag")
let timerPTag = document.querySelector("header").children[0]
let submitHighscoreBtn = document.querySelector('#submitHighscoreBtn')
// let viewHighscoresBtn = document.querySelector('#viewHighScores')
let claerHighscoreBtn = document.querySelector('#clearHighscoreBtn')
let answerBtnLst = document.body.querySelector('ul')
let goBackHighscoreBtn = document.querySelector('#goBackBtn')
let startBtn = document.querySelector('#startBtn')
let titleTag = document.querySelector('#title')

let questionObj = {
    questions: [ //More questions can just be added by adding on a string to end of array
        `Inside which HTML element do we put the JavaScript?`,
        `What is the correct JavaScript syntax to change the content of the HTML element below? <p id="demo">This is a demonstration.</p>`,
        `Where is the correct place to insert a JavaScript?`,
        `What is the correct syntax for referring to an external script called "xxx.js"?`,
        `How do you write "Hello World" in an alert box?`,
    ],
    answers: [ //Answers are in a 2d array because one question has 2 answers
        [`<js>`, `correct:<script>`, `<javascript>`, `<scripting>`],
        [`document.getElement("p").innerHTML = "Hello World!";`, `#demo.innerHTML = "Hello World!";`, `correct:document.getElementById("demo").innerHTML = "Hello World!";`, `document.getElementByName("p").innerHTML = "Hello World!";`],
        [`The <head> section`, `Both the <head> section and the <body> section are correct`, `correct:The <body> section`, `The <footer> section`], //uses `correct:` so that even if answer has the word `correct` its not flagged as correct answer
        [`correct:<script src="xxx.js">`, `<script name="xxx.js">`, `<script href="xxx.js">`, `<script link="xxx.js">`],
        [`msgBox("Hello World");`, `alertBox("Hello World");`, `correct:alert("Hello World");`, `msg("Hello World");`] //to pull out correct: newStr = substring(7,questionObj.answers[index].length)
    ]
}

var globalTimerPreset = 90; // Time amount

//Global quiz/game variables
var questionIndexNumber = 0; //Keeps track of the current question number for question object
var timeLeft = globalTimerPreset; //Time remianing
var score = 0; //Users Score
var gameEnded = true; //Boolean check for end of game and timer

//Game setup for the title, instructions and start button
function setUpGame() {
    timeLeft = globalTimerPreset; //Reset the time back to the starting time  
    timerTag.textContent = globalTimerPreset; //Sets default time at start of game

    //Hides elements that may be visible after a previous round
    document.querySelector(`#display-highscore-div`).style.display = `none`; //This the last visible item after viewing highscore of a previous game

    //Area that is reused for titles, instructions and questions
    titleTag.textContent = "JavaScript Quiz"; //H1 tag gets reused for questions - make sure to reset it

    //Items needed for the main area
    titleTag.style.display = `block`; //Quiz title will be hidden
    document.querySelector(`#instructions`).style.display = `block`; //Instructions on main page
    startBtn.style.display = `block`; //Show the Start Quiz button

    return;
}

//Function called when start quiz  button is clicked
function startGame() {
    gameEnded = false; //Set to false while the gaqme is running
    questionIndexNumber = 0; //Keeps track of the current question number for question object

    //Clean up main div when game starts
    startBtn.style.display = `none`; //Hide start quiz button dring game
    document.querySelector(`#instructions`).style.display = `none`; //Hide instructions during game
    timerPTag.style.display = `block`; //Display timer when game starts

    //Call the show questions function
    showQuestions(questionIndexNumber); //Start generating the questions
    startTimer(); //Start the game timer
    return;
}

//Timer runs while quiz is active
function startTimer() {
    var timerInterval = setInterval(function () {
        if (gameEnded === true) { //Test if game is ended
            clearInterval(timerInterval); //Stop timer on game end
            return;
        }
        if (timeLeft < 1) { //if timer is out under 1 cause wrong answers subtract 10 seconds game ends and timer stops
            clearInterval(timerInterval); //stop
            endGame(); //end game out of time scenario
        }

        timerTag.textContent = timeLeft; //Display time remaining
        timeLeft--; //Decrement timer while game runs
    }, 1000); //1 second intervals

    return;
}

//Uses the questionIndexNumber to show the question of the current index and its answers
function showQuestions(currentQuestionIndex) {
    titleTag.textContent = questionObj.questions[currentQuestionIndex]; //Select the H1 tag and set it as the question
    createAnswerElements(currentQuestionIndex); //Create answers for current question

    return;
}

//Creates new answer elements in the answer list and clears out previous answers
function createAnswerElements(currentQuestionIndex) {
    answerBtnLst.innerHTML = ''; //Clears current answers

    for (let answerIndex = 0; answerIndex < questionObj.answers[currentQuestionIndex].length; answerIndex++) { //Loop through every answer
        var currentAnswerListItem = document.createElement(`li`); //Create new html <li>
        var tempStr = questionObj.answers[currentQuestionIndex][answerIndex]; //Temp incase the string contains the `correct` answer tag and needs to be pulled out.

        //IF the string contains `correct:` pull it out and set it as id so they cant see it on the <button>/<li>
        if (questionObj.answers[currentQuestionIndex][answerIndex].includes(`correct:`)) {
            tempStr = questionObj.answers[currentQuestionIndex][answerIndex].substring(8, questionObj.answers[currentQuestionIndex][answerIndex].length); //yoink out the string part that doesnt contain `correct:`
            currentAnswerListItem.id = `correct`; //Flag the correct answer with an id to look at later and see if they clicked the right one.
        }

        currentAnswerListItem.textContent = tempStr; //Temp check in case the string contains the `correct` answer tag and needs to be pulled out.
        answerBtnLst.appendChild(currentAnswerListItem); //Adds answer to the <UL>
    }

    return;
}

//Function to get the next question
function nextQuestion() {
    questionIndexNumber++; //Increment to know the index number of the current question
    if (questionIndexNumber >= questionObj.questions.length) { //if we run out of questions end the game
        endGame(); //Ends the game
    } else { //Keep playing if there are more questions
        showQuestions(questionIndexNumber); //Show the question
    }

    return;
}

//End game function
function endGame() {
    gameEnded = true; //Boolean to indicate game over
    score = timeLeft; //Score set equal to the time left

    //hide necessary elements
    timerPTag.style.display = `none`; //Hides timer
    titleTag.style.display = `none`; //Hides title
    answerBtnLst.innerHTML = ''; //Clear this as no new question will be generated at the end of the game

    //Show endscreen score and form to enter name for highscore in local storage
    document.querySelector(`#scoreSpan`).textContent = score; //Display score
    document.querySelector(`#submit-highscore-div`).style.display = `block`;

    return;
}


//Function called on answer click
function checkAnswer(event) {
    if (event.target != answerBtnLst) { //Listening only for clicks on <li> not <ul>
        if (!(event.target.id.includes('correct'))) { //Check if this <li> includes correct:
            timeLeft -= 10; //Subtract 10 seconds if answer is not correct
        }

        nextQuestion(); //Call next question function after an answer is clicked
    }

    return;
}

//Call function to save name and score
function storeScoreAndName() {
    var highscoreTextbox = document.querySelector(`input`); //Enter name field
    var tempArrayOfObjects = []; //Store previous data in an empty array

    if (highscoreTextbox.value != `` || highscoreTextbox.value != null) { //Store the value as long as field is not empty
        var tempObject = { //Declare an object to store the values
            names: highscoreTextbox.value, //User name
            scores: score, //Users score
        }

        if (window.localStorage.getItem(`highscores`) == null) { //If no data exists, create a new array
            tempArrayOfObjects.push(tempObject); //Push users name and score to the empty array
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)); //Create as a string and save to local storage

        } else { //Runs if previous data exists
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); //Get data and parse the array

            for (let index = 0; index <= tempArrayOfObjects.length; index++) { //Loop over array looking for right spot to put our new submitted score (starts from high to low)
                if (index == tempArrayOfObjects.length) { //If we are at the end of the array then just put our new score at the bottom because the new score wasnt higher than any previous
                    tempArrayOfObjects.push(tempObject) //Add new score to the end of highscores
                    break;
                } else if (tempArrayOfObjects[index].scores < score) { //If new score is higher than the current score 
                    tempArrayOfObjects.splice(index, 0, tempObject); //Splice and "insert" our object into the array at the current index
                    break;
                }
            }
            window.localStorage.setItem(`highscores`, JSON.stringify(tempArrayOfObjects)) //COnvert array of objects into a string and store it in local storage
        }
        document.querySelector(`input`).value = ``; //Clear out the input so its not prefilled for another round of the quiz
        score = 0; //Set score back to zero when game is over

        showHighscores(); //Display high scores
    }

    return;
}

//Call to show high scores
function showHighscores() {
    //Hide these elements
    // viewHighscoresBtn.addEventListener(`click`, showHighscores); //shows the highscores
    // viewHighscoresBtn.style.display = `block`; //Highscores button gets hidden during quiz
    
    titleTag.style.display = `none`; //hides title h1 tag
    startBtn.style.display = `none`; //hide start button when game starts
    document.querySelector(`header`).children[0].style.display = `none`; //hides the view highscore button but not header so formatting doesnt get weird
    document.querySelector(`#instructions`).style.display = `none`; //hide instructions beneath h1 tag
    document.querySelector(`#submit-highscore-div`).style.display = `none`; //hide submit highscores because they might have just came from submitting

    //show highscore div and start filling it up
    document.querySelector(`#display-highscore-div`).style.display = `block`; //show div

    tempOrderedList = document.querySelector(`ol`); //target the ordered list in our highscore div
    tempOrderedList.innerHTML = `` //clear out all previous highscores to be rebuilt in (possible) new order

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem(`highscores`)); //parse all local storage highscores
    if (tempArrayOfObjects != null) { //only continue if there was data to use and display stuff on highscore board
        for (let index = 0; index < tempArrayOfObjects.length; index++) { //loop over every array element found (highscore entry)
            var newLi = document.createElement(`li`) //create a new <li> to append to our <ol>
            newLi.textContent = tempArrayOfObjects[index].names + ` - ` + tempArrayOfObjects[index].scores; //fill up new <li> with content of stored highscores
            tempOrderedList.appendChild(newLi); //append to parent <ol> (numbered list)
        }

    } else { //if there was no data in local storage to show on highscores show error
        var newLi = document.createElement(`p`) //paragraph tag so its not numbered
        newLi.textContent = `No Highscores` //text content for out paragraph tag
        tempOrderedList.appendChild(newLi); //append to parent <ol> where highscores would go for ease
    }

    return;
}

//Triggered when clearHighscoreBtn is clicked clears the local storage
function clearHighscores() {
    document.querySelector(`ol`).innerHTML = ``; //empties out the highscore list incase user is viewing it currently
    window.localStorage.clear(); //dump all local storage

    setUpGame(); //go back to main screen because if user clicked this that means they are on highscore board

    return;
}

function init() {
    //elements on DOM which are going to need an event listener
    startBtn.addEventListener(`click`, startGame); //button that starts the game
    answerBtnLst.addEventListener(`click`, checkAnswer); //list that contains the answer <li> tags which are used as buttons
    submitHighscoreBtn.addEventListener(`click`, storeScoreAndName); //submits highscores
    clearHighscoreBtn.addEventListener(`click`, clearHighscores); //clears localstorage
    goBackHighscoreBtn.addEventListener(`click`, setUpGame); //returns back to main screen to show start and instructions

    setUpGame(); //prepare the screen for and display the appropriate items to get ready for quiz

    return;
}

init();