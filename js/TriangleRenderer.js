

function TriangleRenderer() {
    var that = this

    that.renderPairs = [] //pairs of triangles to be rendered

    that.addRenderPair= function(triangle, canvas) {
        var newDate = new Date();
        that.renderPairs.push({tri : triangle, canvas : canvas, lastFrameTime : newDate.getTime()})
    }

    that.renderPair = function(pair) {
        var tri = pair.tri
        var canvas = pair.canvas
        var context = canvas.getContext('2d')
        var newDate = new Date();
        var thisFrameTime = newDate.getTime()

        tri.advanceAnimation(thisFrameTime - pair.lastFrameTime);
        pair.lastFrameTime = thisFrameTime;

        if(tri.segmented) { //drawing procedure for segmented triangle
            context.fillStyle = tri.segmentColors[0];
            context.beginPath();
            context.moveTo(tri.anchorPoints[0].x, tri.anchorPoints[0].y);
            context.lineTo(tri.segmentPoints[2].x,
            tri.segmentPoints[2].y);
            context.lineTo(tri.anchorPoints[1].x, tri.anchorPoints[1].y); //center
            context.lineTo(tri.segmentPoints[0].x, tri.segmentPoints[0].y); //center
            context.fillStyle = tri.segmentColors[0];
            context.fill();
            context.fillStyle = tri.segmentColors[1];
            context.beginPath();
            context.moveTo(tri.anchorPoints[0].x, tri.anchorPoints[0].y);
            context.lineTo(tri.segmentPoints[0].x,
            tri.segmentPoints[0].y);
            context.lineTo(tri.anchorPoints[2].x, tri.anchorPoints[2].y);  //center
            context.lineTo(tri.segmentPoints[1].x, tri.segmentPoints[1].y);  //center
            context.fillStyle = tri.segmentColors[1];
            context.fill();

            context.fillStyle = tri.segmentColors[2];
            context.beginPath();
            context.moveTo(tri.anchorPoints[0].x, tri.anchorPoints[0].y)
            context.lineTo(tri.segmentPoints[1].x,
            tri.segmentPoints[1].y);
            context.lineTo(tri.anchorPoints[3].x, tri.anchorPoints[3].y)  //center
            context.lineTo(tri.segmentPoints[2].x, tri.segmentPoints[2].y)  //center
            context.fillStyle = tri.segmentColors[2];
            context.fill();
        } else {    //drawing procedure for blank tri
            context.fillStyle = tri.baseColor;
            context.beginPath();
            context.moveTo(tri.anchorPoints[1].x, tri.anchorPoints[1].y)
            context.lineTo(tri.anchorPoints[2].x, tri.anchorPoints[2].y)
            context.lineTo(tri.anchorPoints[3].x, tri.anchorPoints[3].y)
            context.fill();
        }
        if(tri.pointLabels) {
            context.font = tri.fontSize + 'px serif';
            tri.generateTextPoints();

            for (var i = 0; i < tri.textPoints.length; i++) {
                var point = tri.textPoints[i];
                var char = tri.ABCMap[i];
                if(tri.segmented)   context.fillStyle = tri.segmentColors[i];
                else context.fillStyle = tri.segmentColors[0];
                context.fillText(char, point.x - context.measureText(char).width/2, point.y + 24);
            }
        }



      //  console.log("Rendered Triangle: " + tri.name) //placeholder for testing
    }

    that.render = function() {

        for (p in that.renderPairs) {
            that.renderPair(that.renderPairs[p])

        }
    }
}
