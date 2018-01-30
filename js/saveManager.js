function saveManager() {
    var saver = this;

    saver.manager = function() {
        var that = this;

        var symms = []

        that.save = function(tri) {
            that.symms.push(tri)
            that.updateDOM
        }

        that.remove = function(sym) {
            //remove from symms array
        }

        that.updateDOM = function() {

        }

    }
}
