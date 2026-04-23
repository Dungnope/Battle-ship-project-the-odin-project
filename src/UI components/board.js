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

export const chooseShip = (player) => {
  const playerBoard = document.getElementById(`${player.id}`);
  const shipGuide = playerBoard.querySelector(".guide__ship .shipList");
  let ships = shipGuide.querySelectorAll("li");
  ships.forEach((ship) => {
    ship.classList.remove("selected__ship");
    ship.addEventListener("click", (e) => {
      ships.forEach((ship) => {
        if (!e.currentTarget.classList.contains("selected__ship")) {
          ship.classList.remove("selected__ship");
        }
      });
      e.currentTarget.classList.toggle("selected__ship");
      e.stopPropagation();
    });
  });
};

const takeShipFromList = (eventTarget, eventType, shipList, boxes, board) => {
  //take board from ship list
  let chosenShip;
  shipList.forEach((ship) => {
    if (ship.classList.contains("selected__ship")) {
      chosenShip = ship;
    }
  });
  try {
    let realShipFragment = chosenShip.children[1];
    let shipLength = realShipFragment.children.length;
    let getXBoard = Number(eventTarget.getAttribute("x"));
    let getYBoard = Number(eventTarget.getAttribute("y"));
    shipHover(
      shipLength,
      boxes,
      { x: getXBoard, y: getYBoard },
      eventType,
      board,
    );
  } catch (error) {
    // console.warn(error);
  }
};

//hover with mark the ship size
const shipHover = (length, boxes, currentPos, status, board) => {
  for (let i = 0; i < length; i++) {
    //check valid horizontal
    let nextPos = currentPos.x * 10 + (currentPos.y + i);
    if (status === "mouseover" && boxes[nextPos] !== undefined) {
      boxes[nextPos].style.backgroundColor = "var(--valid)";
    } else if (status === "mouseout" && boxes[nextPos] !== undefined) {
      boxes[nextPos].style.removeProperty("background-color");
    }
  }
};

const interactWithBoard = (playerBoard) => {
  let controlBoard = document.getElementById(playerBoard.id);
  let boxes = controlBoard.querySelectorAll(".grid .box");
  const shipList = controlBoard.querySelectorAll(".guide__ship .shipList li");

  boxes.forEach((box) => {
    box.addEventListener("click", (e) => {});

    box.addEventListener("mouseover", (e) => {
      takeShipFromList(
        e.currentTarget,
        e.type,
        shipList,
        boxes,
        playerBoard.gameboard,
      );
    });

    box.addEventListener("mouseout", (e) => {
      takeShipFromList(
        e.currentTarget,
        e.type,
        shipList,
        boxes,
        playerBoard.gameboard,
      );
    });
  });
};

export { createBoard, interactWithBoard };
