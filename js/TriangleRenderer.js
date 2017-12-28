

function TriangleRenderer() {
    var that = this

    var date = new Date();
    that.lastFrameTime = date.getTime() //epoch in ms

    that.renderPairs = [] //pairs of triangles to be rendered

    that.addRenderPair= function(triangle, canvas) {
        that.renderPairs.push({tri : triangle, canvas : canvas})
    }

    that.renderPair = function(pair) {
        var tri = pair.tri
        var canvas = pair.canvas
        var context = canvas.getContext('2d')
        var newDate = new Date();
        var thisFrameTime = newDate.getTime()

        tri.advanceAnimation(thisFrameTime-that.lastFrameTime);
        that.lastFrameTime = thisFrameTime

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
            context.font = '48px serif'
            for (var i = 0; i < tri.anchorPoints.length; i++) {
                point = tri.anchorPoints[i]
                context.fillText(point[0], point[1], tri.ABCMap[i])
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
