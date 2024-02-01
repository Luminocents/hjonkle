const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

 
var players = {};
 
io.on('connection', (socket) => {
    // get the socket ip and assign it to the player with a unique id
    players[socket.handshake.address] = {
        playerId: socket.id,
        playerSocket: socket,
        x: 10,
        y: 10,
    };
    
});

/*function getLongestConnectedPlayer() {
    let longestConnectedPlayer = null;
    let earliestConnectionTime = Infinity;

    for (let id in players) {
        if (players[id].connectionTime < earliestConnectionTime) {
            earliestConnectionTime = players[id].connectionTime;
            longestConnectedPlayer = players[id];
        }
    }

    return longestConnectedPlayer;
} */

// Set the view engine to
app.set('view engine', 'ejs');
// Serve static files from the "public"
app.use(express.static('public'));
// Render the index.ejs
app.get('/', (req, res) => { res.render('index'); });
// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');


    socket.on('keydown', (data) => {
        if (data.key == 'w') {
            players[socket.handshake.address].keyW = true;
        } else if (data.key == 'a') {
            players[socket.handshake.address].keyA = true;
        } else if (data.key == 's') {
            players[socket.handshake.address].keyS = true;
        } else if (data.key == 'd') {
            players[socket.handshake.address].keyD = true;
        }

    });

    socket.on('keyup', (data) => {
        if (data.key == 'w') {
            players[socket.handshake.address].keyW = false;
        } else if (data.key == 'a') {
            players[socket.handshake.address].keyA = false;
        } else if (data.key == 's') {
            players[socket.handshake.address].keyS = false;
        } else if (data.key == 'd') {
            players[socket.handshake.address].keyD = false;
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        io.emit('playerDisconnected', { playerId: players[socket.handshake.address].playerId });
        delete players[socket.handshake.address];
    });

    /*socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete players[socket.id];
    
        // Update the longest connected player
        let longestConnectedPlayer = getLongestConnectedPlayer();
        // Do something with longestConnectedPlayer...
    }); */
});





// game loop
setInterval(step, 1000 / 1000);
 
function step() {
    let tempPlayerList = {};

    // for every player, read their keys presses and move them accordingly
    for (var i in players) {
        let player = players[i];
        let speed = 1; // Set the default speed to 1

        // Check for diagonal movement
        if ((player.keyW || player.keyS) && (player.keyA || player.keyD)) {
            speed = 0.7071; // Set the speed to 0.7071 (approx. 1/sqrt(2))
        }

        if (player.keyW) {
            player.y -= speed;
        }
        if (player.keyA) {
            player.x -= speed;
        }
        if (player.keyS) {
            player.y += speed;
        }
        if (player.keyD) {
            player.x += speed;
        }

        // add the player to the temp player list
        tempPlayerList[player.playerId] = {
            x: player.x,
            y: player.y,
            playerId: player.playerId
        };
    }

    // for every player in the player list
    for (var i in players) {
        let player = players[i];
        // send the player's position to the client
        player.playerSocket.emit('update', { players: tempPlayerList });
    }
}




// Start the
http.listen(3000, () => { console.log('Server is running on http://localhost:3000'); });

/*
index.js: const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
 
 
var players = {};
 
io.on('connection', (socket) => {
    console.log('a user connected');
    // get the socket ip and assign it to the player with thier socket id
    players[socket.handshake.address] = {
        playerId: socket.id,
        playerSocket: socket,
        x: 0,
        y: 0,
    };
});
// Set the view engine to
app.set('view engine', 'ejs');
// Serve static files from the "public"
app.use(express.static('public'));
// Render the index.ejs
app.get('/', (req, res) => { res.render('index'); });
// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');
 
 
    socket.on('keydown', (data) => {
        if (data.key == 'w') {
            players[socket.handshake.address].keyW = true;
        } else if (data.key == 'a') {
            players[socket.handshake.address].keyA = true;
        } else if (data.key == 's') {
            players[socket.handshake.address].keyS = true;
        } else if (data.key == 'd') {
            players[socket.handshake.address].keyD = true;
        }
 
    });
 
    socket.on('keyup', (data) => {
        if (data.key == 'w') {
            players[socket.handshake.address].keyW = false;
        } else if (data.key == 'a') {
            players[socket.handshake.address].keyA = false;
        } else if (data.key == 's') {
            players[socket.handshake.address].keyS = false;
        } else if (data.key == 'd') {
            players[socket.handshake.address].keyD = false;
        }
 
 
 
 
 
        socket.on('keyup', (data) => {
            console.log('A user released a key');
            console.log(data);
        });
        // Handle socket events here    
        socket.on('disconnect', () => {
            console.log('A user disconnected');
            delete players[socket.handshake.address];
        });
    });
 
});
// game loop
setInterval(step, 1000 / 1000);
 
function step() {
 
 
let tempPlayerList = {};
 
    // for every player, read their keys presses and move them accordingly
    for (var i in players) {
        let player = players[i];
        if (player.keyW) {
            player.y -= 1;
        }
        if (player.keyA) {
            player.x -= 1;
        }
        if (player.keyS) {
            player.y += 1;
        }
        if (player.keyD) {
            player.x += 1;
        }
        // add the player to the temp player list
        tempPlayerList[player.playerId] = {};
        tempPlayerList[player.playerId].x = player.x;
        tempPlayerList[player.playerId].y = player.y;
        tempPlayerList[player.playerId].playerId = player.playerId;
 
    }
 
 
    // for every player in the player list
    for (var i in players) {
        let player = players[i];
        // send the player's position to the client
        player.playerSocket.emit('update', { players: tempPlayerList});
    }
}
 
 
 
 
// Start the
http.listen(3000, () => { console.log('Server is running on http://localhost:3000'); }); */ 