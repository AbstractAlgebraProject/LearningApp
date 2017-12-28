
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

    normalize: function(p1, p2) {  //simple normalization to find unit vector of two points
        diff = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]]
        mag = pow((pow(diff[0], 2) + pow(diff[1], 2) + pow(diff[2], 2)), .5) //magnitude of 3d vector
        return tf.point([diff[0]/mag, diff[1]/mag, diff[2]/mag])
    }
}
