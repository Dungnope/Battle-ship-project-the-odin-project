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
        console.log(player);
        hasClicked = !hasClicked;
        turn = "Bot";
        setTimeout(() => {
          console.log(bot);
          hasClicked = !hasClicked;
          turn = "Player";
        }, 1000);
      }
    });
  });
};
