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
        let dx = Number(e.currentTarget.getAttribute("x"));
        let dy = Number(e.currentTarget.getAttribute("y"));
        bot.gameboard.receiveAttack(dx, dy);
        console.log("player fire: ");
        renderShip.call({ x: dx, y: dy }, bot, false);
        hasClicked = !hasClicked;
        turn = "Bot";
        setTimeout(() => {
          let xRan = Math.round(Math.random() * (player.gameboard.row - 1));
          let yRan = Math.round(Math.random() * (player.gameboard.row - 1));
          player.gameboard.receiveAttack(xRan, yRan);
          console.log("bot fire: ");
          renderShip.call({ x: xRan, y: yRan }, player, false);
          hasClicked = !hasClicked;
          turn = "Player";
        }, 1000);
      }
    });
  });
};
