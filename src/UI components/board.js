const createBoard = (player) => {
  const container = document.querySelector(".container");

  //board container
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("playerBoard");
  //grid container
  const grid = document.createElement("div");
  grid.classList.add("grid");
  //row number
  const rowNumber = document.createElement("div");
  rowNumber.classList.add("rowNumber");
  rowNumber.innerHTML += `<p style="width: 24px;"></p>`;

  container.appendChild(boardContainer);
  boardContainer.append(rowNumber, grid);

  //create board
  let board = player.gameboard.board;
  for (let i = 0; i < board.length; i++) {
    //number row index
    const row = document.createElement("div");
    row.classList.add("row_board");

    //column alphabet
    const alphabetText = document.createElement("p");
    alphabetText.textContent = String.fromCodePoint(65 + i);
    row.appendChild(alphabetText);
    for (let j = 0; j < board[i].length; j++) {
      if (!i) {
        rowNumber.innerHTML += `<p>${j}</p>`;
      }
      const box = document.createElement("div");
      box.classList.add("box");
      box.setAttribute("X", i);
      box.setAttribute("Y", j);
      row.appendChild(box);
    }
    grid.appendChild(row);
  }
};

export { createBoard };
