

window.onload = function() {
    var that = this;
    var triFactory = new TriangleFactory();
    var triRenderer = new TriangleRenderer();

    var manipulationCanvas = $("#triangleArea")[0]; //element that will hold the rotated/fliped triangle
    var drawingCanvas = $('#drawingCanvas')[0]; //canvas for drawing symbols on modal after saving symmetry

    var savedSymmetries = utils.LoadSymmetryList();
    for(var it = 0; it < savedSymmetries.length; it++) {
        $("#savedSymmetries").append(savedSymmetries[it]['elem']).click(function(){
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('editModal').setAttribute('symbolIndex', this.id);
        });
    }

    var editing = false;    //dumbguy boolean to determine whether drawn symbol is new or edited
    var drawingController = new DrawingCanvasController(drawingCanvas); //controller to manage drawing on modal window
}
