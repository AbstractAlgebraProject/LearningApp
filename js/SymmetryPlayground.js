window.onload = function() {
    var that = this;
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0]; //element that will hold the rotated/fliped triangle
    var drawingCanvas = $('#drawingCanvas')[0]; //canvas for drawing symbols on modal after saving symmetry

    var savedSymmetries = utils.LoadSymmetryList();
    for(var it = 0; it < savedSymmetries.length; it++) {
        $("#savedSymmetries").append(savedSymmetries[it]['elem']).click(function(){
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('editModal').setAttribute('symbolIndex', this.id);
        });
    }

    var editing = false;    //dumbguy boolean to determine whether drawn symbol is new or edited
    var drawingController = new DrawingCanvasController(drawingCanvas); //controller to manage drawing on modal window

    manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
    manipulationCanvas.height = $('#drawingArea')[0].clientHeight;
    triConfig = {   //configuration for main triangle object (rotates and flips)
        name : "Test",
        x : manipulationCanvas.width,
        y : manipulationCanvas.height,
        radius : 150,
        segmented : true,
        timeBound: true,
        pointLabels: true,
        baseColor: "#42a4e5"
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset();


    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas);    //set triangle and canvas set to be rendered

    //edit menu callbacks
    $('#closeSettings').click(function(){
      $('#settingsModal').css('display', 'none');
    });

    $('#colors').change(function(){
      //stub for colors checkbox

    });

    $('#symSnap').change(function(){
      //stub for symmetry correction checkbox
    });

    utils.syncCheckbox($("#labels"), manipulationTriangle.pointLabels);
    $('#labels').change(function(){
      manipulationTriangle.toggleLabels();
    });

    utils.syncCheckbox($("#segments"), manipulationTriangle.segmented);
    $('#segments').change(function(){
        manipulationTriangle.toggleSegmentation();
    })

    $('#settingsButton').click(function(){
      $('#settingsModal').css('display', 'block');
    });

    $('#undoButton').click(function(){
        manipulationTriangle.undo();
    });

    $('#resetButton').click(function(){
        manipulationTriangle.reset();
    });

    $('#redoButton').click(function(){
        manipulationTriangle.redo();
    })

    //one liner that checks if you click outside a modal and closes if true
    $('.modal').on('click', function(event){
        if(!$(event.target).parents('.modal').length) this.style.display = 'none';
    });

    //whenever the window resizes, change the width, height, and position of canvas
    function calcTranslateDiff(point){
        var toReturn = {x: 0, y: 0};
        var drawWidth = $('#drawingArea')[0].clientWidth;
        var drawHeight = $('#drawingArea')[0].clientHeight;
        var canvasWidth = manipulationCanvas.width;
        var canvasHeight = manipulationCanvas.height;

        toReturn.x = (drawWidth-canvasWidth)*(point.x/canvasWidth);
        toReturn.y = (drawHeight-canvasHeight)*(point.y/canvasHeight);
        toReturn.z = 0;

        return toReturn;
    }

    function resizePoint(point){
        point = utils.add(point, calcTranslateDiff(point));
        point.z = 0;

        return point;
    }

    $('body')[0].onresize = function(){
       manipulationTriangle.translate(calcTranslateDiff(manipulationTriangle.anchorPoints[0]));

       manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
       manipulationCanvas.height = $('#drawingArea')[0].clientHeight;
       drawingCanvas.width = $('#drawingContainer')[0].clientWidth;
       drawingCanvas.height = $('#drawingContainer')[0].clientHeight;
       //console.log(manipulationCanvas.width);
       //console.log(manipulationCanvas.height);
      //
      // manipulationController.canvasBoundingRect = manipulationCanvas.getBoundingClientRect();

      //manipulationTriangle.anchorPoints[0] = {x: manipulationCanvas.width/2, y: manipulationCanvas.height/2, z: 0};
      //TODO: make triangle scale position with canvas on resize
    };

    //rendering loop happens below
    function render() {
        window.requestAnimationFrame(render);
        manipulationCanvas.getContext('2d').clearRect(0, 0, manipulationCanvas.width, manipulationCanvas.height);     //clears canvas
        triRenderer.render();
        manipulationController.render();
    }

    render();

}
