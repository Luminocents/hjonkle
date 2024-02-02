const express = require('express');
const { get } = require('http');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var players = {};

io.on('connection', (socket) => {
    // Get the socket id and assign it to the player
    players[socket.handshake.address] = {
        playerId: socket.id,
        playerSocket: socket,
        x: 10,
        y: 10,
        connectionTime: Date.now() // Store the connection time
    };
    // Update the longest connected player
    let longestConnectedPlayer = getLongestConnectedPlayer();
    io.emit('longestConnectedPlayer', { playerId: longestConnectedPlayer.playerId });
});

function getLongestConnectedPlayer() {
    let longestConnectedPlayer = null;
    let earliestConnectionTime = Infinity;

    for (let id in players) {
        if (players[id].connectionTime < earliestConnectionTime) {
            earliestConnectionTime = players[id].connectionTime;
            longestConnectedPlayer = players[id];
        }
    }

    return longestConnectedPlayer;
}

// Set the view engine to
app.set('view engine', 'ejs');
// Serve static files from the "public"
app.use(express.static('public'));
// Render the index.ejs
app.get('/', (req, res) => { res.render('index'); });
// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected' + socket.handshake.address);


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
        
        // Update the longest connected player
        longestConnectedPlayer = getLongestConnectedPlayer();
        
        io.emit('longestConnectedPlayer', { playerId: longestConnectedPlayer.playerId });
        
        console.log(longestConnectedPlayer.connectionTime);
        // Do something with longestConnectedPlayer...
        delete players[socket.handshake.address];
    });
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

        if (player.keyW && player.y > -50) {
            player.y -= speed;
        }
        if (player.keyA && player.x > -130) {
            player.x -= speed;
        }
        if (player.keyS && player.y < 780) {
            player.y += speed;
            console.log(player.y)
        }
        if (player.keyD && player.x < 1740) {
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




// Start the server
http.listen(3000, () => { console.log('Server is running on http://localhost:3000'); });