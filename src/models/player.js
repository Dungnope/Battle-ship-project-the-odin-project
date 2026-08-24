import { Ship } from "./ship.js";
import carrierShip from "../assets/carrier.svg";
import destroyerShip from "../assets/destroyer.svg";
import battleShip from "../assets/battle_ship.svg";
import patrolShip from "../assets/patrol.svg";
import Submarine from "../assets/submarine.svg";
// import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(name, gameboard) {
    this.isWinner = false;
    this.gameboard = gameboard;
    this.nameTag = name;
  }

  autoPlaceShip(ship, texture) {
    let x = Math.round(Math.random() * (this.gameboard.row - 1));
    let y = Math.round(Math.random() * (this.gameboard.row - 1));
    let axis = Math.round(Math.random());
    while (!this.gameboard.placeShip(ship, x, y, axis)) {
      x = Math.round(Math.random() * (this.gameboard.row - 1));
      y = Math.round(Math.random() * (this.gameboard.row - 1));
    }
    //take last item of ship list
    this.gameboard.shipList.at(-1).texture = texture;
  }

  arrangeAllShip() {
    let tempList = [
      new Ship(5), //carrier
      new Ship(4), //battle ship
      new Ship(3), //destroyer
      new Ship(3), //submarine
      new Ship(2), //patrol
    ];

    let texture = [
      carrierShip,
      battleShip,
      destroyerShip,
      Submarine,
      patrolShip,
    ];

    while (tempList.length) {
      let currentShip = tempList.shift();
      this.autoPlaceShip(currentShip, texture.shift());
    }
  }
}

export class Bot extends Player {
  constructor(name, gameboard) {
    super(name, gameboard);
    this.botShip = [
      new Ship(5), //carrier
      new Ship(4), //battle ship
      new Ship(3), //destroyer
      new Ship(3), //submarine
      new Ship(2), //patrol
    ];
    this.adjacentDirection = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  }

  //fire adjacent location after hit a target
  adjacentSlot(playerBoard){

    //random fire location
    function shuffle(array){
      for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    // get adjacent location
    function adjacentFire(xPos, yPos, adjacentPos){
    return adjacentPos.map((item) => {
      return [item[0] + xPos, item[1] + yPos];
      }).filter((item) => {
      //check whether the position is out of board
      return (item[0] >= 0 && item[0] < playerBoard.row && 
          item[1] >= 0 && item[1] < playerBoard.column && 
          !this.getOpponentHitPos.has(item[0]*10+item[1]) &&
           playerBoard.board[item[0]][item[1]] !== 3);
      });
    }
    
    
    let adjacentPos = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    let adjacentShot = []; //four direction of center pos

    //shuffle array before fire
    shuffle(adjacentPos);

    //in case don't know ship is vertical or horizontal place
    let xPos = null, yPos = null;
    if(playerBoard.getOpponentHitPos.size === 0){
      xPos = Math.round(Math.random() * (playerBoard.row - 1));
      yPos = Math.round(Math.random() * (playerBoard.row - 1));
      let takeFn = adjacentFire.bind(playerBoard, xPos, yPos, adjacentPos);
      adjacentShot = takeFn();
    }
    else if(playerBoard.getOpponentHitPos.size < 2) 
    { 
      //get Bot data for adjacent
      [xPos, yPos] = playerBoard.queueAttackPos.shift();
      let takeFn = adjacentFire.bind(playerBoard, xPos, yPos, adjacentPos);
      adjacentShot = takeFn();
    }
    //after know second location can determine should fire vertical or horizontal
    else if(playerBoard.getOpponentHitPos.size >= 2) 
    {
      let iterator = playerBoard.getOpponentHitPos.values(); //like pointer
      let firstLocation = iterator.next().value; //take first location
      let secondLocation = iterator.next().value;
      //check ship is vertical or horizontal
      if(firstLocation[0] - secondLocation[0] === 0){
          //ship is placed horiontal location
          playerBoard.queueAttackPos = playerBoard.queueAttackPos.filter((value) => {
              return !playerBoard.getOpponentHitPos.has(value[0]*10 + value[1]) && value[0] - firstLocation[0] === 0;
          });
      }
      else if(firstLocation[1] - secondLocation[1] === 0){
          //ship is placed vertical location
          playerBoard.queueAttackPos = playerBoard.queueAttackPos.filter((value) => {
              return !playerBoard.getOpponentHitPos.has(value[0]*10 + value[1]) && value[1] - firstLocation[1] === 0;
          });
      }
      
      if(playerBoard.queueAttackPos.length === 0) return [xPos, yPos];
      [xPos, yPos] = playerBoard.queueAttackPos.shift();
      let takeFn = adjacentFire.bind(playerBoard, xPos, yPos, adjacentPos);
      adjacentShot = takeFn();
    }

    if(playerBoard.board[xPos][yPos] === 1){
      playerBoard.queueAttackPos.push(...adjacentShot);
      playerBoard.getOpponentHitPos.set(xPos*10+yPos, [xPos, yPos]);
    }

    return [xPos, yPos];
  }
}
