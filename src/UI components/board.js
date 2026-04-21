import {
  Carrier,
  Battleship,
  Destroyer,
  Submarine,
  Patrol,
  Content,
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

  console.log(maxWidth);
  boardContainer.style.width = `min:`;

  const playerID = `#${player.nameTag}`;
  boardContainer.setAttribute("name", playerID);
  //grid container
  const grid = document.createElement("div");
  grid.classList.add("grid");
  //row number
  const rowNumber = document.createElement("div");
  rowNumber.classList.add("rowNumber");
  rowNumber.innerHTML += `<p style="width: 24px;"></p>`;

  container.appendChild(boardContainer);
  boardContainer.append(rowNumber, grid, boardGuide());

  //create board
  let board = player.gameboard.board;
  for (let i = 0; i < board.length; i++) {
    //number row index
    const row = document.createElement("div");
    row.classList.add("row_board");

    //column alphabet
    const alphabetText = document.createElement("p");
    alphabetText.textContent = String.fromCodePoint(65 + i);
    row.appendChild(alphabetText);
    for (let j = 0; j < board[i].length; j++) {
      if (!i) {
        rowNumber.innerHTML += `<p>${j}</p>`;
      }
      const box = document.createElement("div");
      box.classList.add("box");
      box.setAttribute("X", i);
      box.setAttribute("Y", j);
      row.appendChild(box);
    }
    grid.appendChild(row);
  }
  window.addEventListener("load", () => {
    const takeABox = document.querySelector(".box");
    const allBoxes = document.querySelectorAll(".board .box");
    console.log(takeABox.offsetWidth);
    allBoxes.forEach((box) => {
      box.style.height = `${takeABox.offsetWidth}px`;
      let relativeUnit = (takeABox.offsetWidth * gap) / boxSize;
      box.style.borderRadius = `${relativeUnit}px`;
    });
  });
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

const interactBoard = (playerBoard) => {
  let missShot = `
  <div class = "dot"></div>
`;

  let correctShot = `
<svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30"  
fill="#000000" viewBox="2 2 20 20"  
transform="rotate(270)">
<!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="m7.76 14.83-2.83 2.83 1.41 1.41 2.83-2.83 2.12-2.12.71-.71.71.71 1.41 1.42 3.54 3.53 1.41-1.41-3.53-3.54-1.42-1.41-.71-.71 5.66-5.66-1.41-1.41L12 10.59 6.34 4.93 4.93 6.34 10.59 12l-.71.71z"></path>
</svg>
`;

  let playerNameTag = `#${playerBoard.nameTag}`;
  let controlBoard = document.querySelector(`div[name="${playerNameTag}"]`);
  controlBoard.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("box") &&
      e.target.getAttribute("x") == "2" &&
      e.target.getAttribute("y") == "4" &&
      e.target.innerHTML === ""
    ) {
      e.target.innerHTML += correctShot;
      e.target.classList.add("cross");
    }
    if (e.target.classList.contains("box") && e.target.innerHTML === "") {
      e.target.innerHTML += missShot;
    }
  });
};

export { createBoard, interactBoard };
