

function ManipulationCanvasController(canvas) {
    var that = this;

    that.initialize = function() {

        //setting size based on calculated %properties in htm

        $("#triangleArea").mousedown(function(e){
            that.findMousePos('down', e);
        });
        $("#triangleArea").mousemove(function(e){
            that.findMousePos('move', e);
        });
        $("#triangleArea").mouseup(function(e){
            that.findMousePos('up', e);
        });
        $("#triangleArea").mouseout(function(e){
            that.findMousePos('out', e);
        });

        that.angle = utils.DefaultorValue($("#angle").value, 0);
        console.log("Angle : " + that.angle)
        $('#angle').on('input', function() {
            that.angle = this.value;
        });
    }
    that.initialize();

    that.canvas = canvas
    that.context = canvas.getContext('2d')
    that.canvasBoundingRect = canvas.getBoundingClientRect();
    that.triCenter = {x: that.canvasBoundingRect.width, y: that.canvasBoundingRect.height};
    that.angle = 0; //rotation angle
    that.degrees = true;
    that.radians = false;
    that.tolerance = 10;

    //points used for displaying rotate and flip points
    that.flipPoints = [{x: 0, y:0, z:0}, {x: 0, y:0, z:0}];
    that.rotatePoint= {x: 0, y:0, z:0};
    that.flipLine = {p1: that.flipPoints[0], p2: that.flipPoints[1]};
    that.pointRadius = 10;
    that.pointIndex = 0;
    that.rotateFillColor = '#420420';
    that.flipFillColor = '#420420';

    //mode ("rotate" or "flip")
    that.mode = "";

    that.setToleranceLevel = function(newlevel) {
        that.tolerance = newlevel
    }
    
    that.toggleAngleFormat = function() {
        that.radians = !that.radians; that.degrees = !that.degrees;
    }

    that.setMode = function(mode) {
        if(that.mode == ''){
            that.flipPoints[0].x = that.triCenter.x/2 + 200;
            that.flipPoints[0].y = that.triCenter.y/2;
            that.flipPoints[1].x = that.triCenter.x/2 - 200;
            that.flipPoints[1].y = that.triCenter.y/2;
        }
        that.rotatePoint.x = that.triCenter.x;
        that.rotatePoint.y = that.triCenter.y;

        that.mode = mode;

        // if (mode == "rotate") { //reset the point values in preperation for next flip
        //     that.flipPoints[0].x = 0;
        //     that.flipPoints[0].y = 0;
        //     that.flipPoints[1].x = 0;
        //     that.flipPoints[1].y = 0;
        // }
        // else if(mode == 'flip'){
        //     that.rotatePoint.x = that.triCenter.x;
        //     that.rotatePoint.y = that.triCenter.y;
        // }

    }

    that.getMousePos = function(mouseEvent) {
      return {
        x: mouseEvent.clientX - that.canvasBoundingRect.left,    //gets position relative to top-left corner of the canvas
        y: mouseEvent.clientY - that.canvasBoundingRect.top,
        z: 0
      };
    }

    var prevX=prevY=currX=currY=0;
    var down = false;
    var dragFlag = 0;

    //detects which flippoint is being clicked, hovered, or dragged
    that.findClickedPoint = function(){
        for(i = 0; i < 2; i++){
            if(utils.distanceBetween(that.flipPoints[i], {x: currX, y: currY, z: 0}) < 1.5*that.pointRadius){
                $('body').css('cursor', 'pointer');
                dragFlag = i+1;
            }
        }
        if(dragFlag === 0){
            $('body').css('cursor', 'default');
        }

        //console.log(dragFlag);
    }

    that.findMousePos = function(flag, e){
      if(flag == 'down'){
        dragFlag = 0;

        prevX = currX;
        prevY = currY;

        currX = e.clientX - $('#triangleArea').offset().left;
        currY = e.clientY - $('#triangleArea').offset().top;
        that.rotatePoint.x = currX;
        that.rotatePoint.y = currY;

        that.findClickedPoint();

        if(dragFlag === 0){
            that.flipPoints[0].x = currX;
            that.flipPoints[0].y = currY;
            that.flipPoints[1].x = currX;
            that.flipPoints[1].y = currY;
        }
        down = true;
      }

      if(flag == 'move'){
        currX = e.clientX - $('#triangleArea').offset().left;
        currY = e.clientY - $('#triangleArea').offset().top;

        if(down){

          prevX = currX;
          prevY = currY;

          if(dragFlag !== 0){
              that.flipPoints[dragFlag-1].x = currX;
              that.flipPoints[dragFlag-1].y = currY;
          }
          else if(dragFlag === 0){
              that.flipPoints[1].x = currX;
              that.flipPoints[1].y = currY;
          }
        }
        else{
            dragFlag = 0;
            that.findClickedPoint();
        }
      }

      if(flag == 'out' || flag == 'up'){
        down = false;
      }
    }

    that.render = function() {
        var ctx = that.context
        if(that.mode == "rotate") {
            //drawing single point that defines axis of rotation
            ctx.fillStyle = that.rotateFillColor;
            ctx.beginPath();
            ctx.arc(that.rotatePoint.x, that.rotatePoint.y, that.pointRadius , 0, 2*Math.PI);
            ctx.fill();
        }
        if(that.mode == "flip") {
            //drawing line between flip points
            ctx.fillStyle = that.flipFillColor;
            ctx.beginPath();
            ctx.moveTo(that.flipLine.p1.x, that.flipLine.p1.y);
            ctx.lineTo(that.flipLine.p2.x, that.flipLine.p2.y);
            ctx.stroke();

            //drawing the points at each end of the line
            for(i = 0; i < 2; i++){
              var p = that.flipPoints[i];

              ctx.fillStyle = that.flipFillColor;
              ctx.beginPath();
              ctx.arc(p.x, p.y, that.pointRadius, 0, 2*Math.PI);
              ctx.fill();
            }
        }
    }


}
