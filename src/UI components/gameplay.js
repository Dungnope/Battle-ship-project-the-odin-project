import { Bot, Player } from "../player.js";
import { Gameboard } from "../gameboard.js";
import {
  chooseShip,
  createBoard,
  createPlayBtn,
  interactWithBoard,
  renderShip,
  boardData,
} from "./board.js";

import backgroundImg from "../assets/battle_ship_background.webp";

export const main = () => {
  let mainMenu = `
    <div class="main">
      <h1 class="header__menu neon__title-hollow">Battle Ship</h1>
      <input type="text" class="user__name--input" placeholder="Your name...">
      <button id="enter__battle">Enter</button>
    </div>
  `;
  document.querySelector(".container").setHTMLUnsafe(mainMenu);
  //refert name input when refresh page
  document.querySelector(".user__name--input").value = "";
  let background = document.querySelector("body");
  background.style.backgroundImage = `url(${backgroundImg})`;
  let playerName = document.querySelector(".user__name--input");
  document.querySelector("#enter__battle").addEventListener("click", (e) => {
    background.removeAttribute("style");
    playerSetup(playerName.value);
  });
};

export const playerSetup = (playerName) => {
  document.querySelector(".container").innerHTML = "";
  if (playerName === "" || playerName === " ") {
    playerName = `Guest${Math.abs(crypto.getRandomValues(new Int8Array(1)))}`;
  }
  let newPlayer = new Player(playerName, new Gameboard(10, 10));
  createBoard(newPlayer, "var(--valid)", true);
  chooseShip(newPlayer);
  interactWithBoard(newPlayer);
};

export const fastPlayGame = () => {
  let player1 = new Player("Parker", new Gameboard(10, 10));
  let bot = new Bot("Bot1", new Gameboard(10, 10));
  player1.arrangeAllShip();
  bot.arrangeAllShip();
  createBoard(player1, "var(--target)", false);
  createBoard(bot, "orange", false);
  renderShip.call({ autoPlace: true }, player1);
  renderShip.call({ autoPlace: true }, bot);
  botPlayGame(player1, bot);
};

export const botPlayGame = (player, bot) => {
  let turn = player.constructor.name;
  let hasClicked = false;
  const playerBoard = document.getElementById(`${player.id}`);
  const botBoard = document.getElementById(`${bot.id}`);

  const botField = botBoard.querySelectorAll(".wrapper__grid .box");
  let clickNumber = 0; //avoid stackoverflow when can not find any position
  // play turn by turn
  botField.forEach((box) => {
    box.addEventListener("click", (e) => {
      //only clickable if not winner and right turn
      if (
        turn === "Player" &&
        !hasClicked &&
        !player.isWinner &&
        !bot.isWinner
      ) {
        //attack bot
        let dx = Number(e.currentTarget.getAttribute("x"));
        let dy = Number(e.currentTarget.getAttribute("y"));
        //check whether player click on pure stated position or not
        if (
          bot.gameboard.board[dx][dy] === 0 ||
          bot.gameboard.board[dx][dy] === 1
        ) {
          bot.gameboard.receiveAttack(dx, dy);
          renderShip.call({ x: dx, y: dy }, bot, false);
          if (checkWinner(player, bot)) {
            showEndGame(player, bot);
          } else {
            hasClicked = !hasClicked;
            turn = "Bot";
          }

          if (!player.isWinner && !bot.isWinner && turn === "Bot")
            setTimeout(() => {
              let xRan = Math.round(Math.random() * (player.gameboard.row - 1));
              let yRan = Math.round(Math.random() * (player.gameboard.row - 1));
              //check position has used or not
              while (
                clickNumber < 100 && //use this to avoid fatal stackoverflow in the last game
                (player.gameboard.board[xRan][yRan] === 2 ||
                  player.gameboard.board[xRan][yRan] === 3)
              ) {
                xRan = Math.round(Math.random() * (player.gameboard.row - 1));
                yRan = Math.round(Math.random() * (player.gameboard.row - 1));
              }
              player.gameboard.receiveAttack(xRan, yRan);
              renderShip.call({ x: xRan, y: yRan }, player, false);
              if (checkWinner(player, bot)) {
                showEndGame(bot, player);
              } else {
                hasClicked = !hasClicked;
                turn = "Player";
                clickNumber++;
              }
            }, 500);
        }
      }
    });
  });
};

export const singlePlay = function () {
  //show play button and click to navigation to game
  const colorBoard = boardData(this.player).board.querySelector(
    ".wrapper__grid",
  ).style.backgroundColor;
  createPlayBtn(colorBoard);
  //play with bot
  boardData(this.player)
    .shipguide.querySelector(".battle__btn")
    .addEventListener("click", (e) => {
      document.querySelector(".container").innerHTML = "";
      createBoard(this.player, colorBoard, false);
      renderShip.call({ autoPlace: true }, this.player);
      this.bot.arrangeAllShip();
      createBoard(this.bot, "var(--opponent-background)", false);
      //renderShip.call({ autoPlace: true }, this.bot); //make ship on board not show
      botPlayGame(this.player, this.bot);
    });
};

const checkWinner = (entity1, entity2) => {
  //check whether all ship collapsed or not
  if (!entity1.isWinner && !entity2.isWinner) {
    if (entity1.gameboard.isAllCollapse()) entity2.isWinner = true;
    if (entity2.gameboard.isAllCollapse()) entity1.isWinner = true;

    if (entity1.isWinner) return true;
    if (entity2.isWinner) return true;

    return false;
  }
};

const showEndGame = (entity1, entity2) => {
  const entity1Board = document.getElementById(`${entity1.id}`);
  const entity2Board = document.getElementById(`${entity2.id}`);

  const entity1Color =
    entity1Board.querySelector(".wrapper__grid").style.backgroundColor;
  const entity2Color =
    entity2Board.querySelector(".wrapper__grid").style.backgroundColor;
  let winInfo;
  let loseInfo;
  let blur__screenWin;
  let blur__screenLose;
  let playAgain = document.createElement("button");
  playAgain.textContent = "Play again";
  playAgain.classList.add("play__again");

  winInfo = { name: entity1.nameTag, id: entity1.id, status: "Winner" };
  loseInfo = { name: entity2.nameTag, id: entity2.id, status: "Loser" };
  blur__screenWin = `
    <div class = "blur__screen">
      <p>${winInfo.name}(${winInfo.id})</p>
      <p style="color: ${entity1Color}">${winInfo.status}</p>
    </div>;
  `;

  blur__screenLose = `
    <div class = "blur__screen">
      <p>${loseInfo.name}(${loseInfo.id})</p>
      <p style="color: ${entity2Color}">${loseInfo.status}</p>
    </div>;
  `;

  playAgain.addEventListener("click", (e) => {
    playerSetup(entity1.nameTag);
  });
  setTimeout(() => {
    document.querySelector(".container").appendChild(playAgain);
    entity1Board.innerHTML += blur__screenWin;
    entity2Board.innerHTML += blur__screenLose;
  }, 1000);
};
