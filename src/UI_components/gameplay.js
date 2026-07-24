import { Bot, Player } from "../models/player.js";
import { Gameboard } from "../models/gameboard.js";
import {
  chooseShip,
  createBoard,
  createPlayBtn,
  interactWithBoard,
  renderShip,
  boardData,
} from "./board.js";


import backgroundImg from "../assets/battle_ship_background.webp";
import beachBackgroundImg from "../assets/beach_background.webp";
import {shipAppeal } from "./animation.js";

//main menu of game
export const gameMenu = () => {
  let background = document.querySelector("body");
  background.style.backgroundImage = `url(${backgroundImg})`;
  let mainMenu = `
    <button id="single__player">Singleplayer</button>
    <button id="multi__player">Multiplayer</button>
    <button id="setting__game">Setting</button>
  `;
  document.querySelector(".container").setHTMLUnsafe(mainMenu);
  const singlePlayerBtn = document.getElementById("single__player");
  const multiPlayerBtn = document.getElementById("multi__player");
  const settingBtn = document.getElementById("setting__game");

  //show singleplay UI
  singlePlayerBtn.addEventListener("click", (e) => {
    console.log("play singleplayer");
    let background = document.querySelector("body");
    background.style.backgroundImage = `url(${beachBackgroundImg})`;
    mainForSinglePlayer(); //for one player with bot
  });

  //show multiplayer UI
  multiPlayerBtn.addEventListener("click", (e) => {
    console.log("play multiplayer");    
  });

  //show setting UI
  settingBtn.addEventListener("click", (e) => {
    console.log("setting");
  });
};

export const mainForSinglePlayer = () => {
  let selectMode = `
    <button id="bot__player" title="player vs bot">👥 VS 🤖</button>
    <button id="two__player" title="player vs player">👥 VS 👥</button>
  `;
  document.querySelector(".container").innerHTML = "";
  document.querySelector(".container").setHTMLUnsafe(selectMode);
  const botPlayerBtn = document.querySelector("#bot__player");
  const versusPlayerBtn = document.querySelector("#two__player");

  botPlayerBtn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    console.log("bot mode");
    botMode();
  });

  versusPlayerBtn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    console.log("vs one device mode");
    versusMode();
  });

  //for play with bot
  const botMode = function(){
    let fieldName = `
      <div class="main">
        <h1 class="header__menu neon__title-hollow">Battle Ship</h1>
        <input type="text" class="user__name--input" placeholder="Your name...">
        <button id="enter__battle">Enter</button>
      </div>
  `;
    document.querySelector(".container").setHTMLUnsafe(fieldName);
    //reset name input when refresh page
    document.querySelector(".user__name--input").value = "";
    let playerName = document.querySelector(".user__name--input");
    document.querySelector("#enter__battle").addEventListener("click", (e) => {
      playerSetup(playerName.value);
    });
  };

  //for 2 player mode
  const versusMode = function(){
    let fieldName = `
      <div class="main">
        <h1 class="header__menu neon__title-hollow">Battle Ship</h1>
        <div>
          <label for="player1">Player1</lable>      
          <input type="text" class="user__name--input p1__name" id="player1" placeholder="Your name...">
        </div>

        <div>
          <label for="player2">Player2</lable>
          <input type="text" class="user__name--input p2__name" id="player2" placeholder="Your name...">
        </div>
        <button id="enter__battle">Enter</button>
      </div>
    `;

    document.querySelector(".container").setHTMLUnsafe(fieldName);
    //reset name input when refresh page
    document.querySelector(".user__name--input.p1__name").value = "";
    document.querySelector(".user__name--input.p2__name").value = "";
    let player1Name = document.querySelector(".user__name--input.p1__name");
    let player2Name = document.querySelector(".user__name--input.p2__name");
    document.querySelector("#enter__battle").addEventListener("click", (e) => {
      //place ship for two player
      console.log(player1Name.value, player2Name.value);
      playerSetup();
    });
  };
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

export const fastPlayGameBot = () => {
  let player1 = new Player("Parker", new Gameboard(10, 10));
  let bot = new Bot("Bot1", new Gameboard(10, 10));
  player1.arrangeAllShip();
  bot.arrangeAllShip();
  createBoard(player1, "var(--target)", false);
  createBoard(bot, "aqua", false);
  renderShip.call({ autoPlace: true }, player1, true);
  //renderShip.call({ autoPlace: true }, bot); //to show or hide ship
  botPlayGame(player1, bot);
};

export const fastPlayGameLocal = () => {
  let player1 = new Player("Player1", new Gameboard(10, 10));
  let player2 = new Bot("Player2", new Gameboard(10, 10));
  player1.arrangeAllShip();
  player2.arrangeAllShip();
  createBoard(player1, "var(--target)", false);
  createBoard(player2, "aqua", false);
  renderShip.call({ autoPlace: true }, player1, true);
  renderShip.call({ autoPlace: true }, player2, true); //to show or hide ship
};

export const botPlayGame = (player, bot) => {
  let turn = player.constructor.name;
  let hasClicked = false;
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

          //show bot ship in case a ship sunk
          setTimeout(() => {updateShipOnGame(bot)}, 1000);
          
          if (checkWinner(player, bot)) {
            //add time before show end game
            setTimeout(() =>{showEndGame(player, bot);}, 2000);
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
                //add time before show end game
                setTimeout(() =>{showEndGame(player, bot);}, 2000);
              } else {
                //add more time before can continue fire
                setTimeout(() => {
                  turn = "Player";
                }, 1500);
                hasClicked = !hasClicked;
                clickNumber++;
              }
            }, 1500);
        }
      }
    });
  });
};

export const updateShipOnGame = function (playerboard){
  if(playerboard.gameboard.sunkShip.length !== 0){
    const board = document.getElementById(`${playerboard.id}`);
    const grid = board.querySelector(`.wrapper__grid`);
    let sunkShipInfo = {
      texture: playerboard.gameboard.sunkShip[0].texture,
      shipSize: playerboard.gameboard.sunkShip[0].length,
      axis: playerboard.gameboard.sunkShip[0].axis,
      //take first coordinate of first ship on sunkShip list
      coordinate: playerboard.gameboard.sunkShip[0].coordinate[0],
    };
    let placeCoordinate = grid.querySelector(
    `[x="${sunkShipInfo.coordinate.x}"][y="${sunkShipInfo.coordinate.y}"]`);
    shipAppeal(sunkShipInfo.texture, placeCoordinate, sunkShipInfo.shipSize, sunkShipInfo.axis);
    playerboard.gameboard.sunkShip.pop();
  }
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
      document.querySelector(".container").removeAttribute("style");
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
  let hiddenBlur = document.createElement("button");
  playAgain.textContent = "Play again";
  playAgain.classList.add("play__again");
  hiddenBlur.textContent = "Lose reveal: off";
  hiddenBlur.classList.add("hidden__blur");

  winInfo = { name: entity1.nameTag, id: entity1.id, status: "Winner" };
  loseInfo = { name: entity2.nameTag, id: entity2.id, status: "Loser" };
  blur__screenWin = `
    <div class = "end__screen blur__screen">
      <p>${winInfo.name}(${winInfo.id})</p>
      <p style="color: ${entity1Color}">${winInfo.status}</p>
    </div>
  `;

  blur__screenLose = `
    <div class = "end__screen blur__screen">
      <p>${loseInfo.name}(${loseInfo.id})</p>
      <p style="color: ${entity2Color}">${loseInfo.status}</p>
    </div>
  `;

  playAgain.addEventListener("click", (e) => {
    playerSetup(entity1.nameTag);
  });

  hiddenBlur.addEventListener("click", (e) => {
    let takeBlurScreen = e.currentTarget.parentNode.querySelector(".end__screen");
    takeBlurScreen.classList.toggle("blur__screen");
    if(!takeBlurScreen.classList.contains("blur__screen")){
      hiddenBlur.textContent = "Lose reveal: on";
      takeBlurScreen.style.opacity = 0.2;
    }
    else {
      hiddenBlur.textContent = "Lose reveal: off";
      takeBlurScreen.style.removeProperty("opacity");
    }
  });

  setTimeout(() => {
    document.querySelector(".container").append(playAgain);
    entity1Board.innerHTML += blur__screenWin;
    entity2Board.innerHTML += blur__screenLose;
    entity2Board.append(hiddenBlur);

  }, 1500);
};
