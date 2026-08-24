    
let adjacentPos = [[-1, 0], [0, 1], [1, 0], [0, -1]];
let board1 = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

let board2 = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

//start function
let queueHit = [[1, 2]];
let getHit = new Map();
function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

function adjacentFire(xPos, yPos, adjacentPos){
return adjacentPos.map((item) => {
    return [item[0] + xPos, item[1] + yPos];
    }).filter((item) => {
    //check whether the position is out of board
    return (item[0] >= 0 && item[0] < board1.length && 
        item[1] >= 0 && item[1] < board1[0].length && 
        !getHit.has(item[0]*10+item[1]));
    });
}

while(queueHit.length !== 0){
    let xRan = null, yRan = null;
    let adjacentShot = []; //four direction of center pos
    shuffle(adjacentPos);
    //shuffle array before
    if(getHit.size < 2) //in case don't know ship is vertical or horizontal place
    { 
        [xRan, yRan] = queueHit.shift();
        adjacentShot = adjacentFire(xRan, yRan, adjacentPos);
        console.log(adjacentShot);
    }
    else if(getHit.size >= 2) //after know second location can determine should fire vertical or horizontal
    {
        let iterator = getHit.values(); //like pointer
        let firstLocation = iterator.next().value; //take first location
        let secondLocation = iterator.next().value;
        //check ship is vertical or horizontal
        if(firstLocation[0] - secondLocation[0] === 0){
            //ship is placed horiontal location
            queueHit = queueHit.filter((value) => {
                return !getHit.has(value[0]*10 + value[1]) && value[0] - firstLocation[0] === 0;
            });
        }
        else if(firstLocation[1] - secondLocation[1] === 0){
            //ship is placed vertical location
            queueHit = queueHit.filter((value) => {
                return !getHit.has(value[0]*10 + value[1]) && value[1] - firstLocation[1] === 0;
            });
        }

        if(queueHit.length === 0) break;
        [xRan, yRan] = queueHit.shift();
        adjacentShot = adjacentFire(xRan, yRan, adjacentPos);

    }

    if(board1[xRan][yRan] === 1){
        board1[xRan][yRan] = 2; //hit target
        console.log(board1);
        getHit.set(xRan*10+yRan, [xRan, yRan]);
        queueHit.push(...adjacentShot);
    }

    
    else if (board1[xRan][yRan] === 0){
        board1[xRan][yRan] = 3; //miss attack
        console.log(board1);
    }
    else if(board1[xRan][yRan] === 2 || 
        board1[xRan][yRan] === 3
    ){
        console.log(board1);
        continue; // if repeat position, redo again
    }

    //check queue is empty but ship still exist
}