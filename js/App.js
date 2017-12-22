

window.onload = function() {
    var that = this;
    //button hookups
    //var triFactory = new TriangleFactory();
  //  var triRenderer = new TriangleRenderer();

    var flipButton = document.getElementById("flipButton");
    var rotateButton = document.getElementById("rotateButton");

    var mode = '';


    var manipulationCanvas = $("#triangleArea") //element that will hold the rotated/fliped triangle

    triConfig = {
        name : "Test",
        x : manipulationCanvas.width,
        y : manipulationCanvas.height,
        radius : 100,
        segmented : false
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset()

    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas); //set triangle and canvas set to be rendered

    triRenderer.render()

    //TODO move following manipulation code to ManipulationCanvasController.js, convert functions to use Jquery
    var triCanvas = document.getElementById('triangleArea');
    triCanvas.width = document.getElementById('drawingArea').clientWidth;
    triCanvas.height = document.getElementById('drawingArea').clientHeight;

    var ctx = triCanvas.getContext('2d');
    var flipPoints = [{x: 0, y:0}, {x: 0, y:0}];
    var flipLine = {p1: flipPoints[0], p2: flipPoints[1]};
    var pointRadius = 10;
    var pointIndex = 0;

    triCanvas.addEventListener('mousedown', function(e){
      var mousePos = getMousePos(triCanvas, e);


      if(mode == 'rotate'){
        ctx.clearRect(0, 0, triCanvas.width, triCanvas.height);     //clears canvas
        ctx.beginPath();

        ctx.fillStyle = '#5191f7';
        ctx.arc(mousePos.x, mousePos.y, pointRadius , 0, 2*Math.PI);

        ctx.fill();
      }

      else if(mode == 'flip'){
        ctx.clearRect(0, 0, triCanvas.width, triCanvas.height);     //clears canvas

        flipPoints[pointIndex].x = mousePos.x;
        flipPoints[pointIndex].y = mousePos.y;
        ctx.fillStyle = '#5191f7';
        ctx.beginPath();

        ctx.moveTo(flipLine.p1.x, flipLine.p1.y);
        ctx.lineTo(flipLine.p2.x, flipLine.p2.y);

        ctx.stroke();

        for(i = 0; i < 2; i++){
          var p = flipPoints[i];

          ctx.beginPath();

          ctx.fillStyle = '#5191f7';
          ctx.arc(p.x, p.y, pointRadius, 0, 2*Math.PI);

          ctx.fill();
        }

        pointIndex = (pointIndex == 0) ? pointIndex = 1 : pointIndex = 0;
        console.log(pointIndex);
      }


      console.log(flipLine);
    });

    var running = true;

    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();

      return {
        x: mouseEvent.clientX - rect.left,    //gets position relative to top-left corner of the canvas
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

      flipPoints[0].x = 0;
      flipPoints[0].y = 0;
      flipPoints[1].x = 0;
      flipPoints[1].y = 0;

      rotateButton.style.opacity = 1;
      flipButton.style.opacity = .7;
    });

}
