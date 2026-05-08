import {
  createBoard,
  chooseShip,
  interactWithBoard,
  renderShip,
} from "./board.js";

export const playerSetup = (player) => {
  createBoard(player, "var(--attention)", true);
  chooseShip(player);
  interactWithBoard(player);
};

export const botPlayGame = (player, bot) => {
  let turn = player.constructor.name;
  let hasClicked = false;
  const playerBoard = document.getElementById(`${player.id}`);
  const botBoard = document.getElementById(`${bot.id}`);

  const botField = botBoard.querySelectorAll(".wrapper__grid .box");
  let clickNumber = 0;
  // play turn by turn
  botField.forEach((box) => {
    box.addEventListener("click", (e) => {
      if (turn === "Player" && !hasClicked && !player.isWinner) {
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
          checkWinner(player, bot);
          hasClicked = !hasClicked;
          turn = "Bot";
          setTimeout(() => {
            let xRan = Math.round(Math.random() * (player.gameboard.row - 1));
            let yRan = Math.round(Math.random() * (player.gameboard.row - 1));
            //check position has used or not
            while (
              player.gameboard.board[xRan][yRan] === 2 ||
              player.gameboard.board[xRan][yRan] === 3
            ) {
              xRan = Math.round(Math.random() * (player.gameboard.row - 1));
              yRan = Math.round(Math.random() * (player.gameboard.row - 1));
            }
            player.gameboard.receiveAttack(xRan, yRan);
            renderShip.call({ x: xRan, y: yRan }, player, false);
            checkWinner(player, bot);
            hasClicked = !hasClicked;
            turn = "Player";
            clickNumber++;
          }, 500);
        }
      }
    });
  });
};

const checkWinner = (player1, player2) => {
  //check whether all ship collapsed or not
  if (!player1.isWinner && !player2.isWinner) {
    if (player1.gameboard.isAllCollapse()) player2.isWinner = true;
    if (player2.gameboard.isAllCollapse()) player1.isWinner = true;

    if (player1.isWinner)
      console.log(`${player1.nameTag}(${player1.id}) win the game`);
    if (player2.isWinner)
      console.log(`${player2.nameTag}(${player2.id}) win the game`);
  }
};
