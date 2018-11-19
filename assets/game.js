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

let yourPlayerName;

// let flashInterval;


// This function clears the database
function clearDatabase() {
  database.ref("/players/").remove();
  database.ref("/chat/").remove();
  database.ref("/turn/").remove();

  //Player2 info
  player1 = null;
  player1Name = "";
  player1Choice = "";

  //Player2 info
  player2 = null;
  player2Name = "";
  player2Choice = "";

  yourPlayerName;
};


$(document).ready(function() {

  //for the dropdown menu
  $(".dropdown-trigger").dropdown();

  $("#deleteDatabase").on("click", clearDatabase);

});

//Click event to start the game
$("#startBtn").on("click", function(event){

  event.preventDefault();

// First, make sure that the name field is non-empty and we are still waiting for a player
  if ( ($("#name").val().trim() !== "") && !(player1 && player2) ) {
    // Adding player1
    if (player1 === null) {
      
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

    } else {
      $("#users").text("Waiting for both players to enter game.");
    };

  } else if ( $("#name").val().trim() === "" && !(player1 && player2)) {
    $("#users").text("Waiting for both players to join.");
  };

  $("#start").hide();

  $("#game").show();


});

//Checks if the players exists and displays a msg if not
database.ref("/players/").on("value", function(snapshot) {
	
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
    player1Name = player1.name;
    console.log(player1Name);


		// Update player1 display
		$("#1name").text(player1Name);
	//	$("#player1Info").html("Win: " + player1.win + ", Loss: " + player1.loss + ", Tie: " + player1.tie);
	} else {

		player1 = null;
		player1Name = "";

		// Update player1 display
		$("#1name").text("Waiting for Player 1...");
	}

	if (snapshot.child("player2").exists()) {

		// Record player2 data
		player2 = snapshot.val().player2;
    player2Name = player2.name;
    console.log(player2Name);


		// Update player2 display
		$("#2name").text(player2Name);
		//$("#player2Info").html("Win: " + player2.win + ", Loss: " + player2.loss + ", Tie: " + player2.tie);
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

	// First, make sure that the player exists and the message box is non-empty
	if ( (yourPlayerName !== "") && ($("#chatMsg").val().trim() !== "") ) {
	
		let msg = yourPlayerName + ": " + $("#chatMsg").val().trim();
    $("#chatMsg").val("");
    $("#chatMsg").height("0px");

		// Get a key for the new chat entry
		let chatKey = database.ref().child("/chat/").push().key;

		// Save the new chat entry
		database.ref("/chat/" + chatKey).set(msg);
	}
});

// Attach a listener to the database /chat/ node to listen for any new chat messages
database.ref("/chat/").on("child_added", function(snapshot) {
	let chatMsg = snapshot.val();
  let chatEntry = $("<div>");
  let yourMsg = $("<div>").html(chatMsg);
  let theirMsg = $("<div>").html(chatMsg);

  
   if (chatMsg.startsWith(yourPlayerName)) {
    chatEntry.addClass("col s12");
    yourMsg.addClass("floatLeft");
    chatEntry.html(yourMsg);
    
	} else {
    chatEntry.addClass("col s12");
    theirMsg.addClass("floatRight");
    chatEntry.html(theirMsg);
    
	}

	$("#chatHistory").append(chatEntry);
	$("#chatHistory").scrollTop($("#chatHistory")[0].scrollHeight);
});

//Click event for the elements
$("img").on("click", function(){
  
  let playerChoice = this.getAttribute("id");

  $("#" + playerChoice).addClass("their-choice");

  function removeClass() {
     $("#" + playerChoice).removeClass("their-choice");
  };

  setTimeout(removeClass, 200);

  // If both players are active
  if ((player1 !== null) && (player2 !== null)) {
    
    // if current user's name is equal to player1Name
    if (yourPlayerName === player1Name) {

    // if current user's name is equal to player2Name
    } else if (yourPlayerName === player2Name) {

    } else {
      alert("error. user not in database");
    };

  
  } 
  //If there are no players
  else if ((player1 === null) && (player2 === null)){
    $("#users").text("Waiting for both players to join.");

  } 
  //If player1 is empty
  else if ((player1 === null) && (player2 !== null)) {
    $("#users").text("Waiting for the other player to enter game.");
    
  } 
  //If player2 is empty
  else if ((player2 === null) && (player1 !== null)) {
    $("#users").text("Waiting for the other player to enter game.");

  };

});
