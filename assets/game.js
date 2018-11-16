// Initialize Firebase
var config = {
  apiKey: "AIzaSyArBfYE-DGbscVm0A-PpfcBS1NO77f2LJ8",
  authDomain: "rps-game-8857e.firebaseapp.com",
  databaseURL: "https://rps-game-8857e.firebaseio.com",
  projectId: "rps-game-8857e",
  storageBucket: "rps-game-8857e.appspot.com",
  messagingSenderId: "621755941172"
};
firebase.initializeApp(config);

let database = firebase.database();
let name = "";
let score = 0;
let choice;


//This allows the page to stay up to date with what is happening in the function
database.ref().on("value", function(snapshot) {

});


$(document).ready(function() {

  //for the dropdown menu
$(".dropdown-trigger").dropdown();


  //Click event to start the game
  $("#startBtn").on("click", function(event){

    event.preventDefault();

    name = $("#name").val().trim();
    console.log(name);
    

    $("#start").hide();

    $("#game").show();

    $("#1name").text(name);

    database.ref().push({
      name: name,
      score: score,
      choice: choice
    })
    console.log(database.name);

  });

});


//Click event for the chat section
$("#chatBtn").on("click", function(event){

  event.preventDefault();

});

