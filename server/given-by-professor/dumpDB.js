"use strict";

dumpDB() {
	function dataCallback(err, data) {
		console.log(data);
	}
	db.all ( 'SELECT * FROM flashcards', dataCallback);
}
