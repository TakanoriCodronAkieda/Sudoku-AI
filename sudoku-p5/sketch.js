const removeButton = document.querySelector('#removeButton');
const clearButton = document.querySelector('#clearButton');
const solveButton = document.querySelector('#solveButton');
const digitButtons = document.querySelectorAll('.digit');

const dimension = 600;
const cell_size = dimension / 9;
let board;

removeButton.addEventListener('click', () => {
    board.insert(board.current_selected[0], board.current_selected[1], 0);
});

clearButton.addEventListener('click', () => {
    board = new Board();
});

solveButton.addEventListener('click', () => {
    board.easy_solve();
});

const state = [[0, 0, 3, 0, 0, 8, 0, 0, 4],
               [1, 2, 6, 0, 0, 4, 0, 7, 0],
               [8, 0, 7, 0, 1, 0, 2, 3, 0],
               [5, 6, 0, 2, 8, 0, 0, 0, 0],
               [0, 0, 0, 3, 0, 7, 0, 0, 0],
               [0, 0, 0, 0, 5, 6, 0, 2, 8],
               [0, 9, 5, 0, 6, 0, 4, 0, 7],
               [0, 1, 0, 8, 0, 0, 3, 9, 2],
               [7, 0, 0, 9, 0, 0, 1, 0, 0]];

for (let button of digitButtons) {
    button.addEventListener('click', function() {
        board.insert(board.current_selected[0], board.current_selected[1], parseInt(this.id[this.id.length - 1]));
    });
}

function count(array, element) {
    let hm = 0;
    for (let item of array) {
        if (item == element) {
            hm ++;
        }
    }
    return hm;
}

function mouseClicked() {
    if (mouseX >= 0 && mouseX <= dimension && mouseY >= 0 && mouseY <= dimension) {
        board.current_selected = [Math.floor(mouseX / cell_size), Math.floor(mouseY / cell_size)];
    }
}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        board.current_selected[1] = (board.current_selected[1] + 8) % 9;
    } else if (keyCode == DOWN_ARROW) {
        board.current_selected[1] = (board.current_selected[1] + 1) % 9;
    } else if (keyCode == RIGHT_ARROW) {
        board.current_selected[0] = (board.current_selected[0] + 1) % 9;
    } else if (keyCode == LEFT_ARROW) {
        board.current_selected[0] = (board.current_selected[0] + 8) % 9;
    }
}

function setup() {
    createCanvas(dimension, dimension);
    noFill();
    stroke(0);
    board = new Board(state);
}

function draw() {
    background(255);
    board.show();
}

