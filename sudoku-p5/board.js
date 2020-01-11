function hasSubArray(master, sub) {
    for (elem of master) {
        var contains = true;
        if (sub.length != elem.length) {
            contains = false;
            continue;
        }
        for (let i = 0; i < sub.length; i++) {
            if (sub[i] != elem[i]) {
                contains = false;
                break;
            }
        }
        if (contains) {
            return true;
        }
    }
    return false;
}

function Board(state) {
    if (!state) {
        state = Array.from(Array(9), () => new Array(9).fill(null));
    } 

    this.state = [];
    for (let i = 0; i < 9; i++) {
        this.state.push([]);
        for (let j = 0; j < 9; j++) {
            this.state[i].push(new Cell(j, i, state[i][j]));
        }
    }

    this.current_selected = [4, 4];

    this.show = function() {
        push(); 
        strokeWeight(1);
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                this.state[y][x].show();
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

    this.next = function(x, y) {
        if (x == 8 && y == 8) {
            return false;
        } else if (x == 8) {
            return [0, y + 1];
        }
        return [x + 1, y];
    }

    this.next_empty = function(x, y) {
        let n = this.next(x, y);
        const empties = this.get_empty_cells();
        while (!hasSubArray(empties, n)) {
            if (!n) {
                return false;
            }
            n = this.next(n[0], n[1]);
        }
        return n;
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
                if (!this.state[i][j].value) {
                    return false;
                }
            }
        }
        return this.is_valid();
    }

    this.insert = function(x, y, digit) {
        // Adds a digit if it is not there yet else removes it
        if (this.state[y][x].value == digit) {
            this.state[y][x].value = null;
        } else {
            this.state[y][x].value = digit;
        }
    }

    this.add_note = function(x, y, note) {
        // Adds a note if the note is not there yet else removes it
        if (!this.state[y][x].notes.includes(note)) {
            this.state[y][x].notes.push(note);
        } else {
            const index = this.state[y][x].notes.indexOf(note);
            this.state[y][x].notes.splice(index, 1);
        }
    }

    this.get_empty_cells = function() {
        const empties = [];
        for (let i = 0; i < this.state.length; i++) {
            for (let j = 0; j < this.state[i].length; j++) {
                if (!this.state[i][j].value) {
                    empties.push([j, i]);
                }
            }
        }
        return empties;
    }

    this.get_line = function(y) {
        const line = [];
        for (let i = 0; i < 9; i++) {
            line.push(this.state[y][i].value);
        }
        return line;
    }

    this.get_column = function(x) {
        const col = [];
        for (let i = 0; i < this.state.length; i++) {
            col.push(this.state[i][x].value);
        }
        return col;
    }

    this.get_square = function(x, y) {
        const square = [];
        const square_x = Math.floor(x / 3) * 3;
        const square_y = Math.floor(y / 3) * 3;       
        for (let i = square_y; i < square_y + 3; i++) {
            for (let j = square_x; j < square_x + 3; j++) {
                square.push(this.state[i][j].value);
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

    this.find_notes = function() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.state[j][i].notes = this.possible_digits(i, j);
            }
        }
    }

    this.solve = function(x=false, y=false) {
        if (!x && !y) {
            x = this.get_empty_cells()[0][0];
            y = this.get_empty_cells()[0][1];
        }
        const possibles = this.possible_digits(x, y);
        for (d of possibles) {
            this.insert(x, y, d);
            if (this.next_empty(x, y)) {
                const next_x = this.next_empty(x, y)[0];
                const next_y = this.next_empty(x, y)[1];
                const result = this.solve(next_x, next_y);
                if (!result) {
                    this.insert(x, y, 0);
                    continue;
                } else {
                    this.state = result.state;
                }
            }
            return this;
        }
    }
}

function Cell(x, y, value) {
    this.x = x;
    this.y = y;
    this.notes = [];
    this.value = value;

    this.show = function() {
        push();
        strokeWeight(1);
        rect(x * cell_size, y * cell_size, cell_size, cell_size);
        fill(0);
        if (this.value) {
            textSize(cell_size);
            text(this.value, this.x * cell_size + cell_size / 4, this.y * cell_size + cell_size * 3.5 / 4);
        } else if (this.notes.length >= 1) {
            textSize(cell_size / 3);
            for (note of this.notes) {
                text(note, this.x * cell_size + ((note - 1) % 3) * cell_size / 3 + cell_size * 0.1, this.y * cell_size + (Math.floor((note - 1) / 3) + 0.9) * cell_size / 3);
            }
        }
        fill(255);
        pop();
    }
}
