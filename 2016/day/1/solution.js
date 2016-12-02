var NORTH = 0, //0
    EAST = 1,  //90
    SOUTH = 2, //180
    WEST = 3,  //270
    TURN_LEFT = 1,
    TURN_RIGHT = -1,
    LEFT_SYMBOL = 'L',
    RIGHT_SYMBOL = 'R',
    input = "L2, L5, L5, R5, L2, L4, R1, R1, L4, R2, R1, L1, L4, R1, L4, L4, R5, R3, R1, L1, R1, L5, L1, R5, L4, R2, L5, L3, L3, R3, L3, R4, R4, L2, L5, R1, R2, L2, L1, R3, R4, L193, R3, L5, R45, L1, R4, R79, L5, L5, R5, R1, L4, R3, R3, L4, R185, L5, L3, L1, R5, L2, R1, R3, R2, L3, L4, L2, R2, L3, L2, L2, L3, L5, R3, R4, L5, R1, R2, L2, R4, R3, L4, L3, L1, R3, R2, R1, R1, L3, R4, L5, R2, R1, R3, L3, L2, L2, R2, R1, R2, R3, L3, L3, R4, L4, R4, R4, R4, L3, L1, L2, R5, R2, R2, R2, L4, L3, L4, R4, L5, L4, R2, L4, L4, R4, R1, R5, L2, L4, L5, L3, L2, L4, L4, R3, L3, L4, R1, L2, R3, L2, R1, R2, R5, L4, L2, L1, L3, R2, R3, L2, L1, L5, L2, L1, R4",
    path = input.split(', ');

console.log(solve("R2, L3".split(', ')));
console.log(solve("R2, R2, R2".split(', ')));
console.log(solve("R5, L5, R5, R3".split(', ')));
console.log(solve(path));

function solve(path) {
    var curDir = 0, 
        x = 0,
        y = 0,
        dirToGo, dist,
        visits = {},
        key;

    for(var move in path){
        move = path[move];
        dirToGo = move.substr(0,1);
        dist = parseInt(move.substr(1));

        if(dirToGo === LEFT_SYMBOL){
            curDir += TURN_LEFT;
        }else if(dirToGo === RIGHT_SYMBOL) {
            curDir += TURN_RIGHT;
        }else {
            throw new Error('Something went wrong!');
        }
        curDir = getIndex(4, curDir);
        
        for(var i=0; i<dist; i++){
            switch(curDir){
                case NORTH:
                    y++;
                    break;
                case EAST:
                    x--;
                    break;
                case SOUTH:
                    y--;
                    break;
                case WEST:
                    x++;
                    break;
                default:
                    throw new Exception('Something went wrong2!');
            }

            key = `(${x}, ${y}) at a dist of ` + distance(x ,y);
            if(visits[key]) {
                console.log(visits[key] + ' ' + key)
                visits[key] += 1;
            }
            else {
                visits[key] = 1;
            }
        }
    }
    return distance(x, y);   
}

function distance(x, y){
    return Math.abs(x) + Math.abs(y);
}
function getIndex(numberOfDirections, i){
    var wasNegative = false,
        N = numberOfDirections;

    if (i < 0) {
        wasNegative = true;
        i = -i;
    }
    var offset = i % numberOfDirections;
    return (wasNegative) ? numberOfDirections - offset : offset;
}
