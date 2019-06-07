"use strict";

import { currentFlashCard, makeRequest } from "./main.js";
import { requestTranslation } from "./translate.js";
import { requestToSave } from "./save-to-database.js";
import { requestFlashCards, getNextCard } from "./review-words.js";

// Card Components

class Card extends React.Component {
}

class QueryCard extends Card {
	constructor(props) {
		super(props);
		this.queryBox = React.createRef();
	}
	
	render() {
		return (
			<div className="flashcard__card" title="Press ENTER to translate">
				<input ref={this.queryBox} className="flashcard__textbox t-font--primary" type="text" autocomplete="off" placeholder="English" onKeyUp={this.props.onPressEnter} />
			</div>
		);
	}
}

class OutputCard extends Card {
	constructor(props) {
		super(props);
		this.outputBox = React.createRef();
	}
	
	render() {
		return (
			<div className="flashcard__card">
				<input ref={this.outputBox} className="flashcard__textbox t-font--primary" type="text" autocomplete="off" placeholder="Chinese 中文" readonly="readonly" />
			</div>
		);
	}
}

class ReviewTranslationCard extends Card {
	constructor(props) {
		super(props);
		this.reviewTranslationBox = React.createRef();
	}
	
	render() {
		return (
			<div className="flashcard__card flashcard__card--translation">
				<input ref={this.reviewTranslationBox} className="flashcard__textbox t-font--primary" type="text" placeholder="Translation" readonly="readonly" />
				<img className="flashcard__flip-card-icon" src="icons/flip-card.svg" alt="Flip card" onClick={this.props.onFlipCard} />
			</div>
		);
	}
}

class AnswerCard extends Card {
	constructor(props) {
		super(props);
		this.answerBox = React.createRef();
	}
	
	render() {
		return (
			<div className="flashcard__card flashcard__card--english">
				<input ref={this.answerBox} className="flashcard__textbox t-font--primary" type="text" placeholder="English" />
			</div>
		);
	}
}

// Page components

class AddWordsPage extends React.Component {
	
	constructor(props) {
		super(props);
		this.queryCard = React.createRef();
		this.outputCard = React.createRef();
	}
	
	translate(event) {
		const queryBox = this.queryCard.current.queryBox.current;
		const outputBox = this.outputCard.current.outputBox.current;
		
		if (event.key === "Enter") {
			requestTranslation(event.target.value, queryBox, outputBox);
		}
	}
	
	render() {
		
		setSwitchViewButton("review");
		
		
		function saveToDatabase() {
			try {
				requestToSave(currentFlashCard);
			}
			catch (error) {
				console.log(error);
			}
		}
		
		return (
			<div className="ui-main">
				<div className="flashcard__flexbox">
					<QueryCard ref={this.queryCard} onPressEnter={this.translate.bind(this)} />
					<OutputCard ref={this.outputCard} />
				</div>
				
				<p className="primary-action-button__par">
					<button id="js-save" onClick={saveToDatabase} className="ui-button primary-action-button t-font--primary">Save</button>
				</p>
			</div>
		);
	}
}
	
class ReviewPage extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			cardOnDisplay: {},
		}
		this.reviewTranslationCard = React.createRef();
		this.answerCard = React.createRef();
	}
	
	displayNextCard() {
		
		this.setState(function (prevState){
			return {
				cardOnDisplay: getNextCard(),
			}
		});
		
		this.setState(function (prevState) {
			const cardOnDisplay = prevState.cardOnDisplay;
			const translation = this.reviewTranslationCard.current.reviewTranslationBox.current;
			let Chinese = cardOnDisplay.Chinese;
			translation.value = Chinese;
			
			const xhr = new XMLHttpRequest();
			makeRequest(xhr, `/update-seen?Chinese=${Chinese}`, function() {
				console.log(xhr.response);
				requestFlashCards();
			});
		});
	}
	
	checkCorrect(answer) {
		const cardOnDisplay = this.state.cardOnDisplay;
		let EnglishWords = cardOnDisplay.details.English;
		let isCorrect = (!!EnglishWords) && EnglishWords.includes(answer);
		
		if (isCorrect) {
			const translation = this.reviewTranslationCard.current.reviewTranslationBox.current;
			let Chinese = translation.value;
			
			const xhr = new XMLHttpRequest();
			makeRequest(xhr, `/update-correct?Chinese=${Chinese}`, function() {
				console.log(xhr.response);
				requestFlashCards();
			});
		}
		 
		return isCorrect;
	}
	
	flipCard() {
		const answerBox = this.answerCard.current.answerBox.current;
		let isCorrect = this.checkCorrect(answerBox.value);
	}
	
	render() {
		
		setSwitchViewButton("add-words");
	
		return (
			<div className="ui-main">
				<div className="flashcard__flexbox">
					<ReviewTranslationCard ref={this.reviewTranslationCard} onFlipCard={this.flipCard.bind(this)} />
					<AnswerCard ref={this.answerCard} />
				</div>
				
				<p className="primary-action-button__par">
					<button id="js-next" className="ui-button primary-action-button t-font--primary" onClick={this.displayNextCard.bind(this)}>Next</button>
				</p>
			</div>
		);
	}
}


class View extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		if (this.props.flashCards === "{}" || this.props.switchTo === "add-words") {
			return <AddWordsPage />;
		}
		else {
			return <ReviewPage />;
		}
	}
}

const UIMain = document.getElementById("js-ui-main");

function setUIMainView(view) {
	document.body.setAttribute("data-js-current-view", view);
	ReactDOM.render(<View switchTo={view} />, UIMain);
	if (view === "review") {
		const nextWordButton = document.getElementById("js-next");
		nextWordButton.click();
	}
}

function setSwitchViewButton(view) {
	const switchViewButton = document.getElementById("js-switch-view-button");
	
	if (view === "add-words") {
		switchViewButton.textContent = "Add";
	}
	else {
		switchViewButton.textContent = "Start Review";
	}
	
	switchViewButton.onclick = function () {
		requestFlashCards();
		setUIMainView(view);
	}
}

// Initial loading

// Render the initial view from an xhr response
function renderInitialView(xhr) {
	let view = (xhr.responseText === "{}") ? "add-words" : "review";
	setUIMainView(view);
}
UIMain.addEventListener("load", requestFlashCards(renderInitialView));

