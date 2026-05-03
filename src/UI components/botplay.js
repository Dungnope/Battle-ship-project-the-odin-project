export const botPlayGame = (player, bot) => {
  let turn = player.constructor.name;

  const playerBoard = document.getElementById(`${player.id}`);
  const botBoard = document.getElementById(`${bot.id}`);
  console.log(playerBoard, botBoard);
};
