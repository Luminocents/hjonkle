const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:http');

const app = express();
const server = createServer(app);

const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const { Server } = require('socket.io');
const io = new Server(server);


function loggedIn(req, res, next) {
    let user = req.query.user;
    if (user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Define a route
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Express with EJS' });
});

app.get('/game', loggedIn, (req, res) => {
    let user = req.query.user;
    res.render('game', { title: 'Welcome to Express with EJS', user });
});


let users = {};

// map
const MAP_SIZE = 32;
const MAP_SCALE = 128;
const MAP_RANGE = MAP_SCALE * MAP_SIZE;
const MAP_SPEED = (MAP_SCALE / 2) / 10;

io.on('connection', (socket) => {
    users[socket.id] = {
        name: 'unknown',
        userId: socket.id,
        // player
        playerSocket: socket,
        playerX: MAP_SCALE + 20,
        playerY: MAP_SCALE + 20,
        playerAngle: Math.PI / 3,
        playerMoveX: 0,
        playerMoveY: 0,
        playerMoveAngle: 0,
        canvasWidth: 800,
        canvasHeight: 600,
    }

    socket.on('new-user', (data) => {
        console.log('New name connected: ' + data.name);
        users[socket.id].name = data.name;
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete users[socket.id];
        console.log('')
    });

    socket.on('resize', (data) => {
        users[socket.id].canvasWidth = data.canvasWidth;
        users[socket.id].canvasHeight = data.canvasHeight;
        users[socket.id].WIDTH = data.WIDTH;
        users[socket.id].HEIGHT = data.HEIGHT;
        users[socket.id].HALF_WIDTH = data.HALF_WIDTH;
        users[socket.id].HALF_HEIGHT = data.HALF_HEIGHT;
    });
});


io.on('connection', (socket) => {
    socket.on('keydown', (key) => {
        switch (key) {
            case 83: users[socket.id].playerMoveX = -1; users[socket.id].playerMoveY = -1; break; // s
            case 87: users[socket.id].playerMoveX = 1; users[socket.id].playerMoveY = 1; break; // w
            case 65: users[socket.id].playerMoveAngle = 1; break; // a
            case 68: users[socket.id].playerMoveAngle = -1; break; // d
        }
    });

    socket.on('keyup', (key) => {
        switch (key) {
            case 83: users[socket.id].playerMoveX = 0; users[socket.id].playerMoveY = 0; break; // s
            case 87: users[socket.id].playerMoveX = 0; users[socket.id].playerMoveY = 0; break; // w
            case 65: users[socket.id].playerMoveAngle = 0; break; // a
            case 68: users[socket.id].playerMoveAngle = 0; break; // d
        }
    });
});


setInterval(() => { step(); }, 1000 / 1000);

function step() {
    let tempUserList = {};

    for (var i in users) {
        let user = users[i];

        var playerAngle = Math.PI / 3;
        var playerX = MAP_SCALE + 20;
        var playerY = MAP_SCALE + 20;

        var playerMoveX = 0;
        var playerMoveY = 0;
        var playerMoveAngle = 0;

        // update player position
        var playerOffsetX = Math.sin(playerAngle) * MAP_SPEED;
        var playerOffsetY = Math.cos(playerAngle) * MAP_SPEED;
        var mapTargetX = Math.floor(playerY / MAP_SCALE) * MAP_SIZE + Math.floor((playerX + playerOffsetX * playerMoveX * 5) / MAP_SCALE)
        var mapTargetY = Math.floor((playerY + playerOffsetY * playerMoveY * 5) / MAP_SCALE) * MAP_SIZE + Math.floor(playerX / MAP_SCALE)

        if (playerMoveX && map[mapTargetX] == 0) playerX += playerOffsetX * playerMoveX;
        if (playerMoveY && map[mapTargetY] == 0) playerY += playerOffsetY * playerMoveY;
        if (playerMoveAngle) playerAngle += 0.06 * playerMoveAngle;

        // Calculate map & player offsets
        var mapOffsetX = Math.floor(user.canvasWidth / 2 - user.HALF_WIDTH);
        var mapOffsetY = Math.floor(user.canvasHeight / 2 - user.HALF_HEIGHT);
        var playerMapX = (playerX / MAP_SCALE) * 5 + mapOffsetX;
        var playerMapY = (playerY / MAP_SCALE) * 5 + mapOffsetY;

        console.log(
            'canvasWidth: ' + user.WIDTH,
            'playerX: ' + playerX,
            'playerY: ' + playerY,
            'playerAngle: ' + playerAngle,
            'playerMoveX: ' + playerMoveX,
            'playerMoveY: ' + playerMoveY,
            'playerMoveAngle: ' + playerMoveAngle,
            'mapTargetX: ' + mapTargetX,
            'mapTargetY: ' + mapTargetY,
            'mapOffsetX: ' + mapOffsetX,
            'mapOffsetY: ' + mapOffsetY,
            'playerMapX: ' + playerMapX,
            'playerMapY: ' + playerMapY,
        )
        // add the player to the temp player list
        tempUserList[user.userId] = {
            name: user.name,
            userId: user.userId,
            // Raycast stuff
            mapTargetX: mapTargetX,
            mapTargetY: mapTargetY,
            mapOffsetX: mapOffsetX,
            mapOffsetY: mapOffsetY,
            playerMapX: playerMapX,
            playerMapY: playerMapY,
            playerX: playerX,
            playerY: playerY,

        };
    }

    // for every player in the player list
    for (var i in users) {
        let user = users[i];
        // send the player's position to the client
        user.playerSocket.emit('update', { users: tempUserList });
    }
}




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});