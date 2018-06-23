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
        tri.animationSpeed = config.animationSpeed || 10000;  //time taken (inMS) for flip/rotate actions
        tri.radius = config.radius || 0;  //radius to define triangle size
        tri.baseColor = config.baseColor || "#0000000"; //default color
        tri.segmentColors = config.segmentColors || ["#42a4e5", "#9a66f4", "#16c2cc"];
        tri.segmented = config.segmented || false;    //whether the triangle will use the 3 segments for each corner
        tri.pointLabels = config.pointLabels || true;
        tri.canvasSize = {x : config.x, y : config.y} || { x : 0, y : 0}
        tri.lastMove = 0;
        tri.lastUndo = 0;
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
                p1 : [point.x, point.y, -1], //defining rotation axis on z
                p2 : [point.x, point.y, 1],
                u : [0, 0, 0],    //unit vector corresponding to axis through center
                remaining : angle, //radians remaining before move completion
                angle : angle
            }
            move.u = utils.normalize(move.p1, move.p2)

            if(!radians) {
                move.remaining = tri.toRadians(angle)    //converting angle to raidans
                move.angle = tri.toRadians(angle)
            }
            if(!tri.timeBound) {
                tri.rotateInstant3d(move, move.remaining);
                move.remaining = 0;
            }
            tri.moveQueue.push(move)
            console.log(tri.movequeue);
            tri.lastMove = tri.moveQueue.length-1;
        }

        //flips triangle across line, adding to move Queue
        tri.flip = function(point1, point2) {
            console.log(point1, point2);

            var move = {
                p1 : [point1.x, point1.y, 0], //defining rotation axis on xy
                p2 : [point2.x, point2.y, 0],
                u : [0, 0, 0],                  //unit vector corresponding to rotation axis
                remaining : Math.PI/2,               //radians remaining in move
                angle : Math.PI/2,
                inverse : false
            }
            move.u = utils.normalize(move.p1, move.p2);

            if(!tri.timeBound) {
                tri.rotateInstant3d(move, move.remaining);
                move.remaining = 0;
            }
            tri.moveQueue.push(move)
            console.log(tri.moveQueue);
            tri.lastMove = tri.moveQueue.length-1;
        }

        tri.undo = function() {
            console.log("UNDO");
            while(tri.moveQueue.length && tri.lastMove != -1) {
                if(tri.lastMove === tri.moveQueue.length) tri.lastMove--;
                var inverse = tri.moveQueue[tri.lastMove];
                console.log("Index: ", tri.lastMove);
                console.log("Moves: ", tri.moveQueue);
                if(!inverse.inverse) {
                    inverse.remaining = inverse.angle //translating back
                    inverse.inverse = true //set inverse flag to trigger removal after animation
                    tri.moveQueue.push(inverse)
                    tri.lastUndo = tri.lastMove;
                    tri.lastMove--;
                    break;
                }
                tri.lastMove--;
            }
        }

        tri.redo = function(){
            console.log("REDO");
            while(tri.moveQueue.length){
                if(tri.lastUndo === tri.moveQueue.length) tri.lastUndo--;
                var inverse = tri.moveQueue[tri.lastUndo];
                console.log("Index: ", tri.lastUndo);
                console.log("Moves: ", tri.moveQueue)
                if(inverse.inverse){
                    inverse.inverse = false;
                    inverse.remaining = inverse.angle;
                    tri.moveQueue.push(inverse);
                    break;
                }
                tri.lastUndo++;
            }
        }

        tri.translate = function(vector) {
            //console.log("Translating by: ", vector);
            for(point in tri.anchorPoints) {
                tri.anchorPoints[point] = utils.add(tri.anchorPoints[point], vector)
            }
            for(point in tri.segmentPoints) {
                tri.segmentPoints[point] = utils.add(tri.segmentPoints[point], vector)
            }
        }

        tri.generateSegmentPoints = function() {
            for(var i = 0; i < 3; i++){
                var p = utils.average(tri.anchorPoints[(i%3)+1], tri.anchorPoints[((i+1)%3)+1]);

                tri.segmentPoints[i] = p;
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

                tri.anchorPoints.push(utils.toPoint(p))
            }
            for(var i = 0; i < 3; i++){
                var p = utils.average(tri.anchorPoints[(i%3)+1], tri.anchorPoints[((i+1)%3)+1]);

                tri.segmentPoints.push(p);
                //console.log("SegmentPoints: " , i , p);
            }
        }

        tri.advanceAnimation = function(elapsedMS) {
            if(tri.timeBound) {
                var ratio = elapsedMS/tri.animationSpeed    //how many complete rotations could occur in given elapsed time
                var radians = 2 * Math.PI * ratio             //converting rotations to radians
                for (var i = 0; i < tri.moveQueue.length; i++) {
                    var m = tri.moveQueue[i];   //get corresponding move
                    var rotation = 0; //how many radians the 3d rotation will go
                    if (m.remaining > 0) {  //if the move is not done being animated
                        if (m.remaining >= radians) {
                            rotation = radians
                            m.remaining -= radians
                            radians = 0
                        } else {
                            rotation = m.remaining
                            radians -= m.remaining
                            m.remaining = 0
                        }
                        if (m.inverse) {
                            tri.rotateInstant3d(m, -1 * rotation)
                        } else {
                            tri.rotateInstant3d(m, rotation)
                        }

                        if (radians <= 0){
                            break;
                        }
                    } else {
                        if (m.inverse) {
                            //tri.moveQueue.pop(); //remove the inverse and its original
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
            tri.generateSegmentPoints()

        }

        tri.rotateInstant3d = function(move, theta) {
            var applyMatrix = function(array, matrix) {
                for(var i = 0; i < array.length; i++) {
                    //TODO array[i]
                }
            }
            tri.translate(utils.scale(-1, utils.toPoint(move.p1)))
            var animationPoints = tri.anchorPoints;
            var c = animationPoints[0]


            var angles = utils.scale(theta, move.u);

            var trig = {
                x : {
                    sin : Math.sin(angles.x),
                    cos : Math.cos(angles.x)
                },
                y : {
                    sin : Math.sin(angles.y),
                    cos : Math.cos(angles.y)
                },
                z : {
                    sin : Math.sin(angles.z),
                    cos : Math.cos(angles.z)
                }
            }
            var rotX = [
                [1, 0           , 0             , 0],
                [0, trig.x.cos  , -trig.x.sin   , 0],
                [0, trig.x.sin  , trig.x.cos    , 0],
                [0, 0           , 0             , 1]
            ]
            var rotY = [
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

            //var operationArray = [translation, rotXSpace, rotYSpace, rotZ, utils.inv(rotYSpace), utils.inv(rotXSpace), utils.inv(translation)];
            var operationArray = [utils.inv(rotX), utils.inv(rotY), rotZ, rotY, rotX]
            var operationMatrix = identity;
            for(matrix in operationArray ){
                operationMatrix = utils.multiplyM(operationMatrix, operationArray[matrix]);
            }
            //translate to origin
            for(point in animationPoints) {
                animationPoints[point] = utils.toArray(animationPoints[point])
                animationPoints[point].push(1)
                animationPoints[point] = utils.multiply(animationPoints[point], operationMatrix)
            }

            tri.anchorPoints = animationPoints
            tri.translate(utils.scale(1, utils.toPoint(move.p1)))

            //http://paulbourke.net/geometry/rotate/
            //TODO implement rotation matrices
            //console.log("rotated ", tri.name, " by ",theta, " radians on ", move.u)
        }

        tri.toRadians = function(degrees) {
            return degrees * Math.PI/180
        }
    }
}
