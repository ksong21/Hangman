// Alphabet array
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
// List of words
const wordList = ["tattoo", "electricity", "committee", "apple", "house", "dolphin", "intelligent", "word", "zebra", "elephant"];
// Definitions
const definitions = [
    "a form of body modification where a design is made by inserting ink.",
    "a form of energy resulting from the existence of charged particles.",
    "a group of people appointed for a specific function, typically consisting of members of a larger group.",
    "a common fruit.",
    "a building.",
    "a marine animal.",
    "the ability to acquire and apply knowledge and skills.",
    "a single distinct meaningful element of speech or writing.",
    "an african wild horse.",
    "a heavy plant-eating mammal with a prehensile trunk."
]
// Character count
const charCount = [6, 11, 9, 5, 5, 7, 11, 4, 5, 8]
// Score counter
let score = 0;
// Score carry
let userScore = 0;
// Lives counter
let lives = 7;
// Index of current word within array
let index;
// Character display "_ " array
let charDisplay = [];
// Current word
let currentWord;
// Showing hint?
let hint = false;

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCmqi5emhEWCvULU7vHvOjfHe7weRyFI9w",
    authDomain: "hangman-80e69.firebaseapp.com",
    databaseURL: "https://hangman-80e69.firebaseio.com",
    projectId: "hangman-80e69",
    storageBucket: "hangman-80e69.appspot.com",
    messagingSenderId: "456424717921",
    appId: "1:456424717921:web:048722b12b2a5433d5f420"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Starts the game
function start() {
    cleanUp();
    generateButtons();

    // Generates random word
    index = Math.floor(Math.random() * 10);
    currentWord = wordList[index];
    let charAmount = charCount[index];
    
    // Displays the word as _'s
    for (let i = 0; i < charAmount; i++) {
        charDisplay.push("_ ");
        document.getElementById("word").innerHTML += charDisplay[i];
    }
}

// Button object constructor
function Button(letter) {
    this.letter = letter;
    let button = document.createElement("button");
    button.className = "buttons";
    button.innerHTML = letter;
    button.onclick = buttonClick;
    document.getElementById("buttonContainer").appendChild(button);
}

// Dynamically generates buttons
function generateButtons() {
    for (let i = 0; i < alphabet.length; i++) {
        new Button(alphabet[i]);
    }
}

// Button click event handler
function buttonClick() {
    // No more clicks if lives < 1
    if (lives < 1) {
        return;
    }
    // Checks if letter is correct or not
    if (currentWord.includes(this.innerHTML.toLowerCase())) {
        for (let n = 0; n < charCount[wordList.indexOf(currentWord)]; n++) {
            if (currentWord.charAt(n) == this.innerHTML.toLowerCase()) {
                // Increases score based on amount of times char appears in the word
                score += 10;
                userScore += 10;
                // Reveals characters in the hidden word
                charDisplay.splice(n, 1, currentWord.charAt(n) + " ");

                let wordDisplay = "";
                for (let i = 0; i < charDisplay.length; i++) {
                    wordDisplay += charDisplay[i];
                }
                document.getElementById("word").innerHTML = wordDisplay;
                // User feedback
                scoreFeedback();
            }
        }
        document.getElementById("score").innerHTML = "Score: " + score;
        this.style.backgroundColor = "rgb(66, 66, 66)";
        this.style.color= "black"
        this.onclick = null;
    } else {
        lives--;
        document.getElementById("lives").innerHTML = "Lives: " + lives;
        document.getElementById("image").src = "images/hang" + lives + ".png";
        // User feedback
        livesFeedback();
        // Game over if life less than 1
        if (lives < 1) {
            setTimeout(function() { 
                gameOver(); 
            }, 1000);
        }
    }
    // Checks if all characters are guessed correctly
    let characters = "";
    for (let i = 0; i < charDisplay.length; i++) {
        characters += charDisplay[i];
    }
    if (!characters.includes("_")) {
        setTimeout(function() {
            congrats();
        }, 1000);
    }
}

// Congrats function
function congrats() {
    window.alert("Correct! Next word!");
    start();
}

// Game over function
function gameOver() {
    let username = prompt("Game over! Enter your name to be featured on the leaderboard:");
    if(username === null){
        restart();
    } else {
        while(username.trim() == ""){
           username = prompt("Please enter a name!");
           if(username === null){
               restart();
               return;
           }
        }
        localStorage.setItem("username", username);
        localStorage.setItem("score", userScore);
        db.collection("users").add({
            name: username,
            score: score
        }).then(function(){
            console.log("User added to database");
        })
        setTimeout(function(){
            window.location.href = "leaderboard.html";
        }, 1000);
    }
}

// Clean up function
function cleanUp() {
    // Resets image
    document.getElementById("image").src = "images/hang7.png";
    // Resets lives
    lives = 7;
    document.getElementById("lives").innerHTML = "Lives: 7";
    // Resets character display
    charDisplay = [];
    document.getElementById("word").innerHTML = "";
    // Removes buttons
    document.getElementById("buttonContainer").innerHTML = "";
}

// Resets score
function resetScore() {
    document.getElementById("reset").style.backgroundColor = "grey";
    setTimeout(function() {
        document.getElementById("reset").style.backgroundColor = "rgba(255, 0, 0, 0.404)";
    }, 200);
    score = 0;
    userScore = 0;
    document.getElementById("score").innerHTML = "Score: 0";
}

// Restarts game
function restart() {
    // User feedback
    wordFeedback();
    // Resets game
    resetScore();
    start();
}

// Shows hint
function showHint() {
    if (hint == false) {
        hint = true;
        // Button click feedback
        document.getElementById("showHint").style.backgroundColor = "grey";
        setTimeout(function() {
            document.getElementById("showHint").style.backgroundColor = "lightgreen";
        }, 200);
        // User feedback
        document.getElementById("hint").style.fontSize = "3vh";
        document.getElementById("hint").style.border = "1px solid black";
        document.getElementById("hint").style.padding = "30px";
        setTimeout(function() {
            document.getElementById("hint").style.fontSize = "0vh";
            document.getElementById("hint").style.border = "0px solid black";
            document.getElementById("hint").style.padding = "0px";
            hint = false;
        }, 3000);
        // Sets definition
        document.getElementById("hint").innerHTML = "Hint: " + definitions[index];
    }
}

// Score feedback
function scoreFeedback() {
    document.getElementById("score").style.color = "green";
    document.getElementById("score").style.fontSize = "4vh";
    setTimeout(function() {
        document.getElementById("score").style.color = "black";
        document.getElementById("score").style.fontSize = "3vh";
    }, 1000);
}

// Lives feedback
function livesFeedback() {
    document.getElementById("lives").style.color = "red";
    document.getElementById("lives").style.fontSize = "4vh";
    setTimeout(function() {
        document.getElementById("lives").style.color = "black";
        document.getElementById("lives").style.fontSize = "3vh";
    }, 1000);
}

// Word feedback
function wordFeedback() {
    // Score
    document.getElementById("score").style.color = "green";
    document.getElementById("score").style.fontSize = "3.5vh";
    setTimeout(function() {
        document.getElementById("score").style.color = "black";
        document.getElementById("score").style.fontSize = "3vh";
    }, 1000);
    // Lives
    document.getElementById("lives").style.color = "green";
    document.getElementById("lives").style.fontSize = "3.5vh";
    setTimeout(function() {
        document.getElementById("lives").style.color = "black";
        document.getElementById("lives").style.fontSize = "3vh";
    }, 1000);
    // Word
    document.getElementById("word").innerHTML = "";
    setTimeout(function() {
        document.getElementById("word").style.color = "black";
    }, 1000);
}

// Starts the game when page loads
start();