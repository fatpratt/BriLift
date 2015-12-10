
var simulator = null;       // global simulator

function setSelElevator(elev) {
    simulator.setSelElevator(elev);
};

function setSelFloor(floor) {
    simulator.setSelFloor(floor);  
};

(function() {

    // ----------------- State -----------------

    var State = function() {
        this.DOOR_OPEN = 1;
        this.DOOR_CLOSED = 2;
        this.DOOR_MOVING = 3;
        this.DOOR_ARRIVED = 4;
        this.curState = this.DOOR_OPEN;
    };

    State.prototype = {
        reset: function() {this.curState = this.DOOR_OPEN;}
    };

    // ----------------- Elevator -----------------

    var Elevator = function(elevNum) {
        this.elevNum = elevNum;
        this.curFloor = 0;
        this.desiredFloor = 0;
        this.state = new State();
        this.direction = 1;
        this.floorCnt = 0;
        this.tripCnt = 0;
        this.maintenance = false;
    };

    Elevator.prototype = {
        advance: function() {console.log('advance');},
        setDesiredFloor: function(f) {this.desiredFloor = f;}
    };

    // ----------------- Simulator -----------------

    var Simulator = function(numElevators, numFloors) {
        this.numElevators = numElevators;
        this.numFloors = numFloors;
        this.selFloor = 0;
        this.selElevator = 0;
        this.elevatorList = [];
    };

    Simulator.prototype = {
        setSelElevator: function(e) {this.selElevator = e;},
        setSelFloor: function(f) {
            this.selFloor = f; 
            this.elevatorList[this.selElevator].setDesiredFloor(f)
        },

        startSim: function(){ 
            console.log('start sim');
            this.elevatorList = [];
            for (var i = 0; i < this.numElevators; i++) {
                this.elevatorList.push(new Elevator(i));
            }

            // --- main simulator loop ---
            var self = this;
            var simLoop = function() {      
                for (var j = 0; j < self.elevatorList.length; j++) {
                    self.elevatorList[j].advance();
                }
                setTimeout(simLoop, 3000);
            }
            setTimeout(simLoop, 3000);
        }
    };

    // ----------------- doc ready -----------------

    $(document).ready(function() {
        console.log('ready');
        
        $('#startSimBtn').click(function() {

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
                    if (label == 'elevBtnBar')
                        element.setAttribute("onclick", "setSelElevator(" + i + ")");
                    if (label == 'floorBtnBar')
                        element.setAttribute("onclick", "setSelFloor(" + i + ")");

                    var btnBarDiv = document.getElementById(label);
                    btnBarDiv.appendChild(element);
                }
            }

            makeBtnRow('elevBtnBar', parseInt(numElevators, 10));
            makeBtnRow('floorBtnBar', parseInt(numFloors, 10));
        });
    });
})();

// for automated testing later
function autoTestHook() {
    simulator = new Simulator(numElevators, numFloors);
    simulator.startSim();  
    setSelElevator(3);
    ssetSelFloor(4);
};