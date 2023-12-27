console.log("updated");

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

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

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
    /** @type {Object<number, Array<number>} */
    this.piece = {};
  }

  boardClear() {
    this.board.forEach((row) => {
      row.forEach((element) => {
        element.style.backgroundColor = "#d3d3d3";
      });
    });
  }

  pieceRotateRight() {
    console.log(this.piece);
  }

  clearSquare(x, y) {
    this.board.get(parseInt(y)).get(parseInt(x)).style.backgroundColor =
      "#d3d3d3";
  }
  pieceClear() {
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        this.clearSquare(x, y);
      }
  }

  pieceMoveDown() {
    if (!isEmpty(this.piece)) {
      this.pieceClear();
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece))
        pieceStore[parseInt(y) + 1] = value;

      this.piece = pieceStore;
      this.piecePlace();
    } else {
      try {
        throw Error("Can't move an empty piece!");
      } catch (err) {
        console.error(err);
      }
    }
  }

  pieceMoveLeft() {
    if (!isEmpty(this.piece)) {
      this.pieceClear();
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece)) {
        const newValue = [];
        for (let x of value) newValue.push(parseInt(x) - 1);
        pieceStore[parseInt(y)] = newValue;
      }

      this.piece = pieceStore;
      this.piecePlace();
    } else {
      try {
        throw Error("Can't move an empty piece!");
      } catch (err) {
        console.error(err);
      }
    }
  }
  pieceMoveRight() {
    if (!isEmpty(this.piece)) {
      this.pieceClear();
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece)) {
        const newValue = [];
        for (let x of value) newValue.push(parseInt(x) + 1);
        pieceStore[parseInt(y)] = newValue;
      }

      this.piece = pieceStore;
      this.piecePlace();
    } else {
      try {
        throw Error("Can't move an empty piece!");
      } catch (err) {
        console.error(err);
      }
    }
  }
  pieceDelete() {
    this.pieceClear();
    this.piece = {};
  }
  piecePlace(nameOfPiece) {
    if (isEmpty(this.piece)) {
      const pieceLocations = this.#plottedPieces[nameOfPiece];
      this.piece = pieceLocations;
    }

    for (const [y, value] of Object.entries(this.piece)) {
      for (let x of value) {
        this.board.get(parseInt(y)).get(parseInt(x)).style.backgroundColor =
          "black";
      }
    }
  }
}

const boardController = new GameBoard(gameMap);

boardController.piecePlace("T");
// boardController.pieceDelete();
boardController.pieceMoveDown();
boardController.pieceMoveLeft();
boardController.pieceMoveLeft();
// boardController.pieceRotateRight();

const letters = ["T", "I", "L", "J", "S", "Z"];
console.log(letters);
letters.forEach((key, index) => {
  setTimeout(() => {
    // boardController.boardClear();
    // boardController.paintPiece(key);
    boardController.pieceMoveDown();
  }, 1000 * (index + 1)); // Delay increases with each iteration
});
