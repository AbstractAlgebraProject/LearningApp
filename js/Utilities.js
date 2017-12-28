
var utils = {
    subtract: function(a, b){   //subtract the x and y components of two points
        return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
    },

    add: function(a, b){    //add the x and y components of two points
        return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
    },

    average: function(a, b){    //find the midpoints between two points
        return {x: utils.add(a,b).x/2, y: utils.add(a,b).y/2, z: utils.add(a,b).z/2};
    },

    toPoint: function(array){   //convert array of values to point
        return{
            x: array[0],
            y: array[1],
            z: array[2]
        }
    },

    scale: function(scaleBy, point){
        return{
            x: scaleBy*point.x,
            y: scaleBy*point.y,
            z: scaleBy*point.z
        }
    },

    toArray: function(point){
        return [point.x, point.y, point.z];
    },

    normalize: function(p1, p2) {  //simple normalization to find unit vector of two points
        var diff = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];

        var mag = Math.pow((Math.pow(diff[0], 2) + Math.pow(diff[1], 2) + Math.pow(diff[2], 2)), .5) //magnitude of 3d vector

        return utils.toPoint([diff[0]/mag, diff[1]/mag, diff[2]/mag])
    },

    multiply: function(point, matrix){
        var p = [0, 0, 0, 0];
        var pointArray = utils.toArray(point);

        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                p[i] += pointArray[j] * matrix[j][i];
            }
        }

        console.log("Multiplied Matrices: ",  p);
        return utils.toPoint(p);
    }
}
