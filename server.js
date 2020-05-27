// Including libraries
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT);
var io = require('socket.io')(server);

var highScore = 0;
var User;
const http = require('http');
// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)

db.defaults({highscore: [
      {"num":0}
    ]
  }).write();

// Routing
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/play.html", function (request, response) {
  response.sendFile(__dirname + '/views/play.html');
});

app.get("/freestyle.html", function (request, response) {
  response.sendFile(__dirname + '/views/freestyle.html');
});

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {
	// Start listening for mouse move events
	socket.on('highscore', function (data) {
    if(data.num > getHighScore()){
      highScore = data.num
      updateHighscore(highScore)
    
    }
		// This line sends the event (broadcasts it)
		// to everyone.
		io.emit('updateHighScore', {num:getHighScore()});
	});
});

function updateHighscore(updateTo){
        console.log(db);
          db.get('highscore')
        .remove()
        .write()
  
      db.get('highscore')
      .push({ num: updateTo})
      .write()
       console.log(db);

}

function getHighScore(){
  console.log(db);
  var hi = db.get('highscore').value() // Find all users in the collection
  console.log(hi[0].num);

  return hi[0].num
      
}