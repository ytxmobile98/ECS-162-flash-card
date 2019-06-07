"use strict";

import { currentFlashCard, makeRequest } from "./main.js";
import { requestTranslation } from "./translate.js";
import { requestToSave } from "./save-to-database.js";
import { requestFlashCards, getNextCard } from "./review-words.js";

// Card Components

class Card extends React.Component {}

class QueryCard extends Card {
	constructor(props) {
		super(props);
		this.queryBox = React.createRef();
	}

	render() {
		return React.createElement(
			"div",
			{ className: "flashcard__card", title: "Press ENTER to translate" },
			React.createElement("input", { ref: this.queryBox, className: "flashcard__textbox t-font--primary", type: "text", autocomplete: "off", placeholder: "English", onKeyUp: this.props.onPressEnter })
		);
	}
}

class OutputCard extends Card {
	constructor(props) {
		super(props);
		this.outputBox = React.createRef();
	}

	render() {
		return React.createElement(
			"div",
			{ className: "flashcard__card" },
			React.createElement("input", { ref: this.outputBox, className: "flashcard__textbox t-font--primary", type: "text", autocomplete: "off", placeholder: "Chinese \u4E2D\u6587", readonly: "readonly" })
		);
	}
}

class ReviewTranslationCard extends Card {
	constructor(props) {
		super(props);
		this.reviewTranslationBox = React.createRef();
	}

	render() {
		return React.createElement(
			"div",
			{ className: "flashcard__card flashcard__card--translation" },
			React.createElement("input", { ref: this.reviewTranslationBox, className: "flashcard__textbox t-font--primary", type: "text", placeholder: "Translation", readonly: "readonly" }),
			React.createElement("img", { onClick: this.props.onFlipCard, className: "flashcard__flip-card-icon", src: "icons/flip-card.svg", alt: "Flip card" })
		);
	}
}

class AnswerCard extends Card {
	constructor(props) {
		super(props);
		this.answerBox = React.createRef();
	}

	render() {
		return React.createElement(
			"div",
			{ className: "flashcard__card flashcard__card--english" },
			React.createElement("input", { ref: this.answerBox, className: "flashcard__textbox t-font--primary", type: "text", placeholder: "English" })
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
			} catch (error) {
				console.log(error);
			}
		}

		return React.createElement(
			"div",
			{ className: "ui-main" },
			React.createElement(
				"div",
				{ className: "flashcard__flexbox" },
				React.createElement(QueryCard, { ref: this.queryCard, onPressEnter: this.translate.bind(this) }),
				React.createElement(OutputCard, { ref: this.outputCard })
			),
			React.createElement(
				"p",
				{ className: "primary-action-button__par" },
				React.createElement(
					"button",
					{ id: "js-save", onClick: saveToDatabase, className: "ui-button primary-action-button t-font--primary" },
					"Save"
				)
			)
		);
	}
}

class ReviewPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cardOnDisplay: {}
		};
		this.reviewTranslationCard = React.createRef();
		this.answerCard = React.createRef();
	}

	displayNextCard() {

		this.setState(function (prevState) {
			return {
				cardOnDisplay: getNextCard()
			};
		});

		this.setState(function (prevState) {
			const cardOnDisplay = prevState.cardOnDisplay;
			const translation = this.reviewTranslationCard.current.reviewTranslationBox.current;
			let Chinese = cardOnDisplay.Chinese;
			translation.value = Chinese;

			const xhr = new XMLHttpRequest();
			makeRequest(xhr, `/update-seen?Chinese=${Chinese}`, function () {
				console.log(xhr.response);
				requestFlashCards();
			});
		});
	}

	checkCorrect(answer) {
		const cardOnDisplay = this.state.cardOnDisplay;
		let EnglishWords = cardOnDisplay.details.English;
		let isCorrect = !!EnglishWords && EnglishWords.includes(answer);

		if (isCorrect) {
			const translation = this.reviewTranslationCard.current.reviewTranslationBox.current;
			let Chinese = translation.value;

			const xhr = new XMLHttpRequest();
			makeRequest(xhr, `/update-correct?Chinese=${Chinese}`, function () {
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

		return React.createElement(
			"div",
			{ className: "ui-main" },
			React.createElement(
				"div",
				{ className: "flashcard__flexbox" },
				React.createElement(ReviewTranslationCard, { ref: this.reviewTranslationCard, onFlipCard: this.flipCard.bind(this) }),
				React.createElement(AnswerCard, { ref: this.answerCard })
			),
			React.createElement(
				"p",
				{ className: "primary-action-button__par" },
				React.createElement(
					"button",
					{ id: "js-next", onClick: this.displayNextCard.bind(this), className: "ui-button primary-action-button t-font--primary" },
					"Next"
				)
			)
		);
	}
}

class View extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.flashCards === "{}" || this.props.switchTo === "add-words") {
			return React.createElement(AddWordsPage, null);
		} else {
			return React.createElement(ReviewPage, null);
		}
	}
}

const UIMain = document.getElementById("js-ui-main");

function setUIMainView(view) {
	document.body.setAttribute("data-js-current-view", view);
	ReactDOM.render(React.createElement(View, { switchTo: view }), UIMain);
	if (view === "review") {
		const nextWordButton = document.getElementById("js-next");
		nextWordButton.click();
	}
}

function setSwitchViewButton(view) {
	const switchViewButton = document.getElementById("js-switch-view-button");

	if (view === "add-words") {
		switchViewButton.textContent = "Add";
	} else {
		switchViewButton.textContent = "Start Review";
	}

	switchViewButton.onclick = function () {
		requestFlashCards();
		setUIMainView(view);
	};
}

// Initial loading

// Render the initial view from an xhr response
function renderInitialView(xhr) {
	let view = xhr.responseText === "{}" ? "add-words" : "review";
	setUIMainView(view);
}
UIMain.addEventListener("load", requestFlashCards(renderInitialView));