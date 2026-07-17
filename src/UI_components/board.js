import { Gameboard } from "../models/gameboard.js";
import { Bot } from "../models/player.js";
import { Ship } from "../models/ship.js";
import { fireEffect, getHit, shipAppeal } from "./animation.js";
import fireHit from "../assets/hit_animations/fire_ship.svg";
import {
  Carrier,
  Battleship,
  Destroyer,
  Submarine,
  Patrol,
  Content,
  missShot,
  playBtnStyle,
} from "./assets.js";
import { singlePlay } from "./gameplay.js";

const createBoard = (player, boardColor, withShipList) => {
  const container = document.querySelector(".container");

  //board container
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board");
  // create boardsize base on number of squares
  const boxSize = 40;
  const gap = 8;
  const characterSize = 24;
  const numberBox = player.gameboard.column;
  const layout = 68;
  const maxWidth =
    boxSize * numberBox + characterSize + gap * numberBox + layout;

  boardContainer.style.width = `min(100%, ${maxWidth}px)`;

  //wrapper board
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper__grid");
  wrapper.style.backgroundColor = boardColor;

  const playerID = `#${player.nameTag}`;
  boardContainer.setAttribute("name", playerID);
  if (player.id === undefined || player.id === null) {
    boardContainer.id = `#tar_${Math.abs(crypto.getRandomValues(new Int16Array(1)))}`;
    player.id = boardContainer.id;
  } else {
    boardContainer.id = player.id;
  }

  //show player info
  const showName = document.createElement("p");
  showName.innerHTML = `<span>(${player.id})</span> ${player.nameTag}'s board`;
  showName.classList.add("name__display");

  //grid container
  const grid = document.createElement("div");
  grid.classList.add("grid");

  //row number
  const rowNumber = document.createElement("div");
  rowNumber.classList.add("rowNumber");

  container.appendChild(boardContainer);
  wrapper.append(rowNumber, grid);

  if (withShipList) {
    boardContainer.append(
      showName,
      wrapper,
      boardGuide.call({ player: player }, boardColor),
    );
  } else {
    boardContainer.append(showName, wrapper);
  }

  //create board
  let board = player.gameboard.board;
  for (let i = 0; i < board.length; i++) {
    //number row index
    const row = document.createElement("div");
    row.classList.add("row_board");

    //column alphabet
    const alphabetText = document.createElement("p");
    alphabetText.textContent = String.fromCodePoint(65 + i);
    alphabetText.style.position = "absolute";
    alphabetText.style.left = "-24px";
    row.appendChild(alphabetText);
    for (let j = 0; j < board[i].length; j++) {
      if (!i) {
        rowNumber.innerHTML += `<p>${j}</p>`;
      }
      const box = document.createElement("div");
      box.style.flex = `1 1 40px`;
      box.classList.add("box");
      box.setAttribute("X", i);
      box.setAttribute("Y", j);
      row.appendChild(box);
    }
    grid.append(row);
  }
};

const boardData = (player) => {
  const playerBoard = document.getElementById(`${player.id}`);
  const boxes = playerBoard.querySelectorAll(".grid .box");
  const shipGuide = playerBoard.querySelector(".guide__ship");
  const shipList = shipGuide.querySelectorAll("li");

  return {
    board: playerBoard,
    boxes: boxes,
    shipguide: shipGuide,
    shiplist: shipList,
  };
};

const autoPlaceShip = (player) => {
  clearAllShip(player);
  player.arrangeAllShip();

  boardData(player).shiplist.forEach((ship) => {
    ship.classList.add("had__placed");
  });
  renderShip.call({ autoPlace: true }, player);

  singlePlay.apply({
    player: player,
    bot: new Bot("Bot1", new Gameboard(10, 10)),
  });
};

const clearAllShip = (player) => {
  boardData(player).boxes.forEach((box) => {
    box.innerHTML = "";
    box.classList.remove("ship__shadow");
  });

  //delete all ship from board
  player.gameboard.shipList.forEach((ship) => {
    ship.coordinate.forEach((coor) => {
      player.gameboard.board[coor.x][coor.y] = 0;
    });
  });
  player.gameboard.shipList = [];

  boardData(player).shiplist.forEach((ship) => {
    ship.classList.remove("had__placed", "selected__ship");
  });

  //check whether the battle button show or not to remove it
  if (!isAllPlace(player)) {
    let shipguide = boardData(player).shipguide.lastElementChild;
    if (shipguide.classList.contains("battle__btn")) {
      boardData(player).shipguide.removeChild(shipguide);
    }
  }
};

const boardGuide = function (color) {
  //ship guide box
  const guideShip = document.createElement("div");
  guideShip.classList.add("guide__ship");

  //ship guide description
  const guideTag = document.createElement("span");
  guideTag.classList.add("guide__tag");
  //add content
  guideTag.textContent = "Ships Guide";
  guideTag.style.backgroundColor = color;

  const paragraphContent = document.createElement("p");
  paragraphContent.textContent = Content;

  const shipList = document.createElement("ul");
  shipList.classList.add("shipList");

  //add clear and autoplace function button
  const functionBox = document.createElement("div");
  functionBox.classList.add("function__btn--box");

  const autoPlaceBtn = document.createElement("button");
  autoPlaceBtn.classList.add("function__btn--autoplace");
  autoPlaceBtn.textContent = "Auto place";
  autoPlaceBtn.style.backgroundColor = color;

  autoPlaceBtn.addEventListener("click", (e) => {
    autoPlaceShip(this.player);
    e.stopImmediatePropagation();
  });

  const clearBoardBtn = document.createElement("button");
  clearBoardBtn.classList.add("function__btn--clear");
  clearBoardBtn.textContent = "Clear All";
  clearBoardBtn.setAttribute(
    "style",
    `border: 1px solid ${color}; outline: 1px solid ${color};color: ${color};`,
  );
  clearBoardBtn.addEventListener("mouseover", function (e) {
    e.currentTarget.style.backgroundColor = color;
    e.currentTarget.style.color = "var(--background)";
  });
  clearBoardBtn.addEventListener("mouseout", function (e) {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = `${color}`;
  });
  clearBoardBtn.addEventListener("click", (e) => {
    clearAllShip(this.player);
    e.stopImmediatePropagation();
  });

  const warnSign = document.createElement("span");
  warnSign.classList.add("warn__sign");
  warnSign.textContent = "Right click to change axis";

  functionBox.append(autoPlaceBtn, clearBoardBtn);

  //add margin bottom for shiplist
  const bottomMargin = document.createElement("div");
  bottomMargin.classList.add("bottom__margin");

  //add 5 ships to ship list
  shipList.innerHTML = `
    ${Battleship}
    ${Carrier}
    ${Destroyer}
    ${Submarine}
    ${Patrol}
  `;

  //add guideTag, description, list on guide box
  guideShip.append(
    guideTag,
    paragraphContent,
    shipList,
    functionBox,
    warnSign,
    bottomMargin,
  );

  return guideShip;
};

const selectedShip = (player) => {
  let ans;
  boardData(player).shiplist.forEach((ship) => {
    if (ship.classList.contains("selected__ship")) {
      ans = ship;
    }
  });
  return ans;
};

const takeShipFromList = (eventTarget, eventType, player, axis) => {
  //take board from ship list
  let takenShip = selectedShip(player);
  try {
    let realShipFragment = takenShip.children[1];
    let shipLength = Number(realShipFragment.getAttribute("length"));
    let getXBoard = Number(eventTarget.getAttribute("x"));
    let getYBoard = Number(eventTarget.getAttribute("y"));
    //show hover color on grid
    shipHover(
      shipLength,
      boardData(player).boxes,
      { x: getXBoard, y: getYBoard },
      eventType,
      player.gameboard,
      axis,
    );
  } catch (error) {
    // console.warn("Not ship selected");
  }
};

//hover with mark the ship size
const shipHover = (shipLength, boxes, currentPos, status, gameboard, axis) => {
  let pathTracker = []; //tracker by condition
  for (let i = 0; i < shipLength; i++) {
    //check valid horizontal
    if (currentPos.y + i < gameboard.column && axis === "horizontal") {
      pathTracker.push({
        x: currentPos.x * gameboard.column,
        y: currentPos.y + i,
      });
      //check valid vertical
    } else if (currentPos.x + i < gameboard.row && axis === "vertical") {
      pathTracker.push({
        x: (currentPos.x + i) * gameboard.row,
        y: currentPos.y,
      });
    }
  }

  let pathLength = pathTracker.length;
  while (pathTracker.length) {
    let currentPos = pathTracker.shift();
    const position = currentPos.x + currentPos.y;
    if (pathLength === shipLength && status === "mouseover") {
      boxes[position].style.backgroundColor = "var(--valid)";
    } else if (pathLength < shipLength) {
      boxes[position].style.backgroundColor = "var(--target)";
    }

    //mouse out or change axis will remove old axis hover color
    if (
      status === "mouseout" ||
      status === "contextmenu" ||
      status === "click"
    ) {
      boxes[position].style.removeProperty("background-color");
    }
  }
};

const placeShipOnBoard = (playerBoard, boxTarget, axis) => {
  let takenShip = selectedShip(playerBoard);
  try {
    if (takenShip.classList.contains("selected__ship")) {
      const x = Number(boxTarget.currentTarget.getAttribute("x"));
      const y = Number(boxTarget.currentTarget.getAttribute("y"));
      const shipLength = Number(takenShip.children[1].getAttribute("length")); //take from ship structure
      let currentBoard = playerBoard.gameboard;
      //place ship on board
      if (currentBoard.placeShip(new Ship(shipLength), x, y, axis)) {
        //get texture and render them
        let getTextureSrc = takenShip.querySelector("img").src;
        let currentShip = playerBoard.gameboard.shipList.at(-1);
        currentShip.texture = getTextureSrc;
        renderShip.call(
          {
            ship: currentShip,
            autoPlace: false,
          },
          playerBoard,
        );
      }
    }
  } catch (error) {
    console.warn(error);
  }
};

function renderShip(playerBoard, isPrepare = true) {
  //prepare for place ship step, not in play
  const board = document.getElementById(`${playerBoard.id}`);
  const grid = board.querySelector(`.wrapper__grid`);
  //take ship coordinate;

  if (isPrepare && !this.autoPlace) {
    const shipCoordinate = this.ship.coordinate; //use call for take ship parameter
    //take DOM element have more than 1 attribute
    for (let i = 0; i < shipCoordinate.length; i++) {
      const placeCoordinate = grid.querySelector(
        `[x="${shipCoordinate[i].x}"][y="${shipCoordinate[i].y}"]`,
      );

      if (
        this.ship.axis === "horizontal" &&
        placeCoordinate.innerHTML === "" &&
        i === 0
      ) {
        //place head and tail ship
        shipAppeal(
          this.ship.texture,
          placeCoordinate,
          shipCoordinate.length,
          this.ship.axis,
        );
      } else if (
        this.ship.axis === "vertical" &&
        placeCoordinate.innerHTML === "" &&
        i === 0
      ) {
        shipAppeal(
          this.ship.texture,
          placeCoordinate,
          shipCoordinate.length,
          this.ship.axis,
        );
      }
      placeCoordinate.style.removeProperty("background-color");
    }
    // if (i === shipCoordinate.length - 1)
    //   placeCoordinate.innerHTML = shipTail;
    // else if (placeCoordinate.innerHTML === "")
    //   placeCoordinate.innerHTML = shipFragment;

    //just show interactive of choosen ship in prepare step, render at play game step is not allow use this
    // if (this !== undefined && this !== null && this.join__game) {
    const clickedShip = selectedShip(playerBoard);
    clickedShip.classList.remove("selected__ship");
    clickedShip.classList.add("had__placed");
    // }
  } else if (this.autoPlace) {
    const allShipOnBoard = playerBoard.gameboard.shipList;
    allShipOnBoard.forEach((ship) => {
      const shipCoordinate = ship.coordinate;
      for (let i = 0; i < shipCoordinate.length; i++) {
        //take DOM element have more than 1 attribute
        const placeCoordinate = grid.querySelector(
          `[x="${shipCoordinate[i].x}"][y="${shipCoordinate[i].y}"]`,
        );
        
        if (
          ship.axis === "horizontal" &&
          placeCoordinate.innerHTML === "" &&
          i === 0
        ) {
          //place head and tail ship
          shipAppeal(
            ship.texture,
            placeCoordinate,
            shipCoordinate.length,
            ship.axis,
          );
        } else if (
          ship.axis === "vertical" &&
          placeCoordinate.innerHTML === "" &&
          i === 0
        ) {
          shipAppeal(
            ship.texture,
            placeCoordinate,
            shipCoordinate.length,
            ship.axis,
          );
        }
      }
    });
  } else {
    // in game battle, use call() from user input to take x, y position
    const boxStatus = grid.querySelector(`[x="${this.x}"][y="${this.y}"]`);
    const positionStated = playerBoard.gameboard.board[this.x][this.y];
    //use fire effect for hit target
    if (positionStated === 2) {
        fireEffect(boxStatus).then(() => getHit(fireHit, boxStatus));
    } else if (positionStated === 3) {
      fireEffect(boxStatus).then(() => boxStatus.innerHTML = missShot); //show water pop effect
    }
  }
}

const chooseShip = (player) => {
  try {
    const boardProperty = boardData(player);
    const ships = boardProperty.shiplist;
    ships.forEach((ship) => {
      ship.classList.remove("selected__ship");
      ship.addEventListener("click", (e) => {
        ships.forEach((ship) => {
          if (!e.currentTarget.classList.contains("selected__ship")) {
            ship.classList.remove("selected__ship");
          }
        });
        if (!e.currentTarget.classList.contains("had__placed")) {
          e.currentTarget.classList.toggle("selected__ship");
        }
        e.stopPropagation();
      });
    });
  } catch {
    console.log("this is game play not choose ship");
  }
};

const isAllPlace = (playerBoard) => {
  //check all ships placed or not
  for (let i = 0; i < boardData(playerBoard).shiplist.length; i++) {
    if (!boardData(playerBoard).shiplist[i].classList.contains("had__placed")) {
      return false;
    }
  }

  //if all ships placed
  return true;
};

export const createPlayBtn = (color) => {
  let shipGuide = document.querySelector(".guide__ship");
  //ready to battle and check it appeared or not
  if (!shipGuide.lastElementChild.classList.contains("battle__btn")) {
    let playBtn = document.createElement("button");
    playBtn.classList.add("battle__btn");
    playBtn.style.backgroundColor = color;
    playBtn.innerHTML += playBtnStyle;
    shipGuide.appendChild(playBtn);
  }
};

const interactWithBoard = (playerBoard) => {
  let axis = ["vertical", "horizontal"];
  let current = 1;

  try {
    //prevent right click on board
    boardData(playerBoard).board.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    boardData(playerBoard).boxes.forEach((box) => {
      //to place ship
      box.addEventListener("click", (e) => {
        placeShipOnBoard(playerBoard, e, current);

        //check all ship placed or not
        if (isAllPlace(playerBoard)) {
          singlePlay.apply({
            player: playerBoard,
            bot: new Bot("Bot1", new Gameboard(10, 10)),
          });
        }
      });

      //hover to see ship location
      box.addEventListener("mouseover", (e) => {
        takeShipFromList(e.currentTarget, e.type, playerBoard, axis[current]);
      });

      //hover out a box made them become default state
      box.addEventListener("mouseout", (e) => {
        takeShipFromList(e.currentTarget, e.type, playerBoard, axis[current]);
      });

      //right click for change axis
      box.addEventListener("contextmenu", (e) => {
        takeShipFromList(e.currentTarget, e.type, playerBoard, axis[current]);
        if (!current) {
          current = 1;
        } else {
          current = 0;
        }
        e.preventDefault();
      });

      //redraw mouseover immediately after change axis
      box.addEventListener("contextmenu", (e) => {
        takeShipFromList(
          e.currentTarget,
          "mouseover",
          playerBoard,
          axis[current],
        );
      });
    });
  } catch {
    console.log("play game");
  }
};

export {
  createBoard,
  interactWithBoard,
  chooseShip,
  isAllPlace,
  boardData,
  renderShip,
};
