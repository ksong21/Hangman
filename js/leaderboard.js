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

// Back to game function
function goBack() {
    // Button click feedback
    document.getElementById("goBack").style.backgroundColor = "grey";
    setTimeout(function() {
        document.getElementById("goBack").style.backgroundColor = "azure";
    }, 200);
    window.location.href = "index.html";
}

// Grabs leaderboard from db and displays them
function orderLeaderboard(){
    let tableRef = document.getElementById("leaderboard");
    let position = 1;
    let ref = db.collection("users");
    ref.orderBy("score", "desc").limit(10).get().then(function(snap){
        snap.forEach(function(doc){
            console.log(doc.data());
            let newRow = tableRef.insertRow(-1);
            let name = document.createTextNode(doc.data().name);
            let score = document.createTextNode(doc.data().score);
            let positionCell = newRow.insertCell(-1);
            let nameCell = newRow.insertCell(-1);
            let scoreCell = newRow.insertCell(-1);
            nameCell.appendChild(name);
            scoreCell.appendChild(score);
            positionCell.innerHTML = position;
            position++;
        })
    });
}

// Shows user position on the leaderboard
document.getElementById("username").innerHTML = localStorage.getItem("username");
document.getElementById("userScore").innerHTML = localStorage.getItem("score");

// Score flashing indicator
setInterval(function() {
    if (document.getElementById("user").style.backgroundColor == "yellow") {
        document.getElementById("user").style.backgroundColor = "white";
    } else {
        document.getElementById("user").style.backgroundColor = "yellow";
    }
}, 1000);

// Starts the leaderboard function
orderLeaderboard();