import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const styles = "square" + (props.isHighlighted ? " highlight" : "");

  return (
    <button className={styles} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlighted={this.props.winnerSquares.includes(i)}
      />
    );
  }

  renderBoard() {
    const elements = [];

    for (let i = 0; i < this.props.squares.length - 2; i += 3) {
      elements.push(
        <div className="board-row" key={i}>
          {this.renderSquare(i)}
          {this.renderSquare(i + 1)}
          {this.renderSquare(i + 2)}
        </div>
      );
    }

    return elements;
  }

  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      moveIndex: null,
      reverseHistory: false,
    };
  }

  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = current.squares.slice();
    if (calculateWinnerSquares(squares).length > 0 || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      moveIndex: i,
    });
  };

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  };

  toggleHistoryOrder = () => {
    this.setState((prevState) => {
      return {
        reverseHistory: !prevState.reverseHistory,
      };
    });
  };

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];

    const winnerSquares = calculateWinnerSquares(current.squares);
    const winner =
      winnerSquares.length > 0 ? current.squares[winnerSquares[0]] : null;

    let moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " " + getLocation(this.state.moveIndex)
        : "Go to game start";
      return (
        <li key={move}>
          <button
            style={
              this.state.stepNumber === move
                ? { color: "blue" }
                : { color: "black" }
            }
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    if (this.state.reverseHistory) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (current.squares.length === this.state.stepNumber) {
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerSquares={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <button onClick={this.toggleHistoryOrder}>
            Moves (click to change order
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinnerSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}

// function calculateWinner(squares) {
//   const winnerSquares = calculateWinnerSquares(squares);
//   return winnerSquares ? squares[winnerSquares[0]] : null;
// }

function getLocation(i) {
  return `(${i % 3},${Math.floor(i / 3)})`;
}
