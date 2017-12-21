
window.onload = function() {
    var that = this;
    //button hookups
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0] //element that will hold the rotated/fliped triangle

    triConfig = {
        name : "Test",
        x : manipulationCanvas.width,
        y : manipulationCanvas.height,
        radius : 100,
        segmented : false
    }

    var manipulationTriangle = new triFactory.produceTriangle(triConfig);    //triangle for canvas that will be manipulated
    manipulationTriangle.reset()

    triRenderer.addRenderPair(manipulationTriangle, manipulationCanvas); //set triangle and canvas set to be rendered

    var test = [0, 20, 0]
    console.log(test)
    triRenderer.render()

}
