
dumpDB() {
    db.all ( 'SELECT * FROM flashcards', dataCallback);
    function dataCallback( err, data ) {console.log(data)}
}
