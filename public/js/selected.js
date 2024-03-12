'use strict'

//deal with balls that have been selected
AFRAME.registerComponent('selected', {
    init: function () {
      
      var el = this.el;
      var elCol = el.getAttribute('material').color;
      var scene = document.querySelector('a-scene');

      //the mouseover changes the colour of the ball
      el.addEventListener('mouseenter', function () {
          
        el.removeAttribute('material', 'color');
        el.setAttribute('material','color', 'white');
           
      });

      //when mouse leaves change the colour back
      el.addEventListener('mouseleave', function () {
          
          el.removeAttribute('material', 'color');
          el.setAttribute('material','color', `${elCol}`);
             
      });

      //once the ball is clicked
      el.addEventListener('click', function () {
         
        //get the corresponding smaller circle and show it above
        var connectedSelect = document.querySelector(`#select${el.getAttribute('id')}`);
        connectedSelect.setAttribute('material', 'color', `${player1Col}`);
        connectedSelect.setAttribute('visible', true);
        el.removeAttribute('class', 'interactive');
        el.removeAttribute('selected');

        //add the selected ball to the array to send to server
        selectedData.push(el.getAttribute('id'));
     });            
      
    }
  });