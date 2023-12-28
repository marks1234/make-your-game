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
    O: { 0: [4, 5], 1: [4, 5] },
    T: { 0: [4], 1: [3, 4, 5] },
    I: { 1: [3, 4, 5, 6] },
    L: { 0: [5], 1: [3, 4, 5] },
    J: { 0: [3], 1: [3, 4, 5] },
    S: { 0: [4, 5], 1: [3, 4] },
    Z: { 0: [3, 4], 1: [4, 5] },
  };
  #colors = {
    O: "yellow",
    T: "#9d0d2f",
    I: "#3e0d1e",
    L: "b4204a",
    J: "#e87d87",
    S: "#FFD700",
    Z: "#eca59d",
  };

  #reverseRotationMatrix = {
    O: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    T: [
      [
        [1, 1],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [0, 0],
        [1, -1],
        [-1, -1],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [-1, -1],
      ],
      [
        [1, 1],
        [-1, 1],
        [0, 0],
        [-1, -1],
      ],
    ],
    I: [
      [
        [-1, 2],
        [0, 1],
        [1, 0],
        [2, -1],
      ],
      [
        [2, 1],
        [1, 0],
        [0, -1],
        [-1, -2],
      ],
      [
        [-2, 1],
        [-1, 0],
        [0, -1],
        [1, -2],
      ],
      [
        [1, 2],
        [0, 0],
        [-1, 1],
        [-2, -1],
      ],
    ],
    L: [
      [
        [2, 0],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [0, 0],
        [-1, -1],
        [0, -2],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [-2, 0],
      ],
      [
        [0, 2],
        [1, 1],
        [0, 0],
        [-1, -1],
      ],
    ],
    J: [
      [
        [0, 2],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [2, 0],
        [0, 0],
        [-1, -1],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [0, -2],
      ],
      [
        [1, 1],
        [0, 0],
        [-2, 0],
        [-1, -1],
      ],
    ],
    S: [
      [
        [1, 1],
        [2, 0],
        [-1, 1],
        [0, 0],
      ],
      [
        [1, 1],
        [0, 0],
        [1, -1],
        [0, -2],
      ],
      [
        [0, 0],
        [1, -1],
        [-2, 0],
        [-1, -1],
      ],
      [
        [0, 2],
        [-1, 1],
        [0, 0],
        [-1, -1],
      ],
    ],
    Z: [
      //1
      [
        [0, 2],
        [1, 1],
        [0, 0],
        [1, -1],
      ],
      //2
      [
        [2, 0],
        [0, 0],
        [1, -1],
        [-1, -1],
      ],
      //3
      [
        [-1, 1],
        [0, 0],
        [-1, -1],
        [0, -2],
      ],
      //4
      [
        [-1, 1],
        [-2, 0],
        [0, 0],
        [1, 1],
      ],
    ],
  };

  #rotationMatrix = {
    O: [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ],
    T: [
      [
        [1, 1],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [0, 0],
        [1, -1],
        [-1, -1],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [-1, -1],
      ],
      [
        [1, 1],
        [-1, 1],
        [0, 0],
        [-1, -1],
      ],
    ],
    I: [
      [
        [-1, 2],
        [0, 1],
        [1, 0],
        [2, -1],
      ],
      [
        [2, 1],
        [1, 0],
        [0, -1],
        [-1, -2],
      ],
      [
        [-2, 1],
        [-1, 0],
        [0, -1],
        [1, -2],
      ],
      [
        [1, 2],
        [0, 0],
        [-1, 1],
        [-2, -1],
      ],
    ],
    L: [
      [
        [2, 0],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [0, 0],
        [-1, -1],
        [0, -2],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [-2, 0],
      ],
      [
        [0, 2],
        [1, 1],
        [0, 0],
        [-1, -1],
      ],
    ],
    J: [
      [
        [0, 2],
        [-1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [1, 1],
        [2, 0],
        [0, 0],
        [-1, -1],
      ],
      [
        [-1, 1],
        [0, 0],
        [1, -1],
        [0, -2],
      ],
      [
        [1, 1],
        [0, 0],
        [-2, 0],
        [-1, -1],
      ],
    ],
    S: [
      [
        [1, 1],
        [2, 0],
        [-1, 1],
        [0, 0],
      ],
      [
        [1, 1],
        [0, 0],
        [1, -1],
        [0, -2],
      ],
      [
        [0, 0],
        [1, -1],
        [-2, 0],
        [-1, -1],
      ],
      [
        [0, 2],
        [-1, 1],
        [0, 0],
        [-1, -1],
      ],
    ],
    Z: [
      [
        [0, 2],
        [1, 1],
        [0, 0],
        [1, -1],
      ],
      [
        [2, 0],
        [0, 0],
        [1, -1],
        [-1, -1],
      ],
      [
        [-1, 1],
        [0, 0],
        [-1, -1],
        [0, -2],
      ],
      [
        [1, 1],
        [-1, 1],
        [0, 0],
        [-2, 0],
      ],
    ],
  };

  constructor(board) {
    /** @type {Map<number, Map<number, HTMLDivElement>>} */
    this.board = board;
    /** @type {Object<number, Array<number>} */
    this.piece = {};
    this.pieceType = "";
    this.pieceLastRotation = {};
    this.pieceRotation = 0;

    this.left = 0;
    this.right = 9;
    this.bottom = 19;
  }

  boardClear() {
    this.board.forEach((row) => {
      row.forEach((element) => {
        element.style.backgroundColor = "#d3d3d3";
      });
    });
  }

  pieceCheckCollision() {}

  pieceRotateRight() {
    const sortingCallback = ([y1, x1], [y2, x2]) => {
      if (y1 == y2) {
        return x1 - x2;
      } else {
        return y1 - y2;
      }
    };

    this.pieceClear();
    const nextRotation =
      this.#rotationMatrix[this.pieceType][this.pieceRotation];
    console.log(this.pieceRotation);
    /** @type {Object<number, Array<number>} */
    const pieceStore = {};
    let countPiece = 0;
    const matrixStore = [];
    for (const [y, value] of Object.entries(this.piece).sort(sortingCallback)) {
      for (let x of value) {
        matrixStore.push([
          parseInt(y) + nextRotation[countPiece][0],
          parseInt(x) + nextRotation[countPiece][1],
        ]);
        countPiece++;
      }
    }

    matrixStore.sort(sortingCallback).forEach((val, index) => {
      if (pieceStore[val[0]] == undefined) {
        pieceStore[val[0]] = [];
      }
      pieceStore[val[0]].push(val[1]);
    });
    this.pieceLastRotation = this.piece;
    this.piece = pieceStore;
    this.pieceRotation++;
    if (this.pieceRotation >= 4) {
      this.pieceRotation = 0;
    }

    this.piecePlace();
  }

  pieceRotateLeft() {
    this.pieceRotation--;
    if (this.pieceRotation < 0) {
      this.pieceRotation = 3;
    }
    const sortingCallback = ([y1, x1], [y2, x2]) => {
      if (y1 == y2) {
        return x1 - x2;
      } else {
        return y1 - y2;
      }
    };

    this.pieceClear();

    const nextRotation =
      this.#reverseRotationMatrix[this.pieceType][this.pieceRotation];
    console.log(this.piece);
    console.log(this.pieceRotation);
    /** @type {Object<number, Array<number>} */
    const pieceStore = {};
    let countPiece = 0;
    const matrixStore = [];
    for (const [y, value] of Object.entries(this.piece).sort(sortingCallback)) {
      for (let x of value) {
        matrixStore.push([
          parseInt(y) - nextRotation[countPiece][0],
          parseInt(x) - nextRotation[countPiece][1],
        ]);
        countPiece++;
      }
    }
    console.log(matrixStore);
    matrixStore.sort(sortingCallback).forEach((val, index) => {
      if (pieceStore[val[0]] == undefined) {
        pieceStore[val[0]] = [];
      }
      pieceStore[val[0]].push(val[1]);
    });

    this.piece = pieceStore;

    this.piecePlace();
  }

  clearSquare(x, y) {
    try {
      this.board.get(parseInt(y)).get(parseInt(x)).style.backgroundColor =
        "white";
    } catch (err) {
      console.error(err);
    }
  }
  pieceClear() {
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        this.clearSquare(x, y);
      }
  }

  freeSpaceDown() {
    let biggestY = 0;
    for (const [y, value] of Object.entries(this.piece)) y;

    return biggestY < this.right;
  }
  freeSpaceRight() {
    let biggestX = 0;
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        if (x > biggestX) biggestX = x;
      }
    return biggestX < this.right;
  }
  freeSpaceLeft() {
    let smallestX = 19;
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        if (x < smallestX) smallestX = x;
      }
    return smallestX > this.left;
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
    if (this.freeSpaceLeft())
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
    if (this.freeSpaceRight())
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
    this.pieceType = "";
    this.pieceRotation = 0;
  }

  pieceReplace(nameOfPiece) {
    this.pieceDelete();
    this.piecePlace(nameOfPiece);
  }
  piecePlace(nameOfPiece) {
    if (isEmpty(this.piece)) {
      this.pieceType = nameOfPiece;
      const pieceLocations = this.#plottedPieces[nameOfPiece];
      this.piece = pieceLocations;
    }

    for (const [y, value] of Object.entries(this.piece)) {
      for (let x of value) {
        try {
          this.board.get(parseInt(y)).get(parseInt(x)).style.backgroundColor =
            this.#colors[this.pieceType];
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  var gameBoard = new GameBoard(gameMap);
  const letters = ["O", "T", "I", "L", "J", "S", "Z"];

  // Initially place a "T" piece
  gameBoard.piecePlace("Z");

  let count = 0;
  // Event listener for keyboard events
  document.addEventListener("keydown", (event) => {
    // if (g)
    if (event.key === "r") {
      event.preventDefault();
      gameBoard.pieceReplace(letters[count]);
      count++;
      if (count > letters.length - 1) count = 0;
    }
    if (event.key === "q") {
      event.preventDefault();
      gameBoard.pieceRotateLeft();
    }
    if (event.key === "e") {
      event.preventDefault();
      gameBoard.pieceRotateRight();
    }
    if (event.key === "s") {
      event.preventDefault();
      gameBoard.pieceMoveDown();
    }
    if (event.key === "a") {
      event.preventDefault();
      gameBoard.pieceMoveLeft();
    }
    if (event.key === "d") {
      event.preventDefault();
      gameBoard.pieceMoveRight();
    }
  });
});
