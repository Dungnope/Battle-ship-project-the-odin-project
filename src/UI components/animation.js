export const shipAppeal = (texture, placePosition, shipSize, axis) => {
  const wrapperBox = document.createElement("div");
  const drawBox = document.createElement("div");
  let oneGridWidth = placePosition.getBoundingClientRect().width;
  let oneGridHeight = placePosition.getBoundingClientRect().height;
  const shipTexture = document.createElement("img");
  shipTexture.src = texture;
  shipTexture.classList.add("texture");

  wrapperBox.append(drawBox);

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

  placePosition.innerHTML = wrapperBox.innerHTML;

  window.addEventListener("resize", (e) => {
    oneGridWidth = placePosition.getBoundingClientRect().width;
    drawBox.style.width = `${oneGridWidth * shipSize + 8 * (shipSize - 1)}px`;
    drawBox.style.height = `${(drawBox.style.width * 66) / 133}px`;
  });
};
