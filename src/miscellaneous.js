import { renderShip } from "./UI_components/board.js";

export const botHackerWinner =  function(player){
    let result = [];
    console.log(player.gameboard);
    for(let i = 0; i < player.gameboard.board.length; i++){
        for(let j = 0; j < player.gameboard.board[i].length; j++){
            if(player.gameboard.board[i][j] === 1){
                result.push([i, j]);
            }
        }
    }
    return result;
};