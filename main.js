let box = document.getElementById("animateBox");
let pos = 0;
console.log("updates");

const gameBoard = document.getElementById("gameboard");
/** @type {Map<number, Map<number, HTMLDivElement>>} */
const gameMap = new Map();
for (y = 0; y < 20; y++) {
  const xWrapper = document.createElement("div");
  xWrapper.id = y;
  gameMap.set(y, new Map());
  for (x = 0; x < 10; x++) {
    const node = document.createElement("div");
    node.id = x;
    node.className = "box";
    xWrapper.appendChild(node);
    gameMap.get(y).set(x, node);
  }
  gameBoard.appendChild(xWrapper);
}

function flipMap(originalMap) {
  const flippedMap = new Map();

  originalMap.forEach((innerMap, y) => {
    innerMap.forEach((value, x) => {
      if (!flippedMap.has(x)) {
        flippedMap.set(x, new Map());
      }
      flippedMap.get(x).set(y, value);
    });
  });

  return flippedMap;
}

// Usage
const flippedGameMap = flipMap;

class GameBoard {
  #plottedPieces = {
    T: { 0: [4], 1: [3, 4, 5] },
    I: { 1: [3, 4, 5, 6] },
    L: { 0: [5], 1: [3, 4, 5] },
    J: { 0: [3], 1: [3, 4, 5] },
    S: { 0: [4, 5], 1: [3, 4] },
    Z: { 0: [3, 4], 1: [4, 5] },
  };
  constructor(board) {
    /** @type {Map<number, Map<number, HTMLDivElement>>} */
    this.board = board;
    this.piece;
  }

  boardClear() {
    this.board.forEach((row) => {
      row.forEach((element) => {
        element.style.backgroundColor = "#d3d3d3";
      });
    });
  }
  paintPiece(nameOfPiece) {
    const pieceLocations = this.#plottedPieces[nameOfPiece];
    for (const [y, value] of Object.entries(pieceLocations)) {
      for (let x of value) {
        this.board.get(parseInt(y)).get(parseInt(x)).style.backgroundColor =
          "black";
      }
    }
  }
}

const boardController = new GameBoard(gameMap);

boardController.paintPiece("T");

// const letters = ["T", "I", "L", "J", "S", "Z"];
// letters.forEach((key, index) => {
//   setTimeout(() => {
//     boardController.boardClear();
//     boardController.paintPiece(key);
//   }, 1000 * (index + 1)); // Delay increases with each iteration
// });
