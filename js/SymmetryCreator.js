window.onload = function() {
    var that = this;
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0]; //element that will hold the rotated/fliped triangle
    var drawingCanvas = $('#drawingCanvas')[0]; //canvas for drawing symbols on modal after saving symmetry

    var savedSymmetries = utils.LoadSymmetryList();

    for(var it = 0; it < savedSymmetries.length; it++) {
        $("#savedSymmetries").append(savedSymmetries[it]['elem']).click(function(event){
            document.getElementById('editModal').style.display = 'block';

            document.getElementById('editModal').setAttribute('symbolIndex', event.target.id);
        });
    }

    var editing = false;    //dumbguy boolean to determine whether drawn symbol is new or edited
    var drawingController = new DrawingCanvasController(drawingCanvas); //controller to manage drawing on modal window

    //apparently you can use CSS in console.log() lmao
    //type console.log("%c somestring", CSS);
    //the following strings can be used as CSS strings for logging prettily
    // const goodLog = [
    //     'background: green',
    //     'color: white',
    //     'display: block',
    //     'text-align: center'
    // ].join(';');
    // const badLog = [
    //     'background: red',
    //     'color: black',
    //     'display: block',
    //     'text-align: center'
    // ].join(';');
    // const lineBreak = [
    //     'background: black',
    //     'color: black',
    //     'display: block',
    //     'text-align: center'
    // ].join(';');

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

    var BGtriConfig = {   //configuration for main triangle object (rotates and flips)
        name : "BG",
        x : triConfig.x,
        y : triConfig.y,
        radius : triConfig.radius,
        segmented : false,
        timeBound: true,
        pointLabels: false,
        baseColor: "#5c6370"
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset();

    var bgTri = new triFactory.produceTriangle(BGtriConfig);                //background triangle
    bgTri.reset();

    triRenderer.addRenderPair(bgTri, manipulationCanvas);                   //add background tri first so it draws behind
    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas);    //set triangle and canvas set to be rendered



    //initializing controller that manages positioning and drawing of flip and rotate points
    var manipulationController = new ManipulationCanvasController(manipulationCanvas)


    $("#flipButton").click(function(){
        var flipPoints = manipulationController.flipPoints;
        rotateButton.style.webkitAnimationName = '';

        if(manipulationController.mode === 'flip'){
            if(flipPoints[0] == flipPoints[1]) flipPoints[0] = utils.add(flipPoints[0], {x: 1, y: 1, z: 0});

            manipulationTriangle.flip(flipPoints[0], flipPoints[1]);
            console.log("MOVES", manipulationTriangle.moveQueue);
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
            manipulationTriangle.rotate(manipulationController.angle, rotatePoint);
            console.log("MOVES", manipulationTriangle.moveQueue);
        }

        var rotateButton = this;
        this.style.webkitAnimationName='oscillate';
        this.style.webkitAnimationDuration = '1s';
        this.style.webkitAnimationIterationCount = 'infinite';

        manipulationController.triCenter = manipulationTriangle.anchorPoints[0];

        manipulationController.setMode('rotate');

        rotateButton.style.opacity = 1;
        flipButton.style.opacity = .7;
    });

    //edit menu callbacks
    $('#closeSettings').click(function(){
      $('#settingsModal').css('display', 'none');
    });

    $('#notSym').click(function(){
        $('#saveErrorModal').css('display', 'none');
    })
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

    //opens drawing window to save symmetry
    $('#saveButton').click(function(){
        if(hasSymmetry(manipulationTriangle, bgTri, 10)) {
            $('#saveModal').css('display', 'block');
            drawingCanvas.width = $('#drawingContainer')[0].clientWidth;
            drawingCanvas.height = $('#drawingContainer')[0].clientHeight;
        } else {
            $("#saveErrorModal").css('display', 'block');
        }

    });

    //deletes selected drawing
    $('#deleteDrawing').click(function(){
      var imgName = $('#editModal').attr('symbolIndex');
      idx = savedSymmetries.findIndex(x => x.id == parseInt(imgName))
      savedSymmetries.splice(idx, 1)
      utils.StoreSymmetryList(savedSymmetries)

      $('#' + imgName).remove();
      $('#editModal').css('display', 'none');
    });

    //edits selected drawing
    $('#editDrawing').click(function(){
      var imgName = $('#editModal').attr('symbolIndex');
      editing = true;

      $('#editModal').css('display', 'none');
      $('#saveModal').css('display', 'block');
      drawingCanvas.width = $('#drawingContainer')[0].clientWidth;
      drawingCanvas.height = $('#drawingContainer')[0].clientHeight;
    });

    $('#cancelDrawing').click(function(){
        $('#editModal').css('display', 'none');
    });

    $('#settingsButton').click(function(){
      $('#settingsModal').css('display', 'block');
    });

    //clears drawing window
    $('#clearCanvas').click(function(){
      drawingCanvas.getContext('2d').clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);  //clears drawing canvas in modal popup
    });

    //saves drawing in drawing modal
    $('#saveDrawing').click(function(){
      if(editing){    //if editing an existing symbol
        var imgName = $('#editModal').attr('symbolIndex');

        $('#' + imgName).attr('src', drawingCanvas.toDataURL('image/png'));
      }

      else{           //if saving a new symbol
        var data = drawingCanvas.toDataURL('image/png');  //stores canvas data in .png
        var uniqueID = String((new Date).getTime())
        $(document.createElement("img"))
          .attr({src: data, id: 'savedSym' + uniqueID, width: $('#savedSymmetries').height() * .8, height: $('#savedSymmetries').height() * .8})
          .appendTo('#savedSymmetries')
          .click(function(){
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('editModal').setAttribute('symbolIndex', 'savedSym' + savedSymmetries.length);
            console.log('savedSym' + savedSymmetries.length);
        });

        savedSymmetries.push({'data' : data, 'moves' : manipulationTriangle.moveQueue, 'elem' : $("#savedSym" + savedSymmetries.length).prop('outerHTML'), 'id' : uniqueID});
        utils.StoreSymmetryList(savedSymmetries);
        //store symbol in new <img> tag

      }
      //toggle boolean, close modal and clear canvas
      editing = false;
      document.getElementById('saveModal').style.display = "none";
      drawingCanvas.getContext('2d').clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);  //clears drawing canvas in modal popup
    });

    $('#undoButton').click(function(){
        manipulationTriangle.undo();
    });

    $('#resetButton').click(function(){
        manipulationTriangle.reset();
    });

    $('#redoButton').click(function(){
        manipulationTriangle.redo();
    });
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
       manipulationController.rotatePoint = resizePoint(manipulationController.rotatePoint);
       manipulationController.flipPoints[0] = resizePoint(manipulationController.flipPoints[0]);
       manipulationController.flipPoints[1] = resizePoint(manipulationController.flipPoints[1]);
       manipulationController.flipLine.p1 = manipulationController.flipPoints[0];
       manipulationController.flipLine.p2 = manipulationController.flipPoints[1];
       bgTri.translate({x: ($('#drawingArea')[0].clientWidth-manipulationCanvas.width)/2, y: ($('#drawingArea')[0].clientHeight-manipulationCanvas.height)/2, z: 0});

       manipulationCanvas.width = $('#drawingArea')[0].clientWidth;
       manipulationCanvas.height = $('#drawingArea')[0].clientHeight;
       drawingCanvas.width = $('#drawingContainer')[0].clientWidth;
       drawingCanvas.height = $('#drawingContainer')[0].clientHeight;
       ManipulationCanvasController.canvas = manipulationCanvas;
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
