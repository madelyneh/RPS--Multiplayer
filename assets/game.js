$(document).ready(function() {

  //for the dropdown menu
$(".dropdown-trigger").dropdown();


//Click event to start the game
$("#startBtn").on("click", function(event){

  event.preventDefault();

  $("#start").hide();
});

});

