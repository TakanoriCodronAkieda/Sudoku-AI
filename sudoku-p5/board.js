function Board(state) {
    if (!state) {
        this.state = Array.from(Array(9), () => new Array(9).fill(0));
    } else {
        this.state = [];
        for (let line of state) {
            this.state.push(line.slice());
        }
    }

    this.current_selected = [4, 4];

    this.show = function() {
        push(); 
        strokeWeight(1);
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                cell = this.state[y][x];
                rect(x * cell_size, y * cell_size, cell_size, cell_size);
                if (cell) {
                    fill(0);
                    textSize(cell_size);
                    text(cell, x * cell_size + cell_size / 4, y * cell_size + cell_size * 3.5 / 4);
                    fill(255);
                }
            }
        }
        fill(30, 30, 200, 150);
        rect(this.current_selected[0] * cell_size, this.current_selected[1] * cell_size, cell_size, cell_size);
        strokeWeight(3);
        line(cell_size * 3, 0, cell_size * 3, dimension);
        line(cell_size * 6, 0, cell_size * 6, dimension);
        line(0, cell_size * 3, dimension, cell_size * 3);
        line(0, cell_size * 6, dimension, cell_size * 6);
        line(dimension - 1, 0, dimension - 1, dimension);
        line(0, dimension - 1, dimension, dimension - 1);
        pop();
    }

    this.is_valid = function() {
        for (let y = 0; y < this.state.length; y++) {
            const line = this.get_line(y)
            for (let x = 0; x < this.state[y].length; x++) {
                const column = this.get_column(x);    
                const square = this.get_square(x, y);
                const cell = this.state[y][x]
                if (cell && (count(line, cell) > 1 || count(column, cell) > 1 || count(square, cell) > 1)) {
                    return false
                }
            }
        }
        return true;
    }

    this.is_win = function() {
        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state[i].length; j++) {
                if (!this.state[i][j]) {
                    return false;
                }
            }
        }
        return this.is_valid();
    }

    this.insert = function(x, y, digit) {
        this.state[y][x] = digit;
    }

    this.get_empty_cells = function() {
        const empties = [];
        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state[i].length; j++) {
                if (!this.state[i][j]) {
                    empties.push([j, i]);
                }
            }
        }
        return empties;
    }

    this.get_line = function(y) {
        return this.state[y].slice();
    }

    this.get_column = function(x) {
        const col = [];
        for (let i = 0; i < this.state.length; i++) {
            col.push(this.state[i][x]);
        }
        return col;
    }

    this.get_square = function(x, y) {
        const square = [];
        const square_x = Math.floor(x / 3) * 3;
        const square_y = Math.floor(y / 3) * 3;       
        for (let i = square_y; i < square_y + 3; i++) {
            for (let j = square_x; j < square_x + 3; j++) {
                square.push(this.state[i][j]);
            }
        }
        return square;
    }

    this.possible_digits = function(x, y) {
        const possibles = [];
        const line = this.get_line(y);
        const column = this.get_column(x);
        const square = this.get_square(x, y);
        for (let current_tested_number = 1; current_tested_number < 10; current_tested_number++) {
            if (!line.includes(current_tested_number) && !column.includes(current_tested_number) && !square.includes(current_tested_number)) {
                possibles.push(current_tested_number);
            }
        }
        return possibles;
    }

    this.easy_solve = function() {
        while (!this.is_win()) {
            for (let location of this.get_empty_cells()) {
                const possibles = this.possible_digits(location[0], location[1]);
                if (possibles.length == 1) {
                    this.insert(location[0], location[1], possibles[0]);
                }
            }
        }
    }
}
