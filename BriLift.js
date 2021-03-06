
var simulator = null;       // global simulator

function setSelElevator(elev) {
    simulator.setSelElevator(elev);
};

function setSelFloor(floor) {
    simulator.setSelFloor(floor);  
};

function callFromFloor(floor) {
    console.log('set goto floor');
};

function gotoFloor(floor) {
    console.log('set goto floor');
};

(function() {

    // ----------------- State -----------------

     var LiftState = function() {
        this.IDLE = 1,
        this.DOOR_CLOSE = 2,
        this.MOVING = 3,
        this.ARRIVED = 4,
        this.DOOR_OPEN = 5,
        this.curState = this.IDLE
    };

    LiftState.prototype = {
        next: function() {
                this.curState++;
                if (this.curState > this.DOOR_OPEN) this.curState = 1;
            },
        reset: function() {this.curState = 1;},    
        isIdle: function() {
            return this.curState === 1;
        },
        isMoving: function() {
            return this.curState === 3;
        },
        setCloseDoor: function() {this.curState = this.DOOR_CLOSE;},
        setArrived: function() {this.curState = this.ARRIVED;},
        getPrintableState: function() {
            if (this.curState === this.IDLE) return "idle";
            if (this.curState === this.DOOR_CLOSE) return "door closed";
            if (this.curState === this.MOVING) return "moving";
            if (this.curState === this.ARRIVED) return "arrived";                
            if (this.curState === this.DOOR_OPEN) return "door open";
        }   
    };

    // ----------------- Elevator -----------------

    var Elevator = function(elevNum) {
        this.elevNum = elevNum;
        this.curFloor = 0;
        this.desiredFloor = 0;
        this.state = new LiftState();
        this.direction = 0;

        this.floorCnt = 0;
        this.tripCnt = 0;
        this.maintenance = false;
    };

    Elevator.prototype = {
        advance: function() {
            if (this.state.isIdle()) {
                // do nothing
                return;
            } else {
                if (this.state.isMoving()) {
                    // is this the desired floor
                    if (this.curFloor == this.desiredFloor) {
                        this.tripCnt++;
                        this.state.setArrived();
                        if (this.tripCnt % 100 === 0) this.maintenance = true;  // todo: finish maintenance service code later
                        return;
                    }    

                    // move elevator
                    this.direction = 0;
                    if (this.curFloor < this.desiredFloor) this.direction = 1;
                    else this.direction = -1;
                    this.curFloor = this.curFloor + this.direction;
                    this.floorCnt++;
                } else {
                    this.state.next();
                }
            }                
        },
        setDesiredFloor: function(f) {this.desiredFloor = f;},
        startMoving: function(f) {this.state.setCloseDoor()},
        dumpCurStatus: function() {
            console.log('Elevator: ' + (this.elevNum + 1) +  ' CurFloor: ' + (this.curFloor + 1) + ' State:' + this.state.getPrintableState());
        }

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
            // check maintenance mode here
            this.selFloor = f; 
            this.elevatorList[this.selElevator].setDesiredFloor(f)
            this.elevatorList[this.selElevator].startMoving(f);
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
                    self.elevatorList[j].dumpCurStatus();
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
                    if (label == 'callFloorBtnBar')
                        element.setAttribute("onclick", "callFromFloor(" + i + ")");
                    if (label == 'gotoFloorBtnBar')
                        element.setAttribute("onclick", "gotoFloor(" + i + ")");

                    var btnBarDiv = document.getElementById(label);
                    btnBarDiv.appendChild(element);
                }
            }

            makeBtnRow('elevBtnBar', parseInt(numElevators, 10));
            makeBtnRow('floorBtnBar', parseInt(numFloors, 10));

            makeBtnRow('callFloorBtnBar', parseInt(numFloors, 10));
            makeBtnRow('gotoFloorBtnBar', parseInt(numFloors, 10));
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