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
				<input ref={this.outputBox} value={this.props.value} className="flashcard__textbox t-font--primary" type="text" autocomplete="off" placeholder="Chinese 中文" readonly="readonly" />
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
				<img onClick={this.props.onFlipCard} className="flashcard__flip-card-icon" src="icons/flip-card.svg" alt="Flip card" />
				<input ref={this.reviewTranslationBox} className="flashcard__textbox t-font--primary" type="text" value={this.props.value} placeholder="Translation" readonly="readonly" />
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

// Button components

class Button extends React.Component {
}

class PrimaryActionButton extends Button {
	constructor(props) {
		super(props);
		this.button = React.createRef();
	}
	
	render() {
		return (
			<button ref={this.button} onClick={this.props.onClick} className="ui-button primary-action-button t-font--primary">{this.props.text}</button>
		);
	}
}


// Page components

class Page extends React.Component {
}

class AddWordsPage extends Page {
	
	constructor(props) {
		super(props);
		
		this.state = {
			currentFlashCard: currentFlashCard
		}
		
		this.queryCard = React.createRef();
		this.outputCard = React.createRef();
		this.saveButton = React.createRef();
	}
	
	translate(event) {
		
		function handleTranslation(flashCard) {
			this.setState(function (prevState) {
				return {
					currentFlashCard: flashCard
				}
			});
		}
		
		if (event.key === "Enter") {
			requestTranslation(event.target.value, handleTranslation.bind(this));
		}
	}
	
	saveToDatabase() {
		try {
			requestToSave(currentFlashCard);
		}
		catch (error) {
			console.log(error);
		}
	}
	
	
	render() {
		
		setSwitchViewButton("review");
		
		
		return (
			<div className="ui-main">
				<div className="flashcard__flexbox">
					<QueryCard ref={this.queryCard} onPressEnter={this.translate.bind(this)} />
					<OutputCard ref={this.outputCard} value={this.state.currentFlashCard.Chinese} />
				</div>
				
				<p className="primary-action-button__par">
					<PrimaryActionButton ref={this.saveButton} onClick={this.saveToDatabase} text="Save" />
				</p>
			</div>
		);
	}
}
	
class ReviewPage extends Page {
	
	constructor(props) {
		super(props);
		this.state = {
			cardOnDisplay: {},
		}
		
		this.reviewTranslationCard = React.createRef();
		this.answerCard = React.createRef();
		this.nextCardButton = React.createRef();
		
	}
	
	displayNextCard() {
		
		this.setState(function (prevState){
			return {
				cardOnDisplay: getNextCard(),
			}
		});
		
		
		this.setState(function (prevState) {
			const cardOnDisplay = prevState.cardOnDisplay;
			let Chinese = cardOnDisplay.Chinese;
			
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
	
	componentDidMount() {
		const nextCardButton = this.nextCardButton.current.button.current;
		nextCardButton.click();
	}
	
	render() {
		
		setSwitchViewButton("add-words");
	
		return (
			<div className="ui-main">
				<div className="flashcard__flexbox">
					<ReviewTranslationCard ref={this.reviewTranslationCard} value={this.state.cardOnDisplay.Chinese} onFlipCard={this.flipCard.bind(this)} />
					<AnswerCard ref={this.answerCard} />
				</div>
				
				<p className="primary-action-button__par">
					<PrimaryActionButton ref={this.nextCardButton} onClick={this.displayNextCard.bind(this)} text="Next" />
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

