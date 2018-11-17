// Initialize Firebase
let config = {
  apiKey: "AIzaSyArBfYE-DGbscVm0A-PpfcBS1NO77f2LJ8",
  authDomain: "rps-game-8857e.firebaseapp.com",
  databaseURL: "https://rps-game-8857e.firebaseio.com",
  projectId: "rps-game-8857e",
  storageBucket: "rps-game-8857e.appspot.com",
  messagingSenderId: "621755941172"
};
firebase.initializeApp(config);

let database = firebase.database();

//Player1 info
let player1 = null;
let player1Name = "";
let player1Choice = "";

//Player2 info
let player2 = null;
let player2Name = "";
let player2Choice = "";



//This allows the page to stay up to date with what is happening in the function
// database.ref().on("value", function(snapshot) {

//   console.log(snapshot.val());

//   name = snapshot.val().database.name;

 

// });


$(document).ready(function() {

  //for the dropdown menu
  $(".dropdown-trigger").dropdown();
//WORKING HERE. Clearing the database
  if ((player1 !== null) && (player2 === null)) {

  }


});

//Click event to start the game
$("#startBtn").on("click", function(event){

  event.preventDefault();

// First, make sure that the name field is non-empty and we are still waiting for a player
  if ( ($("#name").val().trim() !== "") && !(player1 && player2) ) {
    // Adding player1
    if (player1 === null) {
      console.log("Adding Player 1");

      yourPlayerName = $("#name").val().trim();
      player1 = {
        name: yourPlayerName,
        win: 0,
        loss: 0,
        tie: 0,
        choice: ""
      };

      // Add player1 to the database
      database.ref().child("/players/player1").set(player1);


      // Set the turn value to 1, as player1 goes first
      database.ref().child("/turn").set(1);

    } else if( (player1 !== null) && (player2 === null) ) {
      // Adding player2
      console.log("Adding Player 2");

      yourPlayerName = $("#name").val().trim();
      player2 = {
        name: yourPlayerName,
        win: 0,
        loss: 0,
        tie: 0,
        choice: ""
      }
      
      // Add player2 to the database
      database.ref().child("/players/player2").set(player2);

    };

    // Add a user joining message to the chat
    let msg = yourPlayerName + " has joined!";
  

    // Get a key for the join chat entry
    let chatKey = database.ref().child("/chat/").push().key;

    // Save the join chat entry
    database.ref("/chat/" + chatKey).set(msg);


  };

  $("#start").hide();

  $("#game").show();

});

database.ref("/players/").on("value", function(snapshot) {
	// Check for existence of player 1 in the database
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
		player1Name = player1.name;

		// Update player1 display
		$("#1name").text(player1Name);
		$("#player1Stats").html("Win: " + player1.win + ", Loss: " + player1.loss + ", Tie: " + player1.tie);
	} else {

		player1 = null;
		player1Name = "";

		// Update player1 display
		$("#1name").text("Waiting for Player 1...");
	}

	// Check for existence of player 2 in the database
	if (snapshot.child("player2").exists()) {

		// Record player2 data
		player2 = snapshot.val().player2;
		player2Name = player2.name;

		// Update player2 display
		$("#2name").text(player2Name);
		$("#player2Stats").html("Win: " + player2.win + ", Loss: " + player2.loss + ", Tie: " + player2.tie);
	} else {

		player2 = null;
		player2Name = "";

		// Update player2 display
		$("#2name").text("Waiting for Player 2...");
	}

	// If both players are now present, it's player1's turn
	if (player1 && player2) {

		// Update the display with a green border around player 1
    $("#player1").addClass("their-turn");
    $("#users").text("Waiting for " + player1Name + " to choose.");

	}

});



//Click event for the chat section
$("#chatBtn").on("click", function(event){

  event.preventDefault();

});

