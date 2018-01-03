

window.onload = function() {
    var that = this;
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0]; //element that will hold the rotated/fliped triangle
    var drawingCanvas = $('#drawingCanvas')[0]; //canvas for drawing symbols on modal after saving symmetry

    var savedSymbols = [];

    var drawingController = new DrawingCanvasController(drawingCanvas); //controller to manage drawing on modal window

    $('#drawingCanvas').mousedown(function(e){
      drawingController.findMousePos('down', e);
    });

    $('#drawingCanvas').mousemove(function(e){
      drawingController.findMousePos('move', e);
    });

    $('#drawingCanvas').mouseup(function(e){
      drawingController.findMousePos('up', e);
    });

    $('#drawingCanvas').mouseout(function(e){
      drawingController.findMousePos('out', e);
    });
    //setting size based on calculated %properties in html
    manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
    manipulationCanvas.height = $('#drawingArea')[0].clientHeight;

    console.log($('#drawingContainer')[0].clientHeight);

    triConfig = {   //configuration for main triangle object (rotates and flips)
        name : "Test",
        x : manipulationCanvas.width,
        y : manipulationCanvas.height,
        radius : 100,
        segmented : true,
        timeBound: true
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset()

    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas); //set triangle and canvas set to be rendered


    //initializing controller that manages positioning and drawing of flip and rotate points
    var manipulationController = new ManipulationCanvasController(manipulationCanvas)

    //event callbacks
    var angle = 0;

    $('#angle').on('input', function() {
        angle = this.value;
    });

    $("#triangleArea").mousedown(function(e){
        manipulationController.mouseListener(e)
    });

    var rotateButton = document.getElementById('rotateButton');
    var flipButton = document.getElementById('flipButton');

    $("#flipButton").click(function(){
        var flipPoints = manipulationController.flipPoints;
        rotateButton.style.webkitAnimationName = '';

        if(manipulationController.mode === 'flip'){
            manipulationTriangle.flip(flipPoints[0], flipPoints[1]);
        }

        var flipButton = this;
        this.style.webkitAnimationName='oscillate';
        this.style.webkitAnimationDuration = '1s';
        this.style.webkitAnimationIterationCount = 'infinite';

        manipulationController.setMode('flip');

        flipButton.style.opacity = 1;
        rotateButton.style.opacity = .7;
    });

    $("#rotateButton").click(function(){
        var rotatePoint = manipulationController.rotatePoint;
        flipButton.style.webkitAnimationName = 'none';

        if(manipulationController.mode === 'rotate'){
            manipulationTriangle.rotate(angle, rotatePoint);
        }

        var rotateButton = this;
        this.style.webkitAnimationName='oscillate';
        this.style.webkitAnimationDuration = '1s';
        this.style.webkitAnimationIterationCount = 'infinite';

        manipulationController.setMode('rotate');

        rotateButton.style.opacity = 1;
        flipButton.style.opacity = .7;
    });

    $('#saveButton').click(function(){
      document.getElementById('saveModal').style.display = 'block';
      drawingCanvas.width = $('#drawingContainer')[0].clientWidth;
      drawingCanvas.height = $('#drawingContainer')[0].clientHeight;
    });

    $('#clearCanvas').click(function(){
      drawingCanvas.getContext('2d').clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);  //clears drawing canvas in modal popup
    });

    $('#saveDrawing').click(function(){
      var data = drawingCanvas.toDataURL('image/png');

      savedSymbols.push(data);

      var tempImg = document.createElement('img');  //creating img element to store canvas contents
      tempImg.src = data;
      tempImg.id = 'savedSym' + savedSymbols.length;
      tempImg.width = $('#savedSymmetries').height() * .8;
      tempImg.height = $('#savedSymmetries').height() * .8;
      tempImg.addEventListener('click', playbackSym(savedSymbols.indexOf(data))); //callback should do something useful eventually
      //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\\\\
      //TODO: find out why this listener is only being called once when the element is created

      $('#savedSymmetries').append(tempImg);  //append image to container

      console.log(tempImg);

      document.getElementById('saveModal').style.display = "none";
      drawingCanvas.getContext('2d').clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);  //clears drawing canvas in modal popup
    });

    function playbackSym(index){
      console.log(index);
    }

    window.onclick = function(event) {
      if (event.target == document.getElementById('saveModal')) {
          document.getElementById('saveModal').style.display = "none";
      }
    }
    //whenever the window resizes, change the width, height, and position of canvas
    $('body')[0].onresize = function(){
      manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
      manipulationCanvas.height = $('#drawingArea')[0].clientHeight;
      drawingCanvas.width = $('#drawingContainer')[0].clientWidth;
      drawingCanvas.height =$('#drawingContainer')[0].clientHeight;

      manipulationController.canvasBoundingRect = manipulationCanvas.getBoundingClientRect();

      //manipulationTriangle.anchorPoints[0] = {x: manipulationCanvas.width/2, y: manipulationCanvas.height/2, z: 0};
      manipulationTriangle.translate(utils.subtract(utils.toPoint([manipulationCanvas.width/2, manipulationCanvas.height/2, 0]),     manipulationTriangle.anchorPoints[0]))
      //TODO: make triangle scale position with canvas on resize
    };

    //rendering loop happens below
    function render() {
        window.requestAnimationFrame(render);
        manipulationCanvas.getContext('2d').clearRect(0, 0, manipulationCanvas.width, manipulationCanvas.height);     //clears canvas
        triRenderer.render()
        manipulationController.render()

    }

    render()
}
