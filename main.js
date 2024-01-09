import GameBoard from "./gameBoard.js";
import * as boardSettings from "./boardSettings.js";
import {
  startTimer,
  stopTimer,
  ELAPSEDTIME,
  pauseTime,
  unPauseTime,
} from "./timer.js";

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

  // Initially place a "T" piece
  gameBoard.pieceDraw(gameBoard.getRandomPiece());

  let keysPressed = {
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    q: false,
    w: false,
  };

  let multiplier = 1;
  let delay = 750 * multiplier;
  let animationId = 0;
  let timeoutId = 0;
  const animate = (timeStamp) => {
    timeoutId = setTimeout(callbackLoop, delay);
  };

  const callbackLoop = () => {
    const linesClearedHtml = document.getElementById("clears");
    const levelHtml = document.getElementById("levels");

    linesClearedHtml.innerText = `${gameBoard.linesCleared}`;
    levelHtml.innerText = `${gameBoard.level}`;
    if (!gameBoard.freeSpaceDown()) {
      gameBoard.piecePlace();
    }
    gameBoard.pieceMoveDown();
    if (!gameBoard.gameEnd) {
      animationId = requestAnimationFrame(animate);
    } else {
      stopTimer();
      cancelAnimationFrame(animationId);
    }
  };

  function handleVisibilityChange() {
    if (!gameBoard.gameStart) {
      console.log("returned");
      console.log("!gameBoard.gameStart", !gameBoard.gameStart);
      return;
    }
    console.log("didn't return");
    if (document.hidden) {
      pauseTime();
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);
      animationId = 0;
    } else {
      // Page is visible, resume animations
      unPauseTime();
      animationId = requestAnimationFrame(animate);
    }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);

  let count = 0;
  document.addEventListener("keydown", (event) => {
    if (!gameBoard.gameEnd) {
      if (event.key === "q") {
        event.preventDefault();
        keysPressed["q"] = true;
        gameBoard.pieceRotateLeft();
      }
      if (event.key === "w") {
        event.preventDefault();
        keysPressed["w"] = true;
        gameBoard.pieceRotateRight();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();

        if (!gameBoard.freeSpaceDown()) {
          gameBoard.piecePlace();
        }
        if (animationId == 0) {
          startTimer();
          gameBoard.gameStart = true;
          gameBoard.gameEnd = false;
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
      if (event.key === " ") {
        if (animationId == 0) {
          return;
        }
        event.preventDefault();
        gameBoard.pieceDrop();
        gameBoard.pieceMoveDown();
      }
      // CODE TO ENTER GOD MODE AND CHOOSE WHATEVER PIECE YOU WANT
      // const letters = ["O", "T", "I", "L", "J", "S", "Z"];
      if (event.key === "r") {
        pauseTime();
        // count++;
        // if (count > letters.length - 1) count = 0;
        // event.preventDefault();
        // gameBoard.pieceReplace(letters[count]);
      }
      if (event.key === "f") {
        unPauseTime();
        // count--;
        // if (count < 0) count = letters.length - 1;
        // event.preventDefault();
        // gameBoard.pieceReplace(letters[count]);
      }
    }
  });
});
