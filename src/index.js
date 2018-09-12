import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	const style = {
		background: props.value,
	};
	return (
		<button style={style} className="square" onClick={props.onClick}>
		</button>
	);
}

class Config extends React.Component {
	setX(event) {
		let coord = event.target.value;
		this.props.onXChange(coord);
	}

	setY(event) {
		let coord = event.target.value;
		this.props.onYChange(coord);
	}
	setColor(event) {
		let color = event.target.value;
		this.props.setColor(color);
	}

	render() {
		return (
			<div>
				<p>{"x"}</p>
				<input type="number" onChange={this.setX.bind(this)} />
				<p>{"y"}</p>
				<input type="number" onChange={this.setY.bind(this)} />
				<p>{"color"}</p>
				<input type="color" onChange={this.setColor.bind(this)} />
			</div>
		);

	}
}

class Grid extends React.Component {
	renderSquare(i) {
		return (
			<Square key={i}
				value={this.props.squares2[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		let gridRender = [];
		let x = this.props.x;
		let y = this.props.y;
		let c = 0;
		for (let i=0; i<x; i++) {	
			let col = [];
			for (let j=0; j<y; j++) {
				col.push(this.renderSquare(c));
				c++;
			}
			gridRender.push(<div key={"row_" + i} className="board-row">
				{col}
				</div>
			);

		}
		return (
			<div>
			{gridRender}
			</div>
		);
		// return (
		//   <div>
		//     <div className="board-row">
		//       {this.renderSquare(0)}
		//       {this.renderSquare(1)}
		//       {this.renderSquare(2)}
		//     </div>
		//     <div className="board-row">
		//       {this.renderSquare(3)}
		//       {this.renderSquare(4)}
		//       {this.renderSquare(5)}
		//     </div>
		//     <div className="board-row">
		//       {this.renderSquare(6)}
		//       {this.renderSquare(7)}
		//       {this.renderSquare(8)}
		//     </div>
		//   </div>
		// );
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		let defaultX = 5;
		let defaultY = 5;
		this.state = {
			history: [
				{
					squares: Array(5*5).fill(null)
				}
			],
			squares2: Array(defaultX*defaultY).fill('white'),
			stepNumber: 0,
			xIsNext: true,
			x: defaultX,
			y: defaultY,
			color: "black",
		};
	}

	setX(x) {
		this.setState({
			x: x,
			squares2: Array(x*this.y).fill('white'),
		});
	}

	setY(y) {
		this.setState({
			y: y,
			squares2: Array(y*this.x).fill('white'),
		});
	}

	setColor(color) {
		this.setState({
			color: color,
		});
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		const squares2 = this.state.squares2;
		squares2[i] = squares2[i] === "white" ? this.state.color : "white";
		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
				<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Grid
						x={this.state.x}
						y={this.state.y}
						squares2={this.state.squares2}
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-config">
					<Config
						x={this.state.x}
						y={this.state.y}
						onXChange={(i) => this.setX(i)}
						onYChange={(i) => this.setY(i)}
						setColor={(i) => this.setColor(i)}
					/>
				</div>
			<div className="game-info">
				<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}


