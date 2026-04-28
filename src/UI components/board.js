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
} from "./assets.js";

const createBoard = (player) => {
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

  const playerID = `#${player.nameTag}`;
  boardContainer.setAttribute("name", playerID);
  boardContainer.id = `#tar_${Math.abs(crypto.getRandomValues(new Int16Array(1)))}`;
  player.id = boardContainer.id;
  //grid container
  const grid = document.createElement("div");
  grid.classList.add("grid");
  //row number
  const rowNumber = document.createElement("div");
  rowNumber.classList.add("rowNumber");

  container.appendChild(boardContainer);
  wrapper.append(rowNumber, grid);
  boardContainer.append(wrapper, boardGuide());

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

export const chooseShip = (player) => {
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
    console.warn("Not ship selected");
    setTimeout(() => {
      console.clear();
    }, 1000);
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
    if (status === "mouseout" || status === "contextmenu") {
      boxes[position].style.removeProperty("background-color");
    }
  }
};

const showShipOnBoard = (shipList, playerBoard) => {
  const boxList = boardData(playerBoard).board;
  const clickedShip = selectedShip(playerBoard);
  console.log(clickedShip);
  shipList.forEach((ship) => {
    //take ship coordinate;
    const shipCoordinate = ship.coordinate;
    shipCoordinate.forEach((coor) => {
      //take DOM element have more than 1 attribute
      const placeCoordinate = boxList.querySelector(
        `[x="${coor.x}"][y="${coor.y}"]`,
      );
      placeCoordinate.classList.add("place");
    });
  });

  clickedShip.classList.remove("selected__ship");
  clickedShip.classList.add("had__placed");
};

const interactWithBoard = (playerBoard) => {
  let axis = ["vertical", "horizontal"];
  let current = 1;

  boardData(playerBoard).board.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  boardData(playerBoard).boxes.forEach((box) => {
    //to place ship
    box.addEventListener("click", (e) => {
      let takenShip = selectedShip(playerBoard);
      try {
        if (takenShip.classList.contains("selected__ship")) {
          const x = Number(e.currentTarget.getAttribute("x"));
          const y = Number(e.currentTarget.getAttribute("y"));
          const shipLength = takenShip.children[1].children.length; //take from ship structure
          let currentBoard = playerBoard.gameboard;
          currentBoard.placeShip(new Ship(shipLength), x, y, current);
          showShipOnBoard(currentBoard.shipList, playerBoard);
        }
      } catch {
        console.log("Not choose ship");
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
};

export { createBoard, interactWithBoard };
