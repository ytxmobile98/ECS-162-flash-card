"use strict";

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const dbFile = "Flashcards.db";
module.exports.db = new sqlite3.Database(dbFile); // this is the actual database object; will be exported for manipulating records


