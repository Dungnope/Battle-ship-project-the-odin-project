export const botPlayGame = (player, bot) => {
  let turn = player.constructor.name;
  let hasClicked = false;
  const playerBoard = document.getElementById(`${player.id}`);
  const botBoard = document.getElementById(`${bot.id}`);
  console.log(playerBoard, botBoard);

  const botField = botBoard.querySelectorAll(".wrapper__grid .box");
  botField.forEach((box) => {
    box.addEventListener("click", (e) => {
      if (turn === "Player" && !hasClicked) {
        console.log("you attack");
        hasClicked = !hasClicked;
        turn = "Bot";
      } else if (turn === "Bot" && hasClicked) {
        hasClicked = !hasClicked;
        setTimeout(() => {
          console.log("Bot attack");
          turn = "Player";
        }, 1000);
      }
    });
  });
};
