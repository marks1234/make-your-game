import GameBoard from "./gameBoard.js";
import * as boardSettings from "./boardSettings.js";

console.log("updated");

const boardHeight = boardSettings.BOARDHEIGHT;
const boardWidth = boardSettings.BOARDWIDTH;
const boardBackgroundColor = boardSettings.BOARDBACKGROUNDCOLOR;

const gameBoard = document.getElementById("gameboard");
/** @type {Map<number, Map<number, HTMLDivElement>>} */
const gameMap = new Map();
for (let y = 0; y <= boardHeight + 2; y++) {
  const xWrapper = document.createElement("div");
  xWrapper.id = y;
  gameMap.set(y, new Map());
  for (let x = 0; x <= boardWidth; x++) {
    const node = document.createElement("div");
    node.id = x;
    node.className = "box";
    node.style.backgroundColor = "white";
    xWrapper.appendChild(node);
    gameMap.get(y).set(x, node);
  }
  if (y == 0 || y == 1) xWrapper.style.display = "none";
  gameBoard.appendChild(xWrapper);
}

document.addEventListener("DOMContentLoaded", () => {
  var gameBoard = new GameBoard(
    gameMap,
    boardHeight,
    boardWidth,
    boardBackgroundColor
  );
  const letters = ["O", "T", "I", "L", "J", "S", "Z"];

  gameBoard.pieceDraw("S");

  // Initially place a "T" piece
  gameBoard.pieceDraw(gameBoard.getRandomPiece());
  let multiplier = 1;
  let delay = 750 * multiplier;
  let animationId = 0;
  let timeoutId = 0;
  const callbackLoop = () => {
    if (!gameBoard.freeSpaceDown()) {
      gameBoard.piecePlace();
    }

    gameBoard.pieceMoveDown();

    if (!gameBoard.gameEnd) {
      animationId = requestAnimationFrame(animate);
    } else cancelAnimationFrame(animationId);
  };
  const animate = (timeStamp) => {
    const linesClearedHtml = document.getElementById("clears");
    const levelHtml = document.getElementById("levels");

    linesClearedHtml.innerText = `${gameBoard.linesCleared}`;
    levelHtml.innerText = `${gameBoard.level}`;
    timeoutId = setTimeout(callbackLoop, delay - levelDelay);
  };

  let count = 0;
  // Event listener for keyboard events
  // document.addEventListener("keyup", (event) => {
  //   if (event.code === "ArrowDown") {
  //     event.preventDefault();
  //     multiplier = 1;
  //   }
  // });
  document.addEventListener("keydown", (event) => {
    if (event.key === "q") {
      event.preventDefault();
      gameBoard.pieceRotateLeft();
    }
    if (event.key === "w") {
      event.preventDefault();
      gameBoard.pieceRotateRight();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!gameBoard.freeSpaceDown()) {
        gameBoard.piecePlace();
      }
      if (animationId == 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callbackLoop, delay);
      }
      gameBoard.pieceMoveDown();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      gameBoard.pieceMoveLeft();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      gameBoard.pieceMoveRight();
    }
    if (event.key === "r") {
      count++;
      if (count > letters.length - 1) count = 0;
      event.preventDefault();
      gameBoard.pieceReplace(letters[count]);
    }
    if (event.key === "f") {
      count--;
      if (count < 0) count = letters.length - 1;
      event.preventDefault();
      gameBoard.pieceReplace(letters[count]);
    }
  });
});
