function DrawingCanvasController(canvas){
  var that = this;

  that.initialize = function() {
      //drawing canvas callbacks
      $('#drawingCanvas').mousedown(function(e){
        that.findMousePos('down', e);
      });

      $('#drawingCanvas').mousemove(function(e){
        that.findMousePos('move', e);
      });

      $('#drawingCanvas').mouseup(function(e){
        that.findMousePos('up', e);
      });

      $('#drawingCanvas').mouseout(function(e){
        that.findMousePos('out', e);
      });
  }
  that.initialize()

  var down = false;

  that.canvas = canvas;
  that.ctx = canvas.getContext('2d');
  that.canvasBoundingRect = canvas.getBoundingClientRect();
  that.strokeWidth = 3;

  var prevX = 0,
      prevY = 0,
      currX = 0,
      currY = 0;

//TODO: make canvas contents remain even after resizing

  that.draw = function(){
    that.ctx.beginPath();
    that.ctx.moveTo(prevX, prevY);
    that.ctx.lineTo(currX, currY);
    that.ctx.strokeStyle = '#000000';
    that.ctx.lineWidth = that.strokeWidth;
    that.ctx.stroke();
  }

  that.findMousePos = function(flag, e){
    console.log(flag);

    if(flag == 'down'){
      prevX = currX;
      prevY = currY;

      currX = e.clientX - $('#drawingCanvas').offset().left;
      currY = e.clientY - $('#drawingCanvas').offset().top;

      down = true;
    }

    if(flag == 'move'){
      if(down){
        prevX = currX;
        prevY = currY;

        currX = e.clientX - $('#drawingCanvas').offset().left;
        currY = e.clientY - $('#drawingCanvas').offset().top;

        that.draw();
      }
    }

    if(flag == 'out' || flag == 'up'){
      down = false;
    }
  }
}
