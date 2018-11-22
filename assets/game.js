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
let turn;


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
  turn;
};

//Compares the game results
function gameResults() {

  let outcome;
  let pick1 = $("<div>");
  let result1 = $("<div>").html(player1.name + " picked: " + player1.choice);

  let pick2 = $("<div>");
  let result2 = $("<div>").html(player2.name + " picked: " + player2.choice);

   //Notify of the tie
  if (player1.choice === player2.choice) {

    outcome = "It's a tie!";

    database.ref().child("/players/player1/tie").set(player1.tie + 1);
    database.ref().child("/players/player2/tie").set(player2.tie + 1);
  }
  else if (player1.choice === "rock") {
    
    if (player2.choice === "scissors") {

      outcome = player1.name + " wins!";
      
      $("#player1").addClass("winner");

      database.ref().child("/players/player1/win").set(player1.win + 1);
      database.ref().child("/players/player2/loss").set(player2.loss + 1);
    } 

    else if (player2.choice === "paper") {

      $("#player2").addClass("winner");

      outcome = player2.name + " wins!";
      
      database.ref().child("/players/player2/win").set(player2.win + 1);
      database.ref().child("/players/player1/loss").set(player1.loss + 1);
      
    };
  }
  else if (player1.choice === "paper") {
    
    if (player2.choice === "rock") {

      $("#player1").addClass("winner");

      database.ref().child("/players/player1/win").set(player1.win + 1);
      database.ref().child("/players/player2/loss").set(player2.loss + 1);    
    } 
    else if (player2.choice === "scissors") {

      $("#player2").addClass("winner");

      outcome = player2.name + " wins!";
      
      database.ref().child("/players/player2/win").set(player2.win + 1);
      database.ref().child("/players/player1/loss").set(player1.loss + 1);    
    };
  }

  else if (player1.choice === "scissors") {
    
    if (player2.choice === "paper") {

      $("#player1").addClass("winner");

      database.ref().child("/players/player1/win").set(player1.win + 1);
      database.ref().child("/players/player2/loss").set(player2.loss + 1);    
    } 
    else if (player2.choice === "rock") {

      $("#player2").addClass("winner");

      outcome = player2.name + " wins!";
      
      database.ref().child("/players/player2/win").set(player2.win + 1);
      database.ref().child("/players/player1/loss").set(player1.loss + 1);
    
    };
  };

  $("#users").text(outcome);
  $("#users").addClass("outcome");


  pick1.addClass("col s12");
  pick2.addClass("col s12");
  result1.addClass("choiceMsg");
  result2.addClass("choiceMsg");

  pick1.html(result1);
  pick2.html(result2);


  $("#chatHistory").append(pick1);
  $("#chatHistory").append(pick2);
  $("#chatHistory").scrollTop($("#chatHistory")[0].scrollHeight);


  database.ref().child("/turn").set(0);

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
      database.ref().child("/turn").set(0);
      
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
      // Set the turn value to 1, as player1 goes first
      database.ref().child("/turn").set(1);
      
    } else {
      $("#users").text("Waiting for both players to enter game.");
    };

  } else if ( $("#name").val().trim() === "" && !(player1 && player2)) {
    $("#users").text("Waiting for both players to join.");
  };

  $("#start").hide();

  $("#game").show();

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
    if ((yourPlayerName === player1.name) && (turn === 1)) {
      
      player1Choice = playerChoice;
      database.ref().child("/players/player1/choice").set(player1Choice);
      database.ref().child("/turn").set(2);
      console.log(player1Choice + " player 1");
    }
    // if current user's name is equal to player2Name
    else if ((yourPlayerName === player2.name) && (turn === 2)) {
      player2Choice = playerChoice;
      database.ref().child("/players/player2/choice").set(player2Choice);
      database.ref().child("/turn").set(3);
      console.log(player2Choice + " player 2");

    } 

    else {

      console.log("Houston, we have a problem.");
    };
  
  } 
  //If there are no players
  else {

    $("#users").text("Waiting for all players to join the game.");
  };

});

//Checks if the players exists and displays a msg if not
database.ref("/players/").on("value", function(snapshot) {
	
	if (snapshot.child("player1").exists()) {

		// Record player1 data
		player1 = snapshot.val().player1;
    player1Name = player1.name;
		$("#1name").text(player1Name);
		$("#player1Info").html("Win: " + player1.win + ", Loss: " + player1.loss + ", Tie: " + player1.tie);
	} else {

		player1 = null;
		player1Name = "";
		$("#1name").text("Waiting for Player 1...");
	};

	if (snapshot.child("player2").exists()) {

		// Record player2 data
		player2 = snapshot.val().player2;
    player2Name = player2.name;
		$("#2name").text(player2Name);
		$("#player2Info").html("Win: " + player2.win + ", Loss: " + player2.loss + ", Tie: " + player2.tie);
	} else {

		player2 = null;
		player2Name = "";
		$("#2name").text("Waiting for Player 2...");
	};

});

// Attach a listener to the database /chat/ node to listen for any new chat messages
database.ref("/chat/").on("child_added", function(snapshot) {
	let chatMsg = snapshot.val();
  let chatEntry = $("<div>");
  let newMsg = $("<div>").html(chatMsg);
  $("#chatPlaceholder").hide();
  
   if (chatMsg.startsWith(yourPlayerName)) {
    chatEntry.addClass("col s12");
    newMsg.addClass("floatLeft");
    chatEntry.html(newMsg);
    
	} else {
    chatEntry.addClass("col s12");
    newMsg.addClass("floatRight");
    chatEntry.html(newMsg);
    
	}

	$("#chatHistory").append(chatEntry);
	$("#chatHistory").scrollTop($("#chatHistory")[0].scrollHeight);
});

//Listener to the turn
database.ref().child("/turn").on("value", function(snapshot) {
  turn = snapshot.val();

  if ((turn === 0) && (player1 && player2 !== null)) {

    setTimeout("database.ref().child('/turn').set(1)", 4000);


  } else if ((turn === 1) && (player1 && player2 !== null)) {

    $("#users").removeClass("outcome");
    $("#player1").removeClass("winner");
    $("#player2").removeClass("winner");

    if (yourPlayerName === player1Name) {

      $("#player2").removeClass("their-turn");

      $("#player1").addClass("their-turn");
      $("#users").text("Waiting for " + player1Name + " to choose.");
    } else if (yourPlayerName !== player1Name) {

      $("#player2").removeClass("their-turn");

      $("#player1").addClass("their-turn");
      $("#users").text("Waiting for " + player1Name + " to choose.");
    };
  } else if ((turn === 2) && (player1 && player2 !== null)) {

    if (yourPlayerName === player2Name) {

      $("#player1").removeClass("their-turn");

      $("#player2").addClass("their-turn");
      $("#users").text("Waiting for " + player2Name + " to choose.");

    } else if (yourPlayerName !== player2Name) {

      $("#player1").removeClass("their-turn");

      $("#player2").addClass("their-turn");
      $("#users").text("Waiting for " + player2Name + " to choose.");

    };  
  } else if ((turn === 3) && (player1 && player2 !== null)) {

    $("#player1").removeClass("their-turn");
    $("#player2").removeClass("their-turn");

    gameResults(); 
  };

});

