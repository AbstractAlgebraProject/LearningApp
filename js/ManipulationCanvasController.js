

function ManipulationCanvasController(canvas) {
    var that = this;

    that.canvas = canvas
    that.context = canvas.getContext('2d')
    that.canvasBoundingRect = canvas.getBoundingClientRect();

    //points used for displaying rotate and flip points
    that.flipPoints = [{x: 0, y:0}, {x: 0, y:0}];
    that.rotatePoint= {x: 0, y:0};
    that.flipLine = {p1: that.flipPoints[0], p2: that.flipPoints[1]};
    that.pointRadius = 10;
    that.pointIndex = 0;
    that.fillColor = '#5191f7'

    //mode ("rotate" or "flip")
    that.mode = ""

    that.setMode = function(mode) {
        that.mode = mode
        if (mode == "rotate") { //reset the point values in preperation for next flip
            that.flipPoints[0].x = 0;
            that.flipPoints[0].y = 0;
            that.flipPoints[1].x = 0;
            that.flipPoints[1].y = 0;
        }
    }

    that.getMousePos = function(mouseEvent) {
      return {
        x: mouseEvent.clientX - that.canvasBoundingRect.left,    //gets position relative to top-left corner of the canvas
        y: mouseEvent.clientY - that.canvasBoundingRect.top
      };
    }

    that.mouseListener = function(e) {
        var mousePos = that.getMousePos(e); //get position of mouse relative to the canvas

        if(that.mode == 'rotate'){
          that.rotatePoint = mousePos   //define the rotation point at clicked mouse position
        }

        else if(that.mode == 'flip'){
          that.flipPoints[that.pointIndex].x = mousePos.x;
          that.flipPoints[that.pointIndex].y = mousePos.y;

          that.pointIndex = (that.pointIndex == 0) ? that.pointIndex = 1 : that.pointIndex = 0; //increment point index
        }


    }

    that.render = function() {
        var ctx = that.context

        if(that.mode == "rotate") {
            //drawing single point that defines axis of rotation
            ctx.fillStyle = that.fillColor;
            ctx.beginPath();
            ctx.arc(that.rotatePoint.x, that.rotatePoint.y, that.pointRadius , 0, 2*Math.PI);
            ctx.fill();
        }
        if(that.mode == "flip") {
            //drawing line between flip points
            ctx.fillStyle = that.fillColor;
            ctx.beginPath();
            ctx.moveTo(that.flipLine.p1.x, that.flipLine.p1.y);
            ctx.lineTo(that.flipLine.p2.x, that.flipLine.p2.y);
            ctx.stroke();

            //drawing the points at each end of the line
            for(i = 0; i < 2; i++){
              var p = that.flipPoints[i];

              ctx.fillStyle = that.fillColor;
              ctx.beginPath();
              ctx.arc(p.x, p.y, that.pointRadius, 0, 2*Math.PI);
              ctx.fill();
            }
        }

    }
}
