
function TriangleFactory() {
    var tf = this;
    tf.produced = 0
    //REQUIRED CONFIGURATION PROPERTIES
    //-- radius, x, y
    tf.produceTriangle = function(config) { //generates triangle object with specified properties
        var tri = this;
        tf.produced += 1
        //TRIANGLE MEMBER VARIABLES
        //TODO make this work with false goshdarn
        tri.name = config.name || tf.produced;
        tri.timeBound = config.timeBound || false;   //whether the triangle will be animated
        tri.moveQueue = []; //queued moves
        tri.animationSpeed = config.animationSpeed || 1000;  //time taken (inMS) for flip/rotate actions
        tri.radius = config.radius || 0;  //radius to define triangle size
        tri.baseColor = config.baseColor || "#0000000";//default color
        tri.segmentColors = config.segmentColors || ["#0000000", "#FFFFFFFF", "#696969"];
        tri.segmented = config.segmented || false;    //whether the triangle will use the 3 segments for each corner
        tri.pointLabels = config.pointLabels || true;
        tri.canvasSize = (config.x, config.y) || (0, 0)

        //---triangle point definitions---
        //anchor points are corners A,B,C, and center
        //segment points are midpoints AB, BC, CA
        tri.anchorPoints = []; //four points that define triangle
        tri.ABCMap = config.ABCMap || "ABC";    //ordering of symmettry points compared to anchor points
        tri.segmentPoints = []; //three midpoints that define corner blocks


        //TRIANGLE MEMBER FUNCTION
        tri.toggleSegmentation = function() {
            tri.segmented = !tri.segmented;
        }

        tri.reset = function() {
            tri.moveQueue = []
            tri.generatePoints()
        }

        //rotates triangle specified angle in degrees or radians, adding to moveQueue
        tri.rotate = function(angle, point, radians=false) {
            var move = {
                radians : angle,
                p1 : (point[0], point[1], -1), //defining rotation axis on z
                p2 : (point[1], point[1], 1),
                u : (0, 0, 0),
                complete : false
            }
            move.u = normalize(move.p1, move.p2)

            if(!radians) move.radians = toRadians(angle)    //converting angle to raidans
            if(!timeBound) {
                tri.rotateInstant(radians, point, radians);
                move.complete = true;
            }
            tri.moveQueue.push(move)

        }

        //flips triangle across line, adding to move Queue
        tri.flip = function(point1, point2) {
            var move = {
                radians : angle,
                p1 : (point1[0], point1[1], 0), //defining rotation axis on xy
                p2 : (point2[1], point2[1], 0),
                u : (0, 0, 0),                  //unit vector corresponding to rotation axis
                remaining : false               //remaining
            }
            move.u = normalize(move.p1, move.p2)

            if(!radians) move.radians = toRadians(angle)
            if(!timeBound) {
                tri.rotateInstant(radians, point, radians);
                move.remaining = 0;
            }
            tri.moveQueue.push(move)
        }

        //utility functions
        tri.normalize = function(p1, p2) {  //simple normalization to find unit vector of two points
            diff = (p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2])
            mag = pow((pow(diff[0], 2) + pow(diff[1], 2) + pow(diff[2], 2)), .5) //magnitude of 3d vector
            return (diff[0]/mag, diff[1]/mag, diff[2]/mag)
        }

        tri.generatePoints = function() {
            tri.anchorPoints = []
            tri.segmentPoints = []
            var center = (tri.canvasSize.x/2, tri.canvasSize.y/2, 0)  //center is in middle of canvas
            tri.anchorPoints.push(center)   //add center to anchorpoints array
            for (var i = 1; i <= 3; i++) {
                p = (
                    tri.radius * Math.cos(2*Math.PI/i),
                    tri.radius * Math.sin(2*Math.PI/i),
                    0
                )
                p = (
                    p[0] + center[0],
                    p[1] + center[1],
                    p[2] + center[2]
                )
                tri.anchorPoints.push(p)
            }
        }

        tri.advanceAnimation = function(elapsedMS) {
            if(!tri.timeBound) {
                ratio = elapsedMS/tri.animationSpeed    //how many complete rotations could occur in given elapsed time
                radians = 2 * Math.PI * ratio             //converting rotations to radians
                for (var i = 0; i < tri.moveQueue.length; i++) {
                    m = tri.moveQueue[i];   //get corresponding move
                    if (m.remaining > 0) {  //if the move is not done being animated
                        if (m.remaining >= radians) {
                            tri.rotateInstand3d(m, radians)
                            m.remaining -= radians
                        } else {
                            tri.rotateInstant3d(m, m.remaining)
                            radians -= m.remaining
                            m.remaining = 0
                        }
                    }
                }
            }

        }

        tri.rotateInstant3d = function(move, theta) {
            var applyMatrix = function(array, matrix) {
                for(var i = 0; i < array.length; i++) {
                    //TODO array[i]
                }
            }
            matrix = [
                [0, 0, 0]
                [0, 0, 0]
                [0, 0, 0]
            ]
            //http://paulbourke.net/geometry/rotate/
            //TODO implement rotation matrices
            print("rotated " + tri.name + " by " + theta + " radians on " + move.u)
        }

        tri.toRadians = function(degrees) {
            return degrees * Math.PI/180
        }
    }
}
