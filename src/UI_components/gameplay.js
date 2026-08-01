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
    //delete old player
    localStorage.clear();
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

export const playerSetup = function(playerName, mode = null){
  if(mode === "bot" || mode === null || mode === "undefined"){
    document.querySelector(".container").innerHTML = "";
  }
  
  if (playerName === "" || playerName === " ") {
    playerName = `Guest${Math.abs(crypto.getRandomValues(new Int8Array(1)))}`;
  }

  let newPlayer = new Player(playerName, new Gameboard(10, 10));
  const colors = [
    "#58B8F8", // Blue
    "#63D47C", // Green
    "#FFD84D", // Yellow
    "#FFA640", // Orange
    "#FF6F61", // Red
    "#9B7CF6", // Purple
    "#FF7EB6", // Pink
    "#3FD5C8", // Cyan
    "#C9A86A", // Brown
    "#CFCFCF", // Gray
  ];

  let randomColor = colors[Math.floor(Math.random() * (colors.length))];
  createBoard(newPlayer, randomColor, true);
  chooseShip(newPlayer);
  this.setupList.push(newPlayer);
  interactWithBoard.call({interactList: this.setupList}, newPlayer, mode);
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
          setTimeout(() => {updateShipOnGame(bot);}, 1000);
          
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

export const versusPlayGame = (player1, player2) => {
  const colorBoard1 = boardData(player1).board.querySelector(
    ".wrapper__grid",
  ).style.backgroundColor;

  const colorBoard2 = boardData(player2).board.querySelector(
    ".wrapper__grid",
  ).style.backgroundColor;

  //reset all element on screen
  document.querySelector(".container").innerHTML = "";
  createBoard(player1, colorBoard1, false);
  createBoard(player2, colorBoard2, false);

  const player1Board = document.getElementById(`${player1.id}`);
  const player2Board = document.getElementById(`${player2.id}`);
  const boxesPlayer1 = player1Board.querySelectorAll(".wrapper__grid .box");
  const boxesPlayer2 = player2Board.querySelectorAll(".wrapper__grid .box");
  let turn = player1.id;
  player1Board.querySelector(".wrapper__grid").style.outline = "8px solid var(--target)";
  //let player1 fire first
  boxesPlayer1.forEach((box, idx) => {
    box.addEventListener("click", (e) => {
      if(turn === player2.id){
        let dx = Number(e.currentTarget.getAttribute("x"));
        let dy = Number(e.currentTarget.getAttribute("y"));
        console.log("player2 fire");
        player1.gameboard.receiveAttack(dx, dy);
        renderShip.call({ x: dx, y: dy }, player1, false);

        //show bot ship in case a ship sunk
        setTimeout(() => {updateShipOnGame(player1);}, 1000);

        if (checkWinner(player1, player2)) {
          //add time before show end game
          setTimeout(() =>{showEndGame(player1, player2);}, 2000);
        } else {
          player1Board.querySelector(".wrapper__grid").style.outline = "8px solid var(--target)";
          player2Board.querySelector(".wrapper__grid").style.removeProperty("outline");
          turn = player1.id;
        }
      }
    });
  });

  boxesPlayer2.forEach((box, idx) => {
    box.addEventListener("click", (e) => {
      if(turn === player1.id){
        let dx = Number(e.currentTarget.getAttribute("x"));
        let dy = Number(e.currentTarget.getAttribute("y"));
        console.log("player1 fire");
        player2.gameboard.receiveAttack(dx, dy);
        renderShip.call({ x: dx, y: dy }, player2, false);

        //show bot ship in case a ship sunk
        setTimeout(() => {updateShipOnGame(player2);}, 1000);

        if (checkWinner(player1, player2)) {
          //add time before show end game
          setTimeout(() =>{showEndGame(player1, player2);}, 2000);
        } else {
          player2Board.querySelector(".wrapper__grid").style.outline = "8px solid var(--target)";
          player1Board.querySelector(".wrapper__grid").style.removeProperty("outline");
          turn = player2.id;
        }
      }
    });
  });
};

export const singlePlay = function (player, mode = "bot") { //default is play with bot
  //show play button and click to navigation to game
  const colorBoard = boardData(player).board.querySelector(
    ".wrapper__grid",
  ).style.backgroundColor;

  //add button for go to battle
  createPlayBtn(player, colorBoard);
  //play with bot
  if(mode === "bot" || mode === null || mode === "undefined"){
    boardData(player)
    .shipguide.querySelector(".battle__btn")
    .addEventListener("click", (e) => {
      e.stopImmediatePropagation();
        document.querySelector(".container").innerHTML = "";
        document.querySelector(".container").removeAttribute("style");
        createBoard(player, colorBoard, false);
        renderShip.call({ autoPlace: true }, player);

        //make an bot board
        let botIdx = Math.abs(crypto.getRandomValues(new Int8Array(1)));
        let bot = new Bot(`Bot${botIdx}`, new Gameboard(10, 10));
        bot.arrangeAllShip();
        createBoard(bot, "var(--opponent-background)", false);
        //renderShip.call({ autoPlace: true }, this.bot); //make ship on board not show
        botPlayGame(player, bot);
    });
  }
  else if(mode === "2player"){ //two player versus
    let allBoard = document.querySelectorAll(".board"); //take all board on web
    boardData(player)
    .shipguide.querySelector(".battle__btn")
    .addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      //logic for sequence hide board
      if(allBoard[1].style.display === "none"){
        allBoard[1].style.removeProperty("display");
      }
      boardData(player).board.style.display = "none";
      // both ship are placed
      if(allBoard[0].style.display === "none" && allBoard[1].style.display === "none"){
        if(this.singleplayList.length >= 2){
          versusPlayGame(this.singleplayList[0], this.singleplayList[1]);
        }
      }

    });
  }
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
    document.querySelector(".main").style.display = "block";
    //reset name input when refresh page
    document.querySelector(".user__name--input").value = "";
    let playerName = document.querySelector(".user__name--input");
    document.querySelector("#enter__battle").addEventListener("click", (e) => {
      playerSetup(playerName.value, "bot");
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
      document.querySelector(".container").innerHTML = "";
      //place ship for two player
      let twoPlayer = [];
        playerSetup.call({setupList: twoPlayer},player1Name.value, "2player");
        playerSetup.call({setupList: twoPlayer},player2Name.value, "2player");
        let allBoard = document.querySelectorAll(".board");
        allBoard[1].style.display = "none";
    });
  };
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
