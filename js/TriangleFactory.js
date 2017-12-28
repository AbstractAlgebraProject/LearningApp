
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
        tri.segmentColors = config.segmentColors || ["#42a4e5", "#9a66f4", "#16c2cc"];
        tri.segmented = config.segmented || false;    //whether the triangle will use the 3 segments for each corner
        tri.pointLabels = config.pointLabels || true;
        tri.canvasSize = {x : config.x, y : config.y} || { x : 0, y : 0}

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
            console.log(angle);

            var move = {
                p1 : [point.x, point.y, -1], //defining rotation axis on z
                p2 : [point.x, point.y, 1],
                u : [0, 0, 0],    //unit vector corresponding to axis through center
                remaining : 2*Math.PI //radians remaining before move completion
            }
            move.u = utils.normalize(move.p1, move.p2)

            if(!radians) move.radians = tri.toRadians(angle)    //converting angle to raidans
            if(!tri.timeBound) {
                tri.rotateInstant3d(radians, point, radians);
                move.remaining = 0;
            }
            tri.moveQueue.push(move)

        }

        //flips triangle across line, adding to move Queue
        tri.flip = function(point1, point2) {
            console.log(point1, point2);

            var move = {
                p1 : [point1.x, point1.y, 0], //defining rotation axis on xy
                p2 : [point2.x, point2.y, 0],
                u : [0, 0, 0],                  //unit vector corresponding to rotation axis
                remaining : Math.PI               //radians remaining in move
            }
            move.u = utils.normalize(move.p1, move.p2);

            if(!tri.timeBound) {
                tri.rotateInstant3d(move, move.remaining);
                move.remaining = 0;
            }
            tri.moveQueue.push(move)
        }

        tri.translate = function(vector) {
            for(point in tri.anchorPoints) {
                tri.anchorPoints[point] = utils.add(tri.anchorPoints[point], vector)
            }
            for(point in tri.segmentPoints) {
                tri.segmentPoints[point] = utils.add(tri.segmentPoints[point], vector)
            }
        }

        tri.generatePoints = function() {
            tri.anchorPoints = []
            tri.segmentPoints = []
            var center = utils.toPoint([tri.canvasSize.x/2, tri.canvasSize.y/2, 0])  //center is in middle of canvas
            tri.anchorPoints.push(center)   //add center to anchorpoints array
            for (var i = 1; i <= 3; i++) {
                var p = utils.toPoint([
                    tri.radius * Math.cos(i*2*Math.PI/3 - Math.PI/2),
                    tri.radius * Math.sin(i*2*Math.PI/3 - Math.PI/2),
                    0
                ]);
                p = [
                    p.x + center.x,
                    p.y + center.y,
                    p.z + center.z
                ];

                console.log("AnchorPoints: ", i, p);
                tri.anchorPoints.push(utils.toPoint(p))
            }
            for(var i = 0; i < 3; i++){
                var p = utils.average(tri.anchorPoints[(i%3)+1], tri.anchorPoints[((i+1)%3)+1]);

                tri.segmentPoints.push(p);
                console.log("SegmentPoints: " , i , p);
            }
        }

        tri.advanceAnimation = function(elapsedMS) {
            if(tri.timeBound) {
                var ratio = elapsedMS/tri.animationSpeed    //how many complete rotations could occur in given elapsed time
                var radians = 2 * Math.PI * ratio             //converting rotations to radians
                for (var i = 0; i < tri.moveQueue.length; i++) {
                    var m = tri.moveQueue[i];   //get corresponding move
                    if (m.remaining > 0) {  //if the move is not done being animated
                        if (m.remaining >= radians) {
                            tri.rotateInstant3d(m, radians)
                            m.remaining -= radians
                            radians = 0
                        } else {
                            tri.rotateInstant3d(m, m.remaining)
                            radians -= m.remaining
                            m.remaining = 0
                        }
                        if (radians <= 0){
                            break;
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < tri.moveQueue.length; i++) {
                    var m = tri.moveQueue[i];   //get corresponding move
                    if (m.remaining > 0) {  //if the move is not done, do it
                        tri.rotateInstant3d(m, m.remaining)
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
            var animationPoints = tri.anchorPoints;
            var c = animationPoints[0]
            var translation = [
                [1, 0, 0, c.x],
                [0, 1, 0, c.y],
                [0, 0, 1, c.z],
                [0, 0, 0, 1]
            ]

            var angles = utils.scale(move.u, theta)
            var trig = {
                x : {
                    sin : Math.sin(angles[0]),
                    cos : Math.cos(angles[0])
                },
                y : {
                    sin : Math.sin(angles[1]),
                    cos : Math.cos(angles[1])
                },
                z : {
                    sin : Math.sin(angles[2]),
                    cos : Math.cos(angles[2])
                }
            }
            var rotXSpace = [
                [1, 0           , 0             , 0]
                [0, trig.x.cos  , -trig.x.sin   , 0]
                [0, trig.x.sin  , trig.x.cos    , 0]
                [0, 0           , 0             , 1]
            ]
            var rotYSpace = [
                [trig.y.cos , 0, trig.y.sin, 0],
                [0          , 1, 0         , 0],
                [-trig.y.sin, 0, trig.y.cos, 0],
                [0          , 0, 0         , 1]
            ]
            var rotZ = [
                [trig.z.cos ,  -trig.z.sin, 0, 0],
                [trig.z.sin ,   trig.z.cos, 0, 0],
                [0          , 0           , 1, 0],
                [0          , 0           , 0, 1]
            ]
            var identity = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]

            operationArray = [translation, rotXSpace, rotYSpace, rotZ, inv(rotYSpace), inv(rotZSpace), inv(translation)]
            operationMatrix = identity
            for(matrix in operationArray ){
                operationMatrix = utils.matrixMultiply(operationMatrix, operationArray[matrix])
            }
            //translate to origin
            for(point in animationPoints) {
                animationPoints[point] = utils.matrixMultiply(animationPoints[point], operationArray)
            }

            //http://paulbourke.net/geometry/rotate/
            //TODO implement rotation matrices
            console.log("rotated ", tri.name, " by ",theta, " radians on ", move.u)
        }

        tri.toRadians = function(degrees) {
            return degrees * Math.PI/180
        }
    }
}
