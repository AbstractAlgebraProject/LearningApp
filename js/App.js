

window.onload = function() {
    var that = this;
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0] //element that will hold the rotated/fliped triangle

    //setting size based on calculated %properties in html
    //TODO add size change handler to scale these with window size changes
    manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
    manipulationCanvas.height = $('#drawingArea')[0].clientHeight;



    triConfig = {   //configuration for main triangle object (rotates and flips)
        name : "Test",
        x : manipulationCanvas.width,
        y : manipulationCanvas.height,
        radius : 100,
        segmented : false
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset()

    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas); //set triangle and canvas set to be rendered


    //initializing controller that manages positioning and drawing of flip and rotate points
    var manipulationController = new ManipulationCanvasController(manipulationCanvas)

    //event callbacks
    $("#triangleArea").mousedown(function(e){
        manipulationController.mouseListener(e)
    });

    $("#flipButton").click(function(){
        var flipButton = this;
        manipulationController.setMode('flip');

        flipButton.style.opacity = 1;
        rotateButton.style.opacity = .7;
    });

    $("#rotateButton").click(function(){
        var rotateButton = this;
        manipulationController.setMode('rotate');

        rotateButton.style.opacity = 1;
        flipButton.style.opacity = .7;
    });

    //whenever the window resizes, change the width, height, and position of canvas
    $('body')[0].onresize = function(){
      manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
      manipulationCanvas.height = $('#drawingArea')[0].clientHeight;
      manipulationController.canvasBoundingRect = manipulationCanvas.getBoundingClientRect();
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
