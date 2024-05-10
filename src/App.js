import "./App.css";
import React from "react";

// TODO
// Make the pieces look right in the boxes
// make the history

export default class Game extends React.Component {
  // lets make it board dependent like the other project
  // the only state value we will need is the history
  // with that we can render the pieces in play and the pieces
  // in the containers.
  // i want to make it board dependent so bad, but i need ids
  // for each piece in order to have drop work properly for
  // the containers.
  state = {
    stepNum: 0,

    pieces: [
      { id: "l1", size: "l", color: "blue", location: "blue_pieces" },
      { id: "l2", size: "l", color: "blue", location: "blue_pieces" },
      { id: "l3", size: "l", color: "red", location: "red_pieces" },
      { id: "l4", size: "l", color: "red", location: "red_pieces" },
      { id: "m1", size: "m", color: "blue", location: "blue_pieces" },
      { id: "m2", size: "m", color: "blue", location: "blue_pieces" },
      { id: "m3", size: "m", color: "red", location: "red_pieces" },
      { id: "m4", size: "m", color: "red", location: "red_pieces" },
      { id: "s1", size: "s", color: "blue", location: "blue_pieces" },
      { id: "s2", size: "s", color: "blue", location: "blue_pieces" },
      { id: "s3", size: "s", color: "red", location: "red_pieces" },
      { id: "s4", size: "s", color: "red", location: "red_pieces" },
    ],

    isNext: true,

    history: [
      [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    ],
  };

  renderSquare(loc, squares) {
    return (
      <div
        className="square"
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e) => {
          this.onDrop(e, loc);
        }}
      >
        {squares[loc]}
      </div>
    );
  }

  onDragStart = (ev, id) => {
    console.log("dragstart:", id);
    ev.dataTransfer.setData("id", id);
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDrop = (ev, loc) => {
    let id = ev.dataTransfer.getData("id");
    let history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const board = JSON.parse(JSON.stringify(current));
    var nextState = this.state.isNext;
    //console.log(this.state.history);

    console.log(history);

    // UPDATE THE BOARD!!!!
    if (!checkWin(board)) {
      let stored = this.state.pieces.filter((piece) => {
        if (piece.id === id) {
          var move = getMove(piece, loc);
          console.log(move);
          var moves = getPossibleMoves(board, this.state.isNext ? "b" : "r");
          // if this move exists in the list of moves
          if (moves.indexOf(move) > -1) {
            // fix board update NOW, for some reason it affects the whole history
            board[Number(move[3]) - 1][Number(move[2]) - 1] =
              move[0] +
              move[1] +
              board[Number(move[3]) - 1][Number(move[2]) - 1];
            // set the location of the piece for pieces state variable

            this.state.pieces.forEach((p) => {
              if (p.location === loc) {
                p.location = "gone";
              }
            });
            nextState = !nextState;
            piece.location = loc;
          }
        }
        return piece;
      });

      this.setState({
        ...this.state,
        stepNum: history.length,
        history: history.concat([board]),
        stored,
        isNext: nextState,
      });
    }
  };

  render() {
    var sizes = {
      l: "10vw",
      m: "7.5vw",
      s: "6vw",
    };

    var container = {
      blue_pieces: [],
      red_pieces: [],
    };

    var squares = {
      "1,1": [],
      "1,2": [],
      "1,3": [],
      "2,1": [],
      "2,2": [],
      "2,3": [],
      "3,1": [],
      "3,2": [],
      "3,3": [],
    };

    const current = this.state.history[this.state.history.length - 1];
    var winner = checkWin(current);
    var status = "";
    var restart = <div></div>;

    // and then, getPossiblePieces(current).forEach((p) => { }); make the
    // respective piece in the containers.

    this.state.pieces.forEach((p) => {
      // if its not a lower case letter
      if (p.location.charCodeAt(0) < 97) {
        // here we need to check if the move is possible, and if not, dont push the pieces to the board
        squares[p.location].push(
          <div
            className="circle"
            key={p.id}
            onDragStart={(e) => this.onDragStart(e, p.id)}
            draggable
            style={{
              backgroundColor: p.color,
              height: sizes[p.size],
              width: sizes[p.size],
            }}
          ></div>
        );
      } else if (p.location !== "gone") {
        container[p.location].push(
          <div
            className="circle"
            key={p.id}
            onDragStart={(e) => this.onDragStart(e, p.id)}
            draggable
            style={{
              backgroundColor: p.color,
              height: sizes[p.size],
              width: sizes[p.size],
            }}
          ></div>
        );
      }
    });

    // handle the game status
    if (winner) {
      status = this.state.isNext ? "red won!" : "blue won!";
    } else {
      status = this.state.isNext ? "blue's turn" : "red's turn";
    }

    // i dont like how
    return (
      <div className="container-drag">
        <div
          className="pieces"
          onDragOver={(e) => this.onDragOver(e)}
          onDrop={(e) => {
            this.onDrop(e, "blue_pieces");
          }}
        >
          <span className="task-header">Blue Pieces</span>
          {container.blue_pieces}
        </div>
        <div>
          <div className="board-row">
            {this.renderSquare("1,1", squares)}
            {this.renderSquare("2,1", squares)}
            {this.renderSquare("3,1", squares)}
          </div>
          <div className="board-row">
            {this.renderSquare("1,2", squares)}
            {this.renderSquare("2,2", squares)}
            {this.renderSquare("3,2", squares)}
          </div>
          <div className="board-row">
            {this.renderSquare("1,3", squares)}
            {this.renderSquare("2,3", squares)}
            {this.renderSquare("3,3", squares)}
          </div>
        </div>
        <div
          className="pieces"
          onDragOver={(e) => this.onDragOver(e)}
          onDrop={(e) => this.onDrop(e, "red_pieces")}
        >
          <span className="task-header">Red Pieces</span>
          {container.red_pieces}
        </div>
        <div>
          <h1>{status}</h1>
          {restart}
        </div>
      </div>
    );
  }
}

// ========================================================================================================================
// make a calculateWinner function and a getPossibleMoves function that returns a set
// a move in the orignal code was in the form bs11, rm31
// everything below is just old javascript code from the original project
function getMove(piece, square) {
  return piece.color[0] + piece.size[0] + square[0] + square[2];
}

function getPossiblePieces(board) {
  // returns a dictionary of all the pieces not yet played
  var currentPiecesOut = {
    bl: 2,
    bm: 2,
    bs: 2,
    rl: 2,
    rm: 2,
    rs: 2,
  };

  var currentPiecesPlay = [];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] !== "") {
        for (var k = 0; k < board[i][j].length; k = k + 2)
          currentPiecesOut[board[i][j][k] + board[i][j][k + 1]] =
            currentPiecesOut[board[i][j][k] + board[i][j][k + 1]] - 1;
      }
    }
  }
  return currentPiecesOut;
}

function getPossibleMoves(board, config) {
  var size = ["s", "m", "l"];
  var newPos = [];

  // might as well count and add the pieces manually to a array
  // consult pergugini?
  var canPlay = getPossiblePieces(board);

  if (config === "all") {
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        // set the iterator to add the proper sied move
        var k = 0;
        if (board[i][j][1] === "s") {
          k = 1;
        } else if (board[i][j][1] === "m") {
          k = 2;
        } else if (board[i][j][1] === "l") {
          k = 3;
        }

        for (k; k < size.length; k++) {
          var redMove = "r" + size[k];
          var blueMove = "b" + size[k];
          if (canPlay[redMove] !== 0) {
            newPos.push(redMove + (j + 1) + (i + 1));
          }
          if (canPlay[blueMove] !== 0) {
            newPos.push(blueMove + (j + 1) + (i + 1));
          }
        }
      }
    }
  }
  // returns the moves for a certain color
  else {
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        var k = 0;
        if (board[i][j][1] === "s") {
          k = 1;
        } else if (board[i][j][1] === "m") {
          k = 2;
        } else if (board[i][j][1] === "l") {
          k = 3;
        }
        for (k; k < size.length; k++) {
          var Move = config[0] + size[k];
          if (canPlay[Move] !== 0) {
            newPos.push(Move + (j + 1) + (i + 1));
          }
        }
      }
    }
  }
  return newPos;
}

function checkWin(board) {
  // top row horizantal bug, needs to be fixed
  return (
    (board[0][0][0] === board[0][1][0] &&
      board[0][1][0] === board[0][2][0] &&
      board[0][1] !== "") ||
    (board[1][0][0] === board[1][1][0] &&
      board[1][1][0] === board[1][2][0] &&
      board[1][1] !== "") ||
    (board[2][0][0] === board[2][1][0] &&
      board[2][1][0] === board[2][2][0] &&
      board[2][1] !== "") ||
    (board[0][0][0] === board[1][0][0] &&
      board[1][0][0] === board[2][0][0] &&
      board[1][0] !== "") ||
    (board[0][1][0] === board[1][1][0] &&
      board[1][1][0] === board[2][1][0] &&
      board[1][1] !== "") ||
    (board[0][2][0] === board[1][2][0] &&
      board[1][2][0] === board[2][2][0] &&
      board[1][2] !== "") ||
    (board[0][0][0] === board[1][1][0] &&
      board[1][1][0] === board[2][2][0] &&
      board[1][1] !== "") ||
    (board[0][2][0] === board[1][1][0] &&
      board[1][1][0] === board[2][0][0] &&
      board[1][1] !== "")
  );
}

