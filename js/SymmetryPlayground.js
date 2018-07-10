

window.onload = function() {
    var that = this;
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0]; //element that will hold the rotated/fliped triangle
    var drawingCanvas = $('#drawingCanvas')[0]; //canvas for drawing symbols on modal after saving symmetry


    var savedSymmetries = utils.LoadSymmetryList();
    console.log(savedSymmetries);

    for(var it = 0; it < savedSymmetries.length; it++) {
        if(it == savedSymmetries.length){it--; break}
        if (savedSymmetries[it]['moves'].length > 0) {
            savedSymmetries[it]['moves'][0]['keystone'] = true;
            savedSymmetries[it]['moves'][(savedSymmetries[it]['moves'].length-1)]['keystone'] = true;
        }
        $("#savedSymmetries").append(savedSymmetries[it]['elem']).unbind('click').on('click', (function(event){
                data = $("#" + event.target.id).attr("moves");
                console.log(data);
                addMoveQueue(JSON.parse(data));
        })).attr("moves", savedSymmetries[it]['moves']);
    }

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
        baseColor: "#42a4e5",
        animationSpeed : 5000
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset();

    function addMoveQueue(moves) {
        for(var i = 0; i < moves.length; i++) {
            console.log(moves[i])
            manipulationTriangle.addMove(moves[i])
        }
    }


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
        var keycount = 0;
        while(keycount < 2){
            console.log(keycount, manipulationTriangle.moveQueue[manipulationTriangle.lastMove])
            if(manipulationTriangle.moveQueue[manipulationTriangle.lastMove].keystone) keycount++;
            manipulationTriangle.undo();
        }
    });

    $('#resetButton').click(function(){
        manipulationTriangle.reset();
        savedSymmetries = [];
    });

    $('#redoButton').click(function(){
        var keycount = 0;
        while(keycount < 2){
            console.log(keycount, manipulationTriangle.lastUndo)
            console.log(manipulationTriangle.moveQueue)
            console.log(manipulationTriangle.moveQueue[manipulationTriangle.lastUndo])
            if(manipulationTriangle.moveQueue[manipulationTriangle.lastUndo].keystone) keycount++;
            manipulationTriangle.redo();
        }
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
       var newMoves = [];
       for(i = 0; i < savedSymmetries.length; i++){
           for(j = 0; j < JSON.parse(savedSymmetries[i]['moves']).length; j++){
               var newMove = JSON.parse(savedSymmetries[i]['moves'])[j];
               newMove.p1 = utils.toArray(resizePoint(utils.toPoint(newMove.p1)));
               newMove.p2 = utils.toArray(resizePoint(utils.toPoint(newMove.p2)));
               newMoves.push(newMove);
            }
            savedSymmetries[i]['moves'] = JSON.stringify(newMoves);
            $('#savedSymmetries').each(function(index){
                $(this).attr('moves', savedSymmetries[index]['moves'])
                console.log($(this).attr("moves"))
                $(this).unbind('click');
                $(this).unbind('click').on('click', function(event){
                    data = $(this).attr("moves");
                    console.log(data);
                    addMoveQueue(JSON.parse(data));
                });

                console.log(savedSymmetries)
                console.log($('#savedSymmetries'))
            });
       }


       manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
       manipulationCanvas.height = $('#drawingArea')[0].clientHeight;
       //ManipulationCanvasController.canvas = manipulationCanvas;
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
    }

    render();

}
