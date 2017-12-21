

window.onload = function() {
    var that = this;
    //button hookups
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationTriangle = triFactory.produceTriangle();    //triangle for canvas that will be manipulated

    var manipulationCanvas = $.("#triangleCanvas") //element that will hold the rotated/fliped triangle

    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas); //set triangle and canvas set to be rendered

    var running = true;
    while (running) {
            triRenderer.render()
    }


}
