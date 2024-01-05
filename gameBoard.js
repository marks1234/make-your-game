import {
  rotationMatrix,
  reverseRotationMatrix,
  wallKickDataL,
  wallKickDataR,
} from "./rotationMatrices.js";

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
export default class GameBoard {
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
    O: "bc9c22",
    T: "bc9c22",
    I: "bc9c22",
    L: "bc9c22",
    J: "bc9c22",
    S: "bc9c22",
    Z: "bc9c22",
  };

  #wallKickDataL = wallKickDataL;
  #wallKickDataR = wallKickDataR;

  #reverseRotationMatrix = reverseRotationMatrix;

  #rotationMatrix = rotationMatrix;

  constructor(board, boardHeight, boardWidth, backgroundColor) {
    /** @type {Map<number, Map<number, HTMLDivElement>>} */
    this.board = board;
    /** @type {Object<number, Array<number>} */
    this.piece = {};
    this.pieceType = "";
    this.pieceLastRotation = {};
    this.pieceRotation = 0;
    this.gameEnd = false;

    this.linesCleared = 0;
    this.level = 1;

    this.SquaresToEmpty = [];
    this.lastRandomNumber = 0;
    this.left = 0;
    this.right = boardWidth;
    this.bottom = boardHeight + 2;
    this.backgroundColor = backgroundColor;
  }

  boardClear() {
    this.board.forEach((row) => {
      row.forEach((element) => {
        element.style.backgroundColor = this.backgroundColor;
      });
    });
  }

  pieceRotateRight() {
    console.log(this.piece);
    if (this.pieceType == "o") return;
    const undoStateRight = () => {
      this.piece = this.pieceLastRotation;
      this.pieceRotation--;
    };
    const sortingCallback = ([y1, x1], [y2, x2]) => {
      if (y1 == y2) {
        return x1 - x2;
      } else {
        return y1 - y2;
      }
    };

    this.pieceErase();
    const nextRotation =
      this.#rotationMatrix[this.pieceType][this.pieceRotation];
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

    if (!this.#pieceTryCollision()) {
      this.#hiddenMoveDown();
      if (this.#pieceCheckCollisionWallRight()) {
        this.#hiddenMoveLeft();
      } else if (this.#pieceCheckCollisionWallLeft()) {
        this.#hiddenMoveRight();
      }

      const [testX, testY] = Object.values(
        wallKickDataR[this.pieceType][this.pieceRotation]
      );
      let foundPlacement = false;
      for (let i = 0; i < 5; i++) {
        this.#hiddenMoveBy(parseInt(testX[i]), parseInt(testY[i]));
        if (!this.#pieceTryCollision()) {
          this.#hiddenMoveUndoBy(parseInt(testX[i]), parseInt(testY[i]));
        } else {
          foundPlacement = true;
          break;
        }
      }
      if (!foundPlacement) undoStateRight();
    }

    this.pieceRotation++;
    if (this.pieceRotation >= 4) {
      this.pieceRotation = 0;
    }
    this.pieceDraw();
  }

  pieceRotateLeft() {
    if (this.pieceType == "o") return;
    this.pieceRotation--;

    if (this.pieceRotation < 0) {
      this.pieceRotation = 3;
    }
    const undoStateLeft = () => {
      this.piece = this.pieceLastRotation;
      this.pieceRotation++;
      if (this.pieceRotation >= 4) {
        this.pieceRotation = 0;
      }
    };
    const sortingCallback = ([y1, x1], [y2, x2]) => {
      if (y1 == y2) {
        return x1 - x2;
      } else {
        return y1 - y2;
      }
    };

    this.pieceErase();

    const nextRotation =
      this.#reverseRotationMatrix[this.pieceType][this.pieceRotation];
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
    matrixStore.sort(sortingCallback).forEach((val, index) => {
      if (pieceStore[val[0]] == undefined) {
        pieceStore[val[0]] = [];
      }
      pieceStore[val[0]].push(val[1]);
    });
    this.pieceLastRotation = this.piece;
    this.piece = pieceStore;

    if (!this.#pieceTryCollision()) {
      this.#hiddenMoveDown();
      if (this.#pieceCheckCollisionWallRight()) {
        this.#hiddenMoveLeft();
      } else if (this.#pieceCheckCollisionWallLeft()) {
        this.#hiddenMoveRight();
      }
      const [testX, testY] = Object.values(
        wallKickDataL[this.pieceType][this.pieceRotation]
      );
      let foundPlacement = false;
      for (let i = 0; i < 5; i++) {
        this.#hiddenMoveBy(parseInt(testX[i]), parseInt(testY[i]));
        if (!this.#pieceTryCollision()) {
          this.#hiddenMoveUndoBy(parseInt(testX[i]), parseInt(testY[i]));
        } else {
          foundPlacement = true;
          break;
        }
      }
      if (!foundPlacement) undoStateLeft();
    }

    this.pieceDraw();
  }

  #pieceTryCollision() {
    let canPlace = true;

    if (this.#pieceCheckCollisionWallLeft()) canPlace = false;

    if (this.#pieceCheckCollisionWallRight()) canPlace = false;

    if (this.#pieceCheckCollisionWallDown()) canPlace = false;

    if (this.#pieceCheckCollisionPiece()) canPlace = false;

    return canPlace;
  }

  #pieceCheckCollisionWallLeft() {
    let smallestX = 19;
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        if (x < smallestX) smallestX = x;
      }
    return smallestX < this.left;
  }
  #pieceCheckCollisionWallRight() {
    let biggestX = 0;
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        if (x > biggestX) biggestX = x;
      }

    return biggestX > this.right;
  }
  #pieceCheckCollisionWallDown() {
    let biggestY = 0;
    for (const [y, value] of Object.entries(this.piece))
      if (biggestY < y) biggestY = y;

    return biggestY > this.bottom;
  }
  #pieceCheckCollisionPiece() {
    let collides = false;
    for (const [y, values] of Object.entries(this.piece)) {
      for (let x of values) {
        if (this.#squareInsideSquare(parseInt(x), parseInt(y))) collides = true;
      }
    }
    return collides;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  #squareInsideSquare(x, y) {
    try {
      const nodeUnderColour = this.board.get(y).get(x).style.backgroundColor;
      if (nodeUnderColour == this.backgroundColor) {
        return false;
      }
      return true;
    } catch (err) {}
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  #squareLocatedDown(x, y) {
    if (this.piece[y + 1] != undefined)
      if (this.piece[y + 1].includes(x)) {
        return false;
      }

    const nodeUnderColour = this.board.get(y + 1).get(x).style.backgroundColor;
    if (nodeUnderColour == this.backgroundColor) {
      return false;
    }
    return true;
  }

  #pieceLocatedDown() {
    let collides = false;
    for (const [y, values] of Object.entries(this.piece)) {
      for (let x of values) {
        if (this.#squareLocatedDown(parseInt(x), parseInt(y))) collides = true;
      }
    }
    return collides;
  }

  freeSpaceDown() {
    let biggestY = 0;
    for (const [y, value] of Object.entries(this.piece))
      if (biggestY < y) biggestY = y;
    return biggestY < this.bottom && !this.#pieceLocatedDown();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  #squareLocatedRight(x, y) {
    if (this.piece[y].includes(x + 1)) {
      return false;
    }

    const nodeLeftColour = this.board.get(y).get(x + 1).style.backgroundColor;
    if (nodeLeftColour == this.backgroundColor) {
      return false;
    }
    return true;
  }
  #pieceLocatedRight() {
    let collides = false;
    for (const [y, values] of Object.entries(this.piece)) {
      for (let x of values) {
        if (this.#squareLocatedRight(parseInt(x), parseInt(y))) collides = true;
      }
    }
    return collides;
  }
  freeSpaceRight() {
    let biggestX = 0;
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        if (x > biggestX) biggestX = x;
      }
    return biggestX < this.right && !this.#pieceLocatedRight();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  #squareLocatedLeft(x, y) {
    if (this.piece[y].includes(x - 1)) {
      return false;
    }

    const nodeLeftColour = this.board.get(y).get(x - 1).style.backgroundColor;
    if (nodeLeftColour == this.backgroundColor) {
      return false;
    }
    return true;
  }
  #pieceLocatedLeft() {
    let collides = false;
    for (const [y, values] of Object.entries(this.piece)) {
      for (let x of values) {
        if (this.#squareLocatedLeft(parseInt(x), parseInt(y))) collides = true;
      }
    }
    return collides;
  }
  freeSpaceLeft() {
    let smallestX = 19;
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        if (x < smallestX) smallestX = x;
      }
    return smallestX > this.left && !this.#pieceLocatedLeft();
  }

  clearSquare(x, y) {
    try {
      this.board.get(parseInt(y)).get(parseInt(x)).style.backgroundColor =
        this.backgroundColor;
    } catch (err) {
      console.error(err);
    }
  }
  pieceErase() {
    for (const [y, value] of Object.entries(this.piece))
      for (let x of value) {
        this.clearSquare(x, y);
      }
  }

  piecePlace() {
    for (const [key, value] of Object.entries(this.piece)) {
      const y = parseInt(key);
      for (let key of value) {
        const x = parseInt(key);
        this.board.get(y).get(x).style.backgroundColor =
          this.#colors[this.pieceType];
      }
    }
    this.#handleLineFilled();
    this.pieceDelete();
    this.pieceDraw(this.getRandomPiece());
  }
  #hiddenMoveUp() {
    if (!isEmpty(this.piece)) {
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece))
        pieceStore[parseInt(y) - 1] = value;

      this.piece = pieceStore;
      return true;
    } else {
      try {
        throw Error("Can't move an empty piece Down!");
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  pieceMoveUp() {
    this.pieceErase();
    this.#hiddenMoveUp();
    this.pieceDraw();
  }

  pieceMoveDown() {
    this.pieceErase();
    if (this.freeSpaceDown()) this.#hiddenMoveDown();
    this.pieceDraw();
  }

  #hiddenMoveDown() {
    if (!isEmpty(this.piece)) {
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece))
        pieceStore[parseInt(y) + 1] = value;

      this.piece = pieceStore;
      return true;
    } else {
      try {
        throw Error("Can't move an empty piece Down!");
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  pieceMoveLeft() {
    this.pieceErase();
    if (this.freeSpaceLeft()) this.#hiddenMoveLeft();
    this.pieceDraw();
  }
  #hiddenMoveLeft() {
    if (!isEmpty(this.piece)) {
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece)) {
        const newValue = [];
        for (let x of value) newValue.push(parseInt(x) - 1);
        pieceStore[parseInt(y)] = newValue;
      }

      this.piece = pieceStore;
      return true;
    } else {
      try {
        throw Error("Can't move an empty piece Left!");
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  pieceMoveRight() {
    this.pieceErase();
    if (this.freeSpaceRight()) this.#hiddenMoveRight();
    this.pieceDraw();
  }
  #hiddenMoveRight() {
    if (!isEmpty(this.piece)) {
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece)) {
        const newValue = [];
        for (let x of value) newValue.push(parseInt(x) + 1);
        pieceStore[parseInt(y)] = newValue;
      }

      this.piece = pieceStore;
      return true;
    } else {
      try {
        throw Error("Can't move an empty piece Right!");
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  #getAllSquaresInLine(rightSide, y) {
    /** @type {Array<HTMLDivElement>} */
    const stack = [];
    if (rightSide >= 0) {
      stack.push(...this.#getAllSquaresInLine(rightSide - 1, y));
      stack.push(this.board.get(y).get(rightSide));
    }
    return stack;
  }

  #dropAllColoured(startingLine) {
    const boardPicture = [];
    let y = startingLine;
    let linehasColour = true;
    let count = 0;
    while (linehasColour) {
      count++;
      let lineOfColours = this.#getAllSquaresInLine(this.right, y).map(
        (v) => v.style.backgroundColor
      );
      boardPicture.push(lineOfColours);
      if (lineOfColours.every((colour) => colour == this.backgroundColor))
        linehasColour = false;

      console.log(count);
      if (count == 100) {
        console.log("LOOPIDY LOOPIN");
        break;
      }
      y--;
    }

    for (let i = 0; i < boardPicture.length; i++) {
      if (startingLine + 1 - i != 0) {
        const currentLine = this.board.get(startingLine + 1 - i);
        boardPicture[i].forEach((val, index) => {
          currentLine.get(index).style.backgroundColor = val;
        });
      }
    }
  }

  #handleLineFilled() {
    for (const y of Object.keys(this.piece)) {
      let lineOfNodes = this.#getAllSquaresInLine(this.right, parseInt(y));
      if (
        lineOfNodes.every(
          (node) => node.style.backgroundColor != this.backgroundColor
        )
      ) {
        this.linesCleared++;
        this.#handleLevel();
        lineOfNodes.forEach(
          (node) => (node.style.backgroundColor = this.backgroundColor)
        );
        this.#dropAllColoured(parseInt(y) - 1);
      }
    }
  }

  #handleLevel() {
    if (this.linesCleared % 10 == 0) this.level++;
  }

  #hiddenMoveBy(inputX, inputY) {
    if (!isEmpty(this.piece)) {
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece)) {
        const newValue = [];
        for (let x of value) newValue.push(parseInt(x) + inputX);
        pieceStore[parseInt(y) - inputY] = newValue;
      }
      this.piece = pieceStore;
      return true;
    } else {
      try {
        throw Error("Can't move an empty piece Right!");
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  #hiddenMoveUndoBy(inputX, inputY) {
    if (!isEmpty(this.piece)) {
      const pieceStore = {};

      for (const [y, value] of Object.entries(this.piece)) {
        const newValue = [];
        for (let x of value) newValue.push(parseInt(x) - inputX);
        pieceStore[parseInt(y) + inputY] = newValue;
      }

      this.piece = pieceStore;
      return true;
    } else {
      try {
        throw Error("Can't move an empty piece Right!");
      } catch (err) {
        console.error(err);
      }
    }
    return false;
  }

  pieceDelete() {
    this.piece = {};
    this.pieceType = "";
    this.pieceRotation = 0;
  }

  pieceReplace(nameOfPiece) {
    this.pieceErase();
    this.pieceDelete();
    this.pieceDraw(nameOfPiece);
  }

  getRandomPiece() {
    let num = Math.floor((Math.random() * 10) % 7);
    while (num == this.lastRandomNumber)
      num = Math.floor((Math.random() * 10) % 7);
    this.lastRandomNumber = num;
    return Object.keys(this.#colors)[num];
  }
  pieceDraw(nameOfPiece) {
    if (isEmpty(this.piece)) {
      this.pieceType = nameOfPiece;
      const pieceLocations = this.#plottedPieces[nameOfPiece];
      this.piece = pieceLocations;
    }
    if (this.#pieceCheckCollisionPiece()) {
      console.log("two pieces printed at a time");
      this.gameEnd = true;
      return;
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
