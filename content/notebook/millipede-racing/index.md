+++
title="Millipede Racing"
date=2025-07-02
draft=false
+++

<div id="game-container" style="font-family: monospace; white-space: pre"></div>

<script>
const width = 40;
const height = 20;
let board = Array(height).fill().map(() => Array(width).fill(' '));
let millipede = [{x: 5, y: 10}];
let direction = {x: 1, y: 0};
let food = {x: 15, y: 10};
let score = 0;
let gameLoop;

function drawBoard() {
    let display = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x === food.x && y === food.y) {
                display += '*';
            } else if (millipede.some(segment => segment.x === x && segment.y === y)) {
                let index = millipede.findIndex(segment => segment.x === x && segment.y === y);
                if (index === 0) {
                    display += '{';
                } else {
                    display += '|';
                }
            } else {
                display += ' ';
            }
        }
        display += '\n';
    }
    document.getElementById('game-container').textContent = `Score: ${score}\n` + display;
}

function moveMillipede() {
    let newHead = {
        x: (millipede[0].x + direction.x + width) % width,
        y: (millipede[0].y + direction.y + height) % height
    };
    
    if (newHead.x === food.x && newHead.y === food.y) {
        millipede.unshift(newHead);
        score++;
        food = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
    } else {
        millipede.unshift(newHead);
        millipede.pop();
    }
    
    drawBoard();
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (direction.y !== 1) direction = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = {x: 1, y: 0};
            break;
    }
});

// Start game
gameLoop = setInterval(moveMillipede, 100);
drawBoard();
</script>

<style>
#game-container {
    background: #000;
    color: #0f0;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
}
</style>








