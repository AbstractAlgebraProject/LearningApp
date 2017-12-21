

function TriangleRenderer() {
    var that = this

    that.date = new Date();
    that.lastFrameTime = this.date.getTime() //epoch in ms

    that.renderPairs = [] //pairs of triangles to be rendered

    that.addRenderPair= function(triangle, canvas) {
        that.renderPairs.push((triangle, canvas))
    }

    that.renderPair = function(pair) {
        var tri = pair[0]
        var canvas = pair[1]
        var context = canvas.getContext('2d')
        var frameTime = that.date.getTime()

        tri.advanceAnimation(thisFrameTime-lastFrameTime);

        if(tri.segmented) { //drawing procedure for segmented triangle
            context.beginPath();
            context.moveTo(tri.anchorPoints[0][0], tri.anchorPoints[0][1]);
            context.lineTo(tri.anchorPoints[3][0], tri.anchorPoints[3][1]); //center
            context.lineTo(tri.segmentPoints[1][0], tri.anchorPoints[1][1]); //center
            context.fillStyle = tri.segmentColors[0];
            context.fill();

            context.beginPath();
            context.moveTo(tri.anchorPoints[1][0], tri.anchorPoints[1][1]);
            context.lineTo(tri.anchorPoints[3][0], tri.anchorPoints[3][1]);  //center
            context.lineTo(tri.segmentPoints[1][0], tri.anchorPoints[1][1]);  //center
            context.fillStyle = tri.segmentColors[1];
            context.fill();

            context.beginPath();
            context.moveTo(tri.anchorPoints[2][0], tri.anchorPoints[2][1])
            context.lineTo(tri.anchorPoints[3][0], tri.anchorPoints[3][1])  //center
            context.lineTo(tri.segmentPoints[2][0], tri.anchorPoints[2][1])  //center
            context.fillStyle = tri.segmentColors[2];
            context.fill();
        } else {    //drawing procedure for blank tri
            context.beginPath();
            context.moveTo(tri.anchorPoints[0][0], tri.anchorPoints[0][1])
            context.lineTo(tri.anchorPoints[1][0], tri.anchorPoints[1][1])
            context.lineTo(tri.anchorPoints[2][0], tri.anchorPoints[2][1])
            context.fillStyle = tri.baseColor;
            context.fill();
        }
        if(tri.pointLabels) {
            context.font('48px serif')
            for (var i = 0; i < tri.anchorPoints.length; i++) {
                point = tri.anchorPoints[i]
                ctx.fillText(point[0], point[1], tri.ABCMap[i])
            }
        }



        print("Rendered Triangle: " + tri.name) //placeholder for testing
        //TODO rendering code
    }

    that.render = function() {
        for(p in pairs){
            that.renderPair(p)
          }
    }
}
