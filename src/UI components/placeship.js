export const placeShip = (player) => {
  const playerBoard = document.getElementById(`${player.id}`);
  const grid = playerBoard.querySelector(".wrapper__grid .grid");
  const shipGuide = playerBoard.querySelectorAll(".guide__ship .shipList li");
  const boxes = grid.querySelectorAll(".box");
  chooseShip(shipGuide);
};

export const chooseShip = (ship__list) => {
  ship__list.forEach((ship) => {
    ship.removeAttribute("class");
    console.log(ship);
    ship.addEventListener("click", (e) => {
      console.log(ship);
      e.currentTarget.classList.toggle("selected__ship");
    });
  });
};
