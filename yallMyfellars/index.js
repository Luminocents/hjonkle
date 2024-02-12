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
        gravity: 1,
        health: 100,
        beam: false,
        points: 0,
        username: null,
        textColor: 'black',
        connectionTime: Date.now() // Store the connection time
    };
    // Update the longest connected player
    let longestConnectedPlayer = getLongestConnectedPlayer();
    io.emit('longestConnectedPlayer', { playerId: longestConnectedPlayer.playerId });
    socket.on('setUsername', (data) => {
        players[socket.handshake.address].username = data.username;
        players[socket.handshake.address].textColor = data.textColor;
    });
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
        if (data.key == 'a') {
            players[socket.handshake.address].keyA = true;
        } else if (data.key == 'd') {
            players[socket.handshake.address].keyD = true;
        } else if (data.key == ' ') {
            players[socket.handshake.address].keySpace = true;
        }

    });

    socket.on('keyup', (data) => {
        if (data.key == 'a') {
            players[socket.handshake.address].keyA = false;
        } else if (data.key == 'd') {
            players[socket.handshake.address].keyD = false;
        } else if (data.key == ' ') {
            players[socket.handshake.address].keySpace = false;
        }

    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        io.emit('playerDisconnected', { playerId: players[socket.handshake.address].playerId });

        // Update the longest connected player
        longestConnectedPlayer = getLongestConnectedPlayer();

        io.emit('longestConnectedPlayer', { playerId: longestConnectedPlayer.playerId });

        // Do something with longestConnectedPlayer...
        delete players[socket.handshake.address];
    });
});





// game loop
setInterval(step, 1000 / 1000);

let floor = 890;

function step() {
    let tempPlayerList = {};

    // for every player, read their keys presses and move them accordingly
    for (var i in players) {
        longestConnectedPlayer = getLongestConnectedPlayer();
        let onFloor = true;
        let player = players[i];
        let speed = 3; // Set the default speed to 1

        if (player.y < floor) {
            onFloor = false;
        } else {
            onFloor = true;
        }

        if (player.playerId != longestConnectedPlayer.playerId) {
            speed *= 2; // Faster rat speed
            if (onFloor && player.keySpace) {
                player.y -= 1;
                player.gravity = -18;
            }

            if (player.gravity < 10) {
                player.gravity += .2;
            }

            if (player.y < floor) {
                player.y += player.gravity;
            }
            if (player.keyA && player.x > -5) {
                player.x -= speed;
            }
            if (player.keyD && player.x < 1660) {
                player.x += speed;
            }

            if (player.x > longestConnectedPlayer.x - 150 &&
                player.x < longestConnectedPlayer.x + 100 && longestConnectedPlayer.beam == true) {
                // Collision detected
                // Handle collision logic here
                // For example, decrease health of longestConnectedPlayer
                if (player.health > 0) {
                    player.health -= .5;

                } else {
                    player.x = 10;
                    player.y = 10;
                    player.health = 100;
                    longestConnectedPlayer.points += 1;
                    console.log(longestConnectedPlayer.points)

                }
            }

            if (player.x < longestConnectedPlayer.x + 50 &&
                player.x + 150 > longestConnectedPlayer.x &&
                player.y < 200) {
                // Collision detected
                // Handle collision logic here
                if (player.health < 100) {
                    player.health += .5;
                }
                if (longestConnectedPlayer.health > 0) {
                    longestConnectedPlayer.health -= .2;
                } else {
                    player.points += 5;
                    longestConnectedPlayer.x = 10;
                    longestConnectedPlayer.y = 10;
                    longestConnectedPlayer.health = 100;

                    longestConnectedPlayer.connectionTime = Date.now();
                    longestConnectedPlayer = getLongestConnectedPlayer();
                    io.emit('longestConnectedPlayer', { playerId: longestConnectedPlayer.playerId });

                }
            }
        }

        if (player.playerId == longestConnectedPlayer.playerId) {
            if (player.keyA && player.x - 100 > -85) {
                player.x -= speed;
            }
            if (player.keyD && player.x + 80 < 1740) {
                player.x += speed;
            }
            if (player.keySpace) {
                longestConnectedPlayer.beam = true;
            } else {
                longestConnectedPlayer.beam = false
            }

        }

        // add the player to the temp player list
        tempPlayerList[player.playerId] = {
            x: player.x,
            y: player.y,
            health: player.health,
            beam: player.beam,
            left: player.keyA,
            right: player.keyD,
            points: player.points,
            username: player.username,
            textColor: player.textColor,
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