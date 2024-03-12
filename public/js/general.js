//globals
var player1Col = "#53e043";
var player2Col = "#d938c6";
var isCollab = true;
var numBalls = 12; //hardcoded as dont want to send too much data over the network
var ballCols = [[66, 245, 227], [131, 232, 125], [204, 51, 31], [83, 31, 161], [247, 121, 191], [237, 235, 81]]; //hardcoded as dont want to send too much data over the network
var selectedData = [];
var player1Selected = [];
var player2Selected = [];
var player1Pairs = 0;
var player2Pairs = 0;   

//hide end-game screen
document.querySelector("#end-overlay").style.display = "none";

let socket = io(); //connect this client

    socket.on('connect', (userData) => {
        console.log('Hello there');

//--------------------start game socket stuff---------------------------
    //event to send final user choice to server
    document.querySelector('.user-gesture-button').addEventListener('click', function(e) {
    //get the final selected colour of the user
        var finalColour = document.querySelector(".selected");
        if(finalColour.id == "circle-red"){
            finalColour = "red";
        } else {
        finalColour = "blue";
        }
        //disable the button
        document.querySelector('.user-gesture-button').disabled = true;

        socket.emit('finalChoice', finalColour);
    })

    //event to determine teams
    socket.on('teams', (data) => {
        console.log('teams: ' + data);

        //show the waiting text
        document.querySelector('#teamText').style.display='block';

        if(data.includes("red") && data.includes("blue")){
            isCollab = false;
        } else {
            isCollab = true;
        }
        //check that we have two responses
        if(data.length >= 6){
            startExperience();
        }
    });

    //send event
    document.querySelector('#circle-blue').addEventListener('click', function(e) {
        socket.emit('blue', socket.id);
    })

    //send event
    document.querySelector('#circle-red').addEventListener('click', function(e) {
        socket.emit('red', socket.id);
    })

    //listen for our custom colour change event
    socket.on('circleChoice', (data) => {
        console.log('circleChoice: ' + data);
        var temp = String(data);
        //if event was from other client
        if(temp.includes(socket.id) != true){
            if(temp.includes("red")){
            //change the outlines
            var otherCirc = document.querySelector("#circle-red");
            var selected = document.querySelector("#circle-blue");
            otherCirc.style.outlineColor = player2Col;
            selected.style.outlineColor = "white";
        
            } else {
            //change the outlines
            var otherCirc = document.querySelector("#circle-blue");
            var selected = document.querySelector("#circle-red");
            otherCirc.style.outlineColor = player2Col;
            selected.style.outlineColor = "white";
            }
        }
    });

//---------------------in game socket stuff----------------------------
    //selected ball event
    //pass the selected ball id
    setInterval(() => {
    socket.emit('allSelected', selectedData);
    }, 1000)

    //receive ball selection event
    //colour ball from other user
    socket.on('matching', (data) => {
    // console.log(data);
        //colour in other circles the enemy's colour
    for(let i = 0; i < data.length; i++){
        var connectedSelect = document.querySelector(`#select${data[i]}`);

        if(connectedSelect.getAttribute('visible') != true){
            //get the corresponding smaller circle and show it above         
            connectedSelect.setAttribute('material', 'color', `${player2Col}`);
            connectedSelect.setAttribute('visible', true);
            connectedSelect.parentElement.removeAttribute('class', 'interactive');
            connectedSelect.parentElement.removeAttribute('selected');
        }
    
        //if the selected ball is player1 colour, then add to player1 count
        if(connectedSelect.getAttribute('material').color === player1Col && !player1Selected.includes(data[i])){
            player1Selected.push(data[i]);

            currentVal = parseInt(player1Selected[i]);

            if(currentVal%2===0){
            checkValue = currentVal+1;

            } else {
            checkValue = currentVal-1;
            }

            if(player1Selected.includes(String(checkValue))){
            player1Pairs++;
            }

        } else if (connectedSelect.getAttribute('material').color === player2Col && !player2Selected.includes(data[i])) { //otherwise the enemy selected it
            player2Selected.push(data[i]);

            currentVal = parseInt(player2Selected[i]);

            if(currentVal%2===0){
            checkValue = currentVal+1;
            } else {
            checkValue = currentVal-1;
            }

            if(player2Selected.includes(String(checkValue))){
            player2Pairs++;
            }
        }      
        }

        //print out ui text
        document.querySelector("#enemyText2").innerHTML = "Matches: " + player2Pairs;
        document.querySelector("#enemyText1").innerHTML = "Matches: " + player1Pairs;

        //make sure all data is passed before ending the game
        if(!document.querySelector('a-scene').hasAttribute('create-balls')){
        gameEnd();
        }

    });

});


//make sure the scene has loaded before doing anything
AFRAME.registerComponent('start-experience', {
    init: function () {
      document.querySelector('#loading-animation').style.display='none';
    }
});

//endgame screen
function gameEnd(){

    document.querySelector("#teamText").style.display = "none";
    document.querySelector("#end-overlay").style.display = "block";

    //if we are collaborating then we both win
    if(isCollab){
      document.querySelector("#winnerText").innerHTML = "COLLABORATION WINS";
    } else { //if enemies, display who wins

      if(player1Pairs > player2Pairs){
        document.querySelector("#winnerText").innerHTML = "PLAYER 1 WINS";
        document.querySelector("#winnerText").style.color = player1Col;
      } else if(player1Pairs == player2Pairs){
        document.querySelector("#winnerText").innerHTML = "TIE GAME";
      } else {
        document.querySelector("#winnerText").innerHTML = "PLAYER 2 WINS";
        document.querySelector("#winnerText").style.color = player2Col;
      }
    }
}

//change the colours of the circle borders as the user presses them
function startSelection(id){

//show the start button
document.querySelector('.user-gesture-button').style.display='block';

//get the button that was pressed
var selectedCirc = document.querySelector("[id=" + CSS.escape(id) + "]");
selectedCirc.classList.add("selected");
selectedCirc.style.borderColor = player1Col;

//ensure the other circle is not pressed
if(id.includes("blue")){
    var otherCirc = document.querySelector("#circle-red");
    otherCirc.style.borderColor = "white";

    if(otherCirc.classList.contains("selected")){
    otherCirc.classList.remove("selected");
    }
} else {
    var otherCirc = document.querySelector("#circle-blue");
    otherCirc.style.borderColor = "white";

    if(otherCirc.classList.contains("selected")){
    otherCirc.classList.remove("selected");
    }
}
}

//once both users have selected a team, the game begins
function startExperience() {
//hide user-gesture overlay
    document.querySelector('#user-gesture-overlay').style.display='none';
    var instructions = document.querySelector('#teamText');
    if(isCollab){
    instructions.innerHTML = "MATCH COLOUR PAIRS!";
    document.querySelector('#collabText').style.display = 'block';
    } else {
    instructions.innerHTML = "MATCH MORE COLOUR PAIRS THAN YOUR ENEMY!";
    document.querySelector('#enemyText1').style.display = 'block';
    document.querySelector('#enemyText2').style.display = 'block';
    }
}