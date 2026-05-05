import { renderShip } from "./board.js";

export const botPlayGame = (player, bot) => {
  let turn = player.constructor.name;
  let hasClicked = false;
  const playerBoard = document.getElementById(`${player.id}`);
  const botBoard = document.getElementById(`${bot.id}`);

  const botField = botBoard.querySelectorAll(".wrapper__grid .box");

  // play turn by turn
  botField.forEach((box) => {
    box.addEventListener("click", (e) => {
      if (turn === "Player" && !hasClicked) {
        //attack bot
        let x = Number(e.currentTarget.getAttribute("x"));
        let y = Number(e.currentTarget.getAttribute("y"));
        bot.gameboard.receiveAttack(x, y);
        console.log("player fire: ");
        renderShip(bot, false);
        hasClicked = !hasClicked;
        turn = "Bot";
        setTimeout(() => {
          let xRan = Math.round(Math.random() * player.gameboard.row);
          let yRan = Math.round(Math.random() * player.gameboard.row);
          player.gameboard.receiveAttack(xRan, yRan);
          console.log("bot fire: ");
          renderShip(player, false);
          hasClicked = !hasClicked;
          turn = "Player";
        }, 1000);
      }
    });
  });
};
