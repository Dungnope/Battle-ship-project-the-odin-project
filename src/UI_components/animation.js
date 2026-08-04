import smExplosive from "../assets/hit_animations/small_explosive.svg";
import splashWaterTexture from "../assets/hit_animations/water_splash.svg";
import fireSound from "../assets/audio/fire_sound.ogg";
import explosiveSound from "../assets/audio/explosive.ogg";
import waterSplashSound from "../assets/audio/water_splash.ogg";

export const shipAppeal = (texture, placePosition, shipSize, axis) => {
  const drawBox = document.createElement("div");
  let oneGridWidth = placePosition.getBoundingClientRect().width;
  let oneGridHeight = placePosition.getBoundingClientRect().height;
  const shipTexture = document.createElement("img");
  shipTexture.src = texture;
  shipTexture.draggable = true;
  shipTexture.classList.add("texture");
  
  drawBox.append(shipTexture);
  drawBox.classList.add("drawing");
  drawBox.draggable = true;
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

  //play explosive sound
  const newAudio = document.createElement("audio");
  newAudio.src = explosiveSound;
  newAudio.volume = 0.4;
  boxPosition.append(newAudio);
  newAudio.play();

  newAudio.addEventListener("ended", () => {
    boxPosition.removeChild(newAudio);
    return new Promise(resolve => resolve());
  });


  await smallExplosionTexture.animate(explosionAnimation, timeAnimation).finished;
  boxPosition.removeChild(smallExplosionTexture); //after that disappear

  //after explosive create an small fire
  const damageTexture = document.createElement("img");
  damageTexture.src = texture;
  damageTexture.classList.add("texture__damage");
  boxPosition.append(damageTexture);
};

//fire sound and effect
export const fireEffect = (boxPosition) => {
  return new Promise((resolve) => {
    const fireAudio = document.createElement("audio");
    fireAudio.classList.add("fire__audio");
    fireAudio.volume = 0.4;
    fireAudio.src = fireSound;
    boxPosition.append(fireAudio);
    fireAudio.play();
    fireAudio.addEventListener("ended", () => {
      boxPosition.removeChild(fireAudio);
      resolve();
    });
  });
};

//water splash sound and effect
export const waterSplashEffect = async (texture, boxPosition) => {
  //hit create an small explosion
  const waterSplashTexture = document.createElement("img");
  waterSplashTexture.src = splashWaterTexture;
  waterSplashTexture.classList.add("texture__water");

  const waterShowAnimation = [
    { opacity: 1, easing: "ease-out"},
    { opacity: 0.5, easing: "ease-in"},
    { opacity: 0, easing: "ease-out"},
  ];

  const timeAnimation = {
    duration: 600,
    iterations: 1,
  };

  //create animation explosion
  boxPosition.append(waterSplashTexture);

  //play explosive sound
  const newAudio = document.createElement("audio");
  newAudio.src = waterSplashSound;
  newAudio.volume = 0.3;
  boxPosition.append(newAudio);
  newAudio.play();

  newAudio.addEventListener("ended", () => {
    boxPosition.removeChild(newAudio);
  });

  await waterSplashTexture.animate(waterShowAnimation, timeAnimation).finished.then(
    () => {
      boxPosition.removeChild(waterSplashTexture); //after that disappear
      return new Promise((resolve) => resolve());
    }
  );
};