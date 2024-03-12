'use strict'

//create and manage the balls to be matched
AFRAME.registerComponent('create-balls', {
    init: function () {

        var scene = document.querySelector('a-scene');
        var numCol = 0;

        for(let i = 0; i < numBalls; i++){
            //get random positioning values
            var randX = (Math.random() < 0.5 ? -1 : 1);
            randX = randX * (Math.floor(Math.random() * 20));
            var randY = Math.floor(Math.random() * 3) + 1;
            var randZ = (Math.random() < 0.5 ? -1 : 1);
            randZ = randZ * (Math.floor(Math.random() * 20));

            //every 2 balls need a new colour
            if(i%2 === 0 && i !== 0){
            numCol++;
            }

            var currentR = ballCols[numCol][0];
            var currentG = ballCols[numCol][1];
            var currentB = ballCols[numCol][2];

            //create the balls
            var ball = document.createElement('a-entity');
            ball.setAttribute('id', `${i}`);
            ball.setAttribute('class', 'ball interactive');
            ball.setAttribute('geometry', {primitive: 'sphere'},{radius: '1'});
            ball.setAttribute('material', {color: `rgb(${currentR}, ${currentG}, ${currentB})`});
            ball.setAttribute('position', `${randX}, ${randY}, ${randZ}`);
            ball.setAttribute('selected', "");
            scene.appendChild(ball); //append it to the scene

            //create the balls
            var selectBall = document.createElement('a-entity');
            selectBall.setAttribute('id', `select${i}`);
            selectBall.setAttribute('visible', 'false');
            selectBall.setAttribute('geometry', {primitive: 'sphere'},{radius: 1});
            selectBall.setAttribute('scale', '0.2 0.2 0.2');
            selectBall.setAttribute('position', '0, 1.5, 0');
            ball.appendChild(selectBall); //append it to the scene
        }

    },
    tick: function(){
    
        var numSelected = 0;
        var numPaired = 0;
        var scene = document.querySelector('a-scene');

        for(let i = 0; i < numBalls; i++){
            
            var currentLittleBall = document.querySelector(`#select${i}`);
            //if the current ball visible then its been selected
            if(currentLittleBall.getAttribute('visible') == true){
            numSelected++;
            }

            //if both the current ball and its pair are selected //COLLAB
            if(isCollab){
            if(i%2 === 0){
                if(currentLittleBall.getAttribute('visible') == true && document.querySelector(`#select${i+1}`).getAttribute('visible') == true){
                numPaired++; //that's a pair          
                }
            }
            }
            
            //print out the text
            document.querySelector("#collabText").innerHTML = "Matches: " + numPaired;

            //when all balls are selected
            if(numSelected === 12){
            scene.removeAttribute('create-balls');
            }

        }
    },
});