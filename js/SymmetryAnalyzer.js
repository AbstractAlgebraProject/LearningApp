

function hasSymmetry(t1, t2, tolerance) {
    var matches = [false, false, false, false]
    for(var it = 0; it < t1.anchorPoints.length; it++) {
        var p1 = t1.anchorPoints[it];
        for(var it2 = 0; it2 < t2.anchorPoints.length; it2++) {
            var p2 = t2.anchorPoints[it2];

            if(utils.distanceBetween(p1, p2) < tolerance) {
                matches[it] = true;
            }
        }
    }

    if(matches.indexOf(false) === -1) {
        return true;
    }
    return false;
}
