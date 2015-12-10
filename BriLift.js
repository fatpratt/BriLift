
var simulator = null;       // global simulator

function setSelElevator(elev) {
    simulator.setSelElevator(elev);
};

function setSelFloor(floor) {
    simulator.setSelFloor(floor);  
};

(function() {
    var Simulator = function(numElevators, numFloors) {
        this.numElevators = numElevators;
        this.numFloors = numFloors;
        this.selFloor = 0;
        this.selElevator = 0;
    };

    Simulator.prototype = {
        setSelElevator: function(e) {this.selElevator}
        setSelFloor: function(f) {this.selFloor}
    };

    $(document).ready(function() {
        console.log('ready');
        $(startSimBtn).click(console.log('start'));

        var numElevators = $('#numElevs').val();    // todo: add error checking
        var numFloors = $('#numFloors').val();

        simulator = new Simulator(numElevators, numFloors);
        simulator.startSim();

        $('#elevBtns').html('');
        $('#elevSels').html('')
       
        var makeBtnRow = function(label, num) {
            // okay I stole this code from another project
            for (var i = 0; i < num; i++) {
                var element = document.createElement("input");
                element.setAttribute("type", "button");
                element.setAttribute("value", i + 1);
                if (label == 'elevSels')
                    element.setAttribute("onclick", "setSelElevator(" + i + ")");
                if (label == 'elevBtns')
                    element.setAttribute("onclick", "setSelFloor(" + i + ")");

                var btnBarDiv = document.getElementById(label);
                btnBarDiv.appendChild(element);
            }
        }

        makeBtnRow('elevBtnBar', parseInt(numElevators, 10));
        makeBtnRow('elevFloorBar', parseInt(numFloors, 10));

    });
})();

// for automated testing later
function autoTestHook() {
    simulator = new Simulator(numElevators, numFloors);
    simulator.startSim();  
    setSelElevator(3);
    ssetSelFloor(4);
};