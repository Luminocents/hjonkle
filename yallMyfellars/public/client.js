// start scoket.io connection
const socket = io();
const textColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
let username = prompt('What is your name?');
while (username == null || username == '' || username == undefined || username.length > 25) {
    if (username == null || username == '' || username == undefined) {
        alert('Enter something nerd');
    } else if (username.length > 25) {
        alert('Name too long bro');
    }
    username = prompt('What is your name?');
}

pause.addEventListener('click', () => {
    if (audio.muted) {
        audio.muted = false;
        pause.innerHTML = 'Mute';
    } else if (!audio.muted) {
        audio.muted = true;
        pause.innerHTML = 'Unmute';
    }
});

if (socket.id == longest) {
    // Random music
    playRan.addEventListener('click', () => {
        for (let i = 0; i < music.length; i++) {
            let duh = 1;
            let prevSong;
            if (duh == -1) {
                prevSong = audio.src;
            }
            let rand = Math.floor(Math.random() * music.length);

            if (audio.src == music[rand]) {
                rand = Math.floor(Math.random() * music.length);
            } else if (audio.src == prevSong) {
                rand = Math.floor(Math.random() * music.length);
            }
            audio.src = music[rand];
            audio.play().catch(() => void 0);
        }
    });
} 


socket.emit('setUsername', { username: username, textColor: textColor });
// get variable name and send it to the server to be assigned to the player who set it



const jerm = new Image();
jerm.src = 'jermaStare.png';

const rat = new Image();
rat.src = 'rat.png';

const ratFlip = new Image();
ratFlip.src = 'ratFlip.png';

const wood = new Image();
wood.src = 'wood.png';

const square = new Image();
square.src = 'squareFade.png';

const beam = new Image();
beam.src = 'beam.png';

const beam2 = new Image();
beam2.src = 'beam2.png';

const beamFlip = new Image();
beamFlip.src = 'beamFlip.png';

const beam2Flip = new Image();
beam2Flip.src = 'beam2Flip.png';

var players = {};
var longest;

let img = "rat.png";
let switcher;
let counter = 0;
let flip = false;

// get canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

sc1 = window.innerWidth / 1920;
sc2 = window.innerHeight / 1080;


ctx.canvas.width = 1920 * sc1;
ctx.canvas.height = 1920 * sc1;
ctx.scale(sc1, sc2);

let music = []
music.push('The Giant Enemy Spider (Remix) By Fluxxy.mp3');
music.push('party rock anthem low quality.mp3')
music.push('Funky Town but its low quality.mp3');
music.push('happy but its even lower quality.mp3');
music.push('Hey Ya! Low quality.mp3');
music.push('Never Gonna Give You Up in low quality.mp3');
music.push('Minecraft Cave Ambience.mp3');

// read wasd keys being pressed and released
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

// handle key down events
function handleKeydown(event) {
    const key = event.key;

    // emit the key event to teh server
    socket.emit('keydown', { key });
}

// handle key up events
function handleKeyup(event) {
    const key = event.key;

    // emit the key event to teh server
    socket.emit('keyup', { key });
}


socket.on('playerDisconnected', (data) => {
    // Remove the disconnected player from the local player list
    delete players[data.playerId];
});

// get socket message for update
socket.on('update', function (data) {

    ctx.clearRect(0, 0, 1920, 1080);
    for (var player in data.players) {
        players[player] = data.players[player];
    }


});

socket.on('longestConnectedPlayer', function (data) {
    longest = data.playerId;
});



let dead = false;
let once;
let rats = false;

// on reqestanimationfroame, erease canvs
requestAnimationFrame(draw);
function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(square, 0, -200, window.innerWidth * 2, window.innerHeight)
    ctx.drawImage(wood, 0, 980, window.innerWidth * 2, window.innerHeight / 5);
    for (var player in players) {
        const pointsDiv = document.getElementById('points');
        if (dead) {
            deadGod.play();
        }
        
        // update the pointsDiv with every player's points
        pointsDiv.innerHTML = '';
        for (const playerId in players) {
            const playerPoints = players[playerId].points;
            const playerPointsElement = document.createElement('div');
            playerPointsElement.textContent = '';
            if (playerId == longest) {
                playerPointsElement.style.color = 'red';
                playerPointsElement.innerHTML += '(KING)';
            }
            playerPointsElement.textContent += `${players[playerId].username}: ${playerPoints}`;
            pointsDiv.appendChild(playerPointsElement);
        }

        
        
        const { x, y } = players[player];
        // draw a circle at the recieved positon
        ctx.beginPath();
        if (players[player].playerId != longest) {
            ctx.rect(x, y - 30, players[player].health * 3, 25);
            ctx.fillStyle = players[player].textColor;
            ctx.fill();

            if (players[player].left) {
                ctx.drawImage(rat, x, y, rat.width / 1.25, rat.height / 1.5);
                last = true;
            } else if (players[player].right) {
                ctx.drawImage(ratFlip, x, y, rat.width / 1.25, rat.height / 1.5);
                last = false;
            } else {
                ctx.drawImage(rat, x, y, rat.width / 1.25, rat.height / 1.5);
            }
            


            ctx.font = "60px Arial";
            ctx.fillText(players[player].username + ": " + players[player].points, x + 5, y - 50, rat.width / 1.25, rat.height / 1.5);
        }



        if (players[player].playerId == longest) {
            if (players[player].health <= 1 && once) {
                dead = true;
                once = false;
            } else if (players[player].health > 0) {
                dead = false;
                once = true;
            }
            ctx.drawImage(jerm, x, 0, jerm.width, jerm.height);
            ctx.rect(x - 40, 0, players[player].health * 3, 25);
            ctx.fillStyle = 'red';
            ctx.fill();

            if (players[player].beam) {
                counter += 1;
                if (counter > 50) {
                    counter = 0;
                    switcher = !switcher;
                }
                if (players[player].left)
                    flip = false;
                else if (players[player].right)
                    flip = true;

                if (switcher) {
                    if (flip) {
                        ctx.drawImage(beamFlip, x + 80, 250, beam.width / 1.25, beam.height / 1.405);
                    } else {
                        ctx.drawImage(beam, x + 80, 250, beam.width / 1.25, beam.height / 1.405);
                    }
                } else {
                    if (flip) {
                        ctx.drawImage(beam2Flip, x + 80, 250, beam.width / 1.25, beam.height / 1.405);
                    } else {
                        ctx.drawImage(beam2, x + 80, 250, beam.width / 1.25, beam.height / 1.405);
                    }
                }
            }
        }

    }
    requestAnimationFrame(draw);
}