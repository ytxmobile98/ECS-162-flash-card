"use strict";

import { currentFlashCard, makeRequest } from "./main.js";
import { requestTranslation } from "./translate.js";
import { requestToSave } from "./save-to-database.js";

function AddWordsPage(props) {
	
	setSwitchViewButton("review");
	
	function translate(event) {
		const queryBox = document.getElementById("js-query");
		const outputBox = document.getElementById("js-output");
		
		if (event.key === "Enter") {
			requestTranslation(event.target.value, queryBox, outputBox);
		}
	}
	
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
				<div className="flashcard__card" title="Press ENTER to translate">
					<input id="js-query" onKeyUp={translate} className="flashcard__textbox t-font--primary" type="text" autocomplete="off" placeholder="English" />
				</div>
				<div className="flashcard__card">
					<input id="js-output" className="flashcard__textbox t-font--primary" type="text" autocomplete="off" placeholder="Chinese 中文" readonly="readonly" />
				</div>
			</div>
			
			<p className="primary-action-button__par">
				<button id="js-save" onClick={saveToDatabase} className="ui-button primary-action-button t-font--primary">Save</button>
			</p>
		</div>
	);
}
	
function ReviewPage(props) {
	
	setSwitchViewButton("add-words");

	return (
		<div className="ui-main">
			<div className="flashcard__flexbox">
				<div className="flashcard__card flashcard__card--translation">
					<input className="flashcard__textbox t-font--primary" type="text" placeholder="Translation" readonly="readonly" />
					<img className="flashcard__flip-card-icon" src="icons/flip-card.svg" alt="Flip card" />
				</div>
			
				<div className="flashcard__card flashcard__card--english">
					<input  className="flashcard__textbox t-font--primary" type="text" placeholder="English" />
				</div>
			</div>
			
			<p className="primary-action-button__par">
				<button id="js-next" className="ui-button primary-action-button t-font--primary">Next</button>
			</p>
		</div>
	);
}


class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: "",
			flashCards: {},
		}
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
		switchViewButton.onclick = function () {
			setUIMainView("add-words");
		}
	}
	else {
		switchViewButton.textContent = "Start Review";
		switchViewButton.onclick = function () {
			setUIMainView("review");
		}
	}	
}

// Initial loading

UIMain.addEventListener("load", (function () {
	const xhr = new XMLHttpRequest();
	
	function renderInitialView() {
		let flashCards = JSON.parse(xhr.responseText);
		console.log(flashCards);
		
		let view = (xhr.responseText === "{}") ? "add-words" : "review";
		setUIMainView(view);
	}
	
	makeRequest(xhr, "/get-flash-cards", renderInitialView)
	
})());

