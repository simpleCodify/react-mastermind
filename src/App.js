import React, { Component } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard/GameBoard";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import GameTimer from "./components/GameTimer/GameTimer";
import NewGameButton from "./components/NewGameButton/NewGameButton";

const colors = ["#7CCCE5", "#FDE47F", "#E04644", "#B576AD"];

class App extends Component {
	constructor() {
		super();
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			selColorIdx: 0,
			guesses: [this.getNewGuess()],
			code: this.genCode()
		};
	}

	getNewGuess() {
		return {
			code: [null, null, null, null],
			score: {
				perfect: 0,
				almost: 0
			}
		};
	}

	genCode() {
		return new Array(4).fill().map(dummy => Math.floor(Math.random() * 4));
	}

	handleColorSelection = colorIdx => {
		this.setState({ selColorIdx: colorIdx });
	};

	getWinTries() {
		// if winner, return num guesses, otherwise 0 (no winner)
		let lastGuess = this.state.guesses.length - 1;
		return this.state.guesses[lastGuess].score.perfect === 4 ? lastGuess + 1 : 0;
	}

	handleNewGameClick = () => {
		this.setState(this.getInitialState());
	};

	handlePegClick = pegIdx => {
		let currentGuessIdx = this.state.guesses.length - 1;

		let guessesCopy = [...this.state.guesses];
		let guessCopy = { ...guessesCopy[currentGuessIdx] };
		let codeCopy = [...guessCopy.code];

		codeCopy[pegIdx] = this.state.selColorIdx;
		guessCopy.code = codeCopy;

		guessesCopy[currentGuessIdx] = guessCopy;

		this.setState({
			guesses: guessesCopy
		});
	};

	handleScoreClick = () => {
		let currentGuessIdx = this.state.guesses.length - 1;
		let guessCodeCopy = [...this.state.guesses[currentGuessIdx].code];
		let secretCodeCopy = [...this.state.code];

		let perfect = 0;
		let almost = 0;

		guessCodeCopy.forEach((code, idx) => {
			if (secretCodeCopy[idx] === code) {
				perfect++;
				guessCodeCopy[idx] = secretCodeCopy[idx] = null;
			}
		});

		guessCodeCopy.forEach((code, idx) => {
			if (code === null) return;
			let foundIdx = secretCodeCopy.indexOf(code);
			if (foundIdx > -1) {
				almost++;
				secretCodeCopy[foundIdx] = null;
			}
		});

		let guessesCopy = [...this.state.guesses];
		let guessCopy = { ...guessesCopy[currentGuessIdx] };
		let scoreCopy = { ...guessCopy.score };

		scoreCopy.perfect = perfect;
		scoreCopy.almost = almost;

		guessCopy.score = scoreCopy;
		guessesCopy[currentGuessIdx] = guessCopy;

		if (perfect !== 4) guessesCopy.push(this.getNewGuess());

		this.setState({
			guesses: guessesCopy
		});
	};

	render() {
		let winTries = this.getWinTries();
		return (
			<div className="App">
				<header className="App-header-footer">R E A C T - M A S T E R M I N D</header>
				<div className="flex-h align-flex-end">
					<GameBoard colors={colors} guesses={this.state.guesses} handlePegClick={this.handlePegClick} handleScoreClick={this.handleScoreClick} />
					<div className="App-controls">
						<ColorPicker colors={colors} selColorIdx={this.state.selColorIdx} handleColorSelection={this.handleColorSelection} />
						<GameTimer />
						<NewGameButton handleNewGameClick={this.handleNewGameClick} />
					</div>
				</div>
				<footer className="App-header-footer">{winTries ? `You Won in ${winTries} Guesses!` : "Good Luck!"}</footer>
			</div>
		);
	}
}

export default App;
