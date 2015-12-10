

(function() {
    var Simulator = function(numElevators, numFloors) {
        this.numElevators = numElevators;
        this.numFloors = numFloors;
    };

    Simulator.prototype = {
        test: function() {'log hello'}
    };

    $(document).ready(function() {
        console.log('ready');
        $(startSimBtn).click(console.log('start'));

        var numElevators = $('#numElevs').val();
        var numFloors = $('#numFloors').val();

        var simulator = new Simulator(numElevators, numFloors);
        simulator.test();
    });
})();