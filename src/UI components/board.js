import { Gameboard } from "../gameboard.js";
import { Bot } from "../player.js";
import { Ship } from "../ship.js";
import {
  Carrier,
  Battleship,
  Destroyer,
  Submarine,
  Patrol,
  Content,
  missShot,
  correctShot,
  shipHead,
  shipFragment,
  shipTail,
  playBtn,
} from "./assets.js";
import { botPlayGame } from "./botplay.js";

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
  boardContainer.id = `#tar_${Math.abs(crypto.getRandomValues(new Int16Array(1)))}`;
  player.id = boardContainer.id;

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
    boardContainer.append(showName, wrapper, boardGuide());
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
      box.style.flex = `1 1 ${board.length}%`;
      box.classList.add("box");
      box.setAttribute("X", i);
      box.setAttribute("Y", j);
      row.appendChild(box);
    }
    grid.appendChild(row);
  }
};

const boardData = (player) => {
  const playerBoard = document.getElementById(`${player.id}`);
  const boxes = playerBoard.querySelectorAll(".grid .box");
  const shipGuide = playerBoard.querySelector(".guide__ship .shipList");
  const shipList = shipGuide.querySelectorAll("li");

  return {
    board: playerBoard,
    boxes: boxes,
    shipguide: shipGuide,
    shiplist: shipList,
  };
};

const boardGuide = () => {
  //ship guide box
  const guideShip = document.createElement("div");
  guideShip.classList.add("guide__ship");

  //ship guide description
  const guideTag = document.createElement("span");
  guideTag.classList.add("guide__tag");
  //add content
  guideTag.textContent = "Ships Guide";

  const paragraphContent = document.createElement("p");
  paragraphContent.textContent = Content;

  const shipList = document.createElement("ul");
  shipList.classList.add("shipList");

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
  guideShip.append(guideTag, paragraphContent, shipList, bottomMargin);

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
    let shipLength = realShipFragment.children.length;
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
      const shipLength = takenShip.children[1].children.length; //take from ship structure
      let currentBoard = playerBoard.gameboard;
      //place ship on board
      if (currentBoard.placeShip(new Ship(shipLength), x, y, axis)) {
        let lastIdx = currentBoard.shipList.length - 1;
        showShipOnBoard(currentBoard.shipList.at(lastIdx), playerBoard);
      }
    }
  } catch {
    console.warn("Not choose ship");
  }
};

const showShipOnBoard = (ship, playerBoard) => {
  const boxList = boardData(playerBoard).board;
  const clickedShip = selectedShip(playerBoard);
  //take ship coordinate;
  const shipCoordinate = ship.coordinate;
  for (let i = 0; i < shipCoordinate.length; i++) {
    //take DOM element have more than 1 attribute
    const placeCoordinate = boxList.querySelector(
      `[x="${shipCoordinate[i].x}"][y="${shipCoordinate[i].y}"]`,
    );

    //place head and tail ship
    if (i === 0) placeCoordinate.innerHTML += shipHead;
    else if (i === shipCoordinate.length - 1)
      placeCoordinate.innerHTML += shipTail;
    else placeCoordinate.innerHTML += shipFragment;

    if (ship.axis === "vertical") {
      placeCoordinate.firstElementChild.classList.add("rotate__ship");
    }

    placeCoordinate.style.removeProperty("background-color");
  }

  clickedShip.classList.remove("selected__ship");
  clickedShip.classList.add("had__placed");
};

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

function renderShip(playerBoard, isPrepare = true) {
  //prepare for place ship step, not in play
  const board = document.getElementById(`${playerBoard.id}`);
  const grid = board.querySelector(`.wrapper__grid`);
  //take ship coordinate;

  if (isPrepare) {
    const allShipOnBoard = playerBoard.gameboard.shipList;
    allShipOnBoard.forEach((ship) => {
      const shipCoordinate = ship.coordinate;
      for (let i = 0; i < shipCoordinate.length; i++) {
        //take DOM element have more than 1 attribute
        const placeCoordinate = grid.querySelector(
          `[x="${shipCoordinate[i].x}"][y="${shipCoordinate[i].y}"]`,
        );

        //place head and tail ship
        if (i === 0) placeCoordinate.innerHTML = shipHead;
        else if (i === shipCoordinate.length - 1)
          placeCoordinate.innerHTML = shipTail;
        else placeCoordinate.innerHTML = shipFragment;

        if (ship.axis === "vertical") {
          placeCoordinate.firstElementChild.classList.add("rotate__ship");
        }
      }
    });
  } else {
    // in game battle, use call() from user input to take x, y position
    const boxStatus = grid.querySelector(`[x="${this.x}"][y="${this.y}"]`);
    const positionStated = playerBoard.gameboard.board[this.x][this.y];
    console.log(boxStatus, positionStated);
    if (positionStated === 2) {
      boxStatus.innerHTML = "2";
    } else if (positionStated === 3) {
      boxStatus.innerHTML = "3";
    } else if (boxStatus === null) {
      debugger;
    }
  }
}

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
          //ready to battle
          boardData(playerBoard).shipguide.innerHTML += playBtn;
          const colorBoard =
            boardData(playerBoard).board.querySelector(".wrapper__grid").style
              .backgroundColor;
          //play with bot
          boardData(playerBoard)
            .shipguide.querySelector(".battle__btn")
            .addEventListener("click", (e) => {
              document.querySelector(".container").innerHTML = "";
              createBoard(playerBoard, colorBoard, false);
              renderShip(playerBoard);
              let bot = new Bot("Bot", new Gameboard(10, 10));
              bot.arrangeAllShip();
              createBoard(bot, "var(--opponent-background)", false);
              renderShip(bot);
              botPlayGame(playerBoard, bot);
            });
        }
        e.stopImmediatePropagation();
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
