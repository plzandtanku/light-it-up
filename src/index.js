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
	setRows(event) {
		let coord = event.target.value;
		this.props.onRowChange(coord);
	}

	setCols(event) {
		let coord = event.target.value;
		this.props.onColChange(coord);
	}
	setColor(event) {
		let color = event.target.value;
		this.props.setColor(color);
	}

	render() {
		return (
			<div>
				<h4> Configurations </h4>
				<label htmlFor="rows"># of rows</label>
				<input type="number" id="rows" value={this.props.rows} onChange={this.setRows.bind(this)} />
				<label htmlFor="cols"># of columns</label>
				<input type="number" id="cols" value={this.props.cols} onChange={this.setCols.bind(this)} />
				<label htmlFor="color">fill color</label>
				<input type="color" id="color" value={this.props.color} onChange={this.setColor.bind(this)} />
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
		let x = this.props.rows;
		let y = this.props.cols;
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
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		let defaultRows = 5;
		let defaultCols = 5;
		this.state = {
			history: [
				{
					squares: Array(5*5).fill(null)
				}
			],
			squares2: Array(defaultRows*defaultCols).fill('white'),
			stepNumber: 0,
			xIsNext: true,
			rows: defaultRows,
			cols: defaultCols,
			color: "black",
		};
	}

	setRows(rows) {
		this.setState({
			rows: rows,
			squares2: Array(rows*this.state.cols).fill('white'),
		});
	}

	setCols(cols) {
		this.setState({
			cols: cols,
			squares2: Array(cols*this.state.rows).fill('white'),
		});
	}

	setColor(color) {
		this.setState({
			color: color,
		});
	}

	flipColor(i) {
		const squares2 = this.state.squares2;
		squares2[i] = squares2[i] === "white" ? this.state.color : "white";
	}

	colorDisplay(i) {
		this.flipColor(i);
		let cols = parseInt(this.state.cols, 10);
//		console.log(i+" "+this.state.rows+" "+this.state.cols);
		if ((i+1) % this.state.cols !== 0){
			this.flipColor(i+1);
		}
		if (i % this.state.cols !== 0){
			this.flipColor(i-1);
		}
		if (i >= this.state.cols) {
			this.flipColor(i-cols);
		}
		if (i <= ((this.state.cols*this.state.rows) - this.state.rows)) {
			this.flipColor(i+cols);
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			const squares2 = this.state.squares2;
			squares2[i] = squares2[i] === "white" ? this.state.color : "white";
			return;
		}
		this.colorDisplay(i);
	
		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.rowsIsNext
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
//		const winner = calculateWinner(current.squares);

//		const moves = history.map((step, move) => {
//			const desc = move ?
//				'Go to move #' + move :
//				'Go to game start';
//			return (
//				<li key={move}>
//				<button onClick={() => this.jumpTo(move)}>{desc}</button>
//				</li>
//			);
//		});
//
//		let status;
//		if (winner) {
//			status = "Winner: " + winner;
//		} else {
//			status = "Next player: " + (this.state.rowsIsNext ? "X" : "O");
//		}

		return (
			<div className="game">
				<div className="game-board">
					<Grid
						rows={this.state.rows}
						cols={this.state.cols}
						squares2={this.state.squares2}
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-config">
					<Config
						rows={this.state.rows}
						cols={this.state.cols}
						onRowChange={(i) => this.setRows(i)}
						onColChange={(i) => this.setCols(i)}
						setColor={(i) => this.setColor(i)}
					/>
				</div>
			</div>
		);
//				<div className="game-info">
//				<div>{status}</div>
//					<ol>{moves}</ol>
//				</div>
//			</div>
//		);
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


