function SaveManager() {
    var that = this;

    var symms = []

    that.save = function(tri) {
        that.symms.push(tri)
        that.updateDOM()
    }

    that.remove = function(sym) {
        //remove from symms array
        that.symms.splice(that.symms.indexOf(sym), 1)
        that.updateDOM()
    }

    that.updateDOM = function() {

    }

}
