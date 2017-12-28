
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

        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                p[i] += point[j] * matrix[j][i];
            }
        }

        console.log("Multiplied Matrices: ",  p);
        return utils.toPoint(p);
    },

    dot4: function(arr1, arr2){
        return arr1[0]*arr2[0] + arr1[1]*arr2[1] + arr1[2]*arr2[2] +arr1[3]*arr2[3];
    },

    multiply4: function(mat1, mat2){
        var result = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];

        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                result[i][j] = utils.dot4(mat1[i], [mat2[0][j], mat2[1][j], mat2[2][j], mat2[3][j]]);
            }
        }

        console.log("Multiplied 4x4 Matrices: ", result);
        return result;
    },

    inv: function(matrix) {
        var inv = matrix
        for(r in matrix) {
            for(c in matrix[r]){
                if( r != c) {
                    inv[r][c] *= -1
                }
            }
        }
        return inv
    }
}
