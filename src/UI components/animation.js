import carrierShip from "../assets/carrier.svg";

export const shipAppeal = (placePosition, x, y, shipSize) => {
  const wrapperBox = document.createElement("div");
  const drawBox = document.createElement("div");
  let oneGridWidth = placePosition.getBoundingClientRect().width;
  const shipTexture = document.createElement("img");
  shipTexture.src = carrierShip;
  shipTexture.classList.add("texture");

  wrapperBox.append(drawBox);

  drawBox.append(shipTexture);
  drawBox.classList.add("drawing");
  drawBox.style.width = `${oneGridWidth * shipSize + 8 * (shipSize - 1)}px`;
  drawBox.style.height = `${(drawBox.style.width * 66) / 133}px`;
  drawBox.style.top = `50%`;
  drawBox.style.transform = `translateY(-50%)`;
  placePosition.innerHTML = wrapperBox.innerHTML;

  window.addEventListener("resize", (e) => {
    oneGridWidth = placePosition.getBoundingClientRect().width;
    drawBox.style.width = `${oneGridWidth * shipSize + 8 * (shipSize - 1)}px`;
    drawBox.style.height = `${(drawBox.style.width * 66) / 133}px`;
  });
};
