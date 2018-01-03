function DrawingCanvasController(canvas){
  var that = this;
  var down = false;

  that.canvas = canvas;
  that.ctx = canvas.getContext('2d');
  that.canvasBoundingRect = canvas.getBoundingClientRect();

  var prevX = 0,
      prevY = 0,
      currX = 0,
      currY = 0;

//TODO: make canvas contents remain even after resizing

  that.draw = function(){
    that.ctx.beginPath();
    that.ctx.moveTo(prevX, prevY);
    that.ctx.lineTo(currX, currY);
    that.ctx.strokeStyle = '#420420';
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
