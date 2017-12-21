

window.onload = function() {
    var that = this;
    //button hookups
    //var triFactory = new TriangleFactory();
  //  var triRenderer = new TriangleRenderer();

    var flipButton = document.getElementById("flipButton");
    var rotateButton = document.getElementById("rotateButton");

    var mode = '';

    //var manipulationTriangle = triFactory.produceTriangle();    //triangle for canvas that will be manipulated

    var manipulationCanvas = $("#triangleArea") //element that will hold the rotated/fliped triangle
    var triCanvas = document.getElementById('triangleArea');
    var ctx = triCanvas.getContext('2d');

    triCanvas.addEventListener('mousedown', function(e){
      var mousePos = getMousePos(triCanvas, e);
      console.log(mousePos);
      ctx.fillStyle = '#000000';
      ctx.beginPath();

      ctx.arc(mousePos.x, mousePos.y, 1 , 0, 2*Math.PI);

      ctx.fill();
    });
    //triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas); //set triangle and canvas set to be rendered

    var running = true;

    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();

      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      };
    }

    flipButton.addEventListener('click', function(){
      mode = 'flip';
      flipButton.style.opacity = 1;
      rotateButton.style.opacity = .7;
    });

    rotateButton.addEventListener('click', function(){
      mode = 'rotate';
      rotateButton.style.opacity = 1;
      flipButton.style.opacity = .7;
    });

}
