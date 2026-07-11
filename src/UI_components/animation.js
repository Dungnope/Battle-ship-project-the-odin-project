import smExplosive from "../assets/hit_animations/small_explosive.svg";
export const shipAppeal = (texture, placePosition, shipSize, axis) => {
  const drawBox = document.createElement("div");
  let oneGridWidth = placePosition.getBoundingClientRect().width;
  let oneGridHeight = placePosition.getBoundingClientRect().height;
  const shipTexture = document.createElement("img");
  shipTexture.src = texture;
  shipTexture.classList.add("texture");


  drawBox.append(shipTexture);
  drawBox.classList.add("drawing");
  drawBox.style.width = `${oneGridWidth * shipSize + 8 * (shipSize - 1)}px`;
  drawBox.style.height = `${(drawBox.style.width * 66) / 133}px`;

  if (axis === "horizontal") {
    drawBox.style.top = `50%`;
    drawBox.style.left = `0`;
    drawBox.style.transform = `translateY(-50%)`;
    drawBox.style.zIndex = 1;
    drawBox.style.height = `${(drawBox.style.width * 66) / 133}px`;
  } else if (axis === "vertical") {
    let newHeight = `${oneGridHeight * shipSize + 8 * (shipSize - 1)}px`;
    drawBox.style.height = `${(newHeight * 66) / 133}px`;
    drawBox.style.left = `50%`;
    drawBox.style.top = `-50%`;
    drawBox.style.transform = `translate(-50%, 50%) rotate(90deg)`;
    drawBox.style.zIndex = 1;
  }

  placePosition.append(drawBox);

  window.addEventListener("resize", () => {
    oneGridWidth = placePosition.getBoundingClientRect().width;
    drawBox.style.width = `${oneGridWidth * shipSize + 8 * (shipSize - 1)}px`;
    drawBox.style.height = `${(drawBox.style.width * 66) / 133}px`;
  });
};

//add small explosion when hit the boat
export const getHit = async (texture, boxPosition) => {
  //hit create an small explosion
  const smallExplosionTexture = document.createElement("img");
  smallExplosionTexture.src = smExplosive;
  smallExplosionTexture.classList.add("texture__explosion");

  const explosionAnimation = [
    { width: '100%' },
    { width: '160%' }
  ];

  const timeAnimation = {
    duration: 200,
    iterations: 1,
  };

  //create animation explosion
  boxPosition.append(smallExplosionTexture);

  await smallExplosionTexture.animate(explosionAnimation, timeAnimation).finished;
  boxPosition.removeChild(smallExplosionTexture); //after that disappear

  //after explosive create an small fire
  const damageTexture = document.createElement("img");
  damageTexture.src = texture;
  damageTexture.classList.add("texture__damage");
  boxPosition.append(damageTexture);
};