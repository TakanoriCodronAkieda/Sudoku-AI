from copy import deepcopy


## Creating an arbitrary initial board
def initial_board():
    board = Board()
    board.insert(3, 0, 9)
    board.insert(4, 0, 5)
    board.insert(5, 1, 3)
    board.insert(7, 1, 6)
    board.insert(8, 1, 8)
    board.insert(1, 2, 7)
    board.insert(7, 2, 3)
    board.insert(8, 2, 2)
    board.insert(0, 3, 4)
    board.insert(3, 3, 2)
    board.insert(6, 3, 1)
    board.insert(2, 4, 5)
    board.insert(4, 4, 4)
    board.insert(6, 4, 6)
    board.insert(2, 5, 6)
    board.insert(5, 5, 8)
    board.insert(8, 5, 4)
    board.insert(0, 6, 8)
    board.insert(1, 6, 2)
    board.insert(7, 6, 5)
    board.insert(0, 7, 9)
    board.insert(1, 7, 3)
    board.insert(3, 7, 6)
    board.insert(4, 8, 2)
    board.insert(5, 8, 4)

    return board

class Board:
    def __init__(self, state=None):
        if state is None:
            self.state = [[0] * 9 for i in range(9)]
        else:
            self.state = deepcopy(state)

    def __repr__(self):
        return 'Board()'

    def __str__(self):
        return f"""
{' '.join(map(str, self.state[0][0:3]))} | {' '.join(map(str, self.state[0][3:6]))} | {' '.join(map(str, self.state[0][6:9]))}
{' '.join(map(str, self.state[1][0:3]))} | {' '.join(map(str, self.state[1][3:6]))} | {' '.join(map(str, self.state[1][6:9]))}
{' '.join(map(str, self.state[2][0:3]))} | {' '.join(map(str, self.state[2][3:6]))} | {' '.join(map(str, self.state[2][6:9]))}
---------------------
{' '.join(map(str, self.state[3][0:3]))} | {' '.join(map(str, self.state[3][3:6]))} | {' '.join(map(str, self.state[3][6:9]))}
{' '.join(map(str, self.state[4][0:3]))} | {' '.join(map(str, self.state[4][3:6]))} | {' '.join(map(str, self.state[4][6:9]))}
{' '.join(map(str, self.state[5][0:3]))} | {' '.join(map(str, self.state[5][3:6]))} | {' '.join(map(str, self.state[5][6:9]))}
---------------------
{' '.join(map(str, self.state[6][0:3]))} | {' '.join(map(str, self.state[6][3:6]))} | {' '.join(map(str, self.state[6][6:9]))}
{' '.join(map(str, self.state[7][0:3]))} | {' '.join(map(str, self.state[7][3:6]))} | {' '.join(map(str, self.state[7][6:9]))}
{' '.join(map(str, self.state[8][0:3]))} | {' '.join(map(str, self.state[8][3:6]))} | {' '.join(map(str, self.state[8][6:9]))}
"""
    def is_valid(self):
        for y, line in enumerate(self.state):
            for x, cell in enumerate(line):
                column = self.get_column(x)
                square = self.get_square(x, y)
                if cell != 0 and (line.count(cell) > 1 or column.count(cell) > 1 or square.count(cell) > 1):
                    return False
        return True

    def is_win(self):
        for line in self.state:
            for cell in line:
                if not cell:
                    return False
        return self.is_valid()

    def insert(self, x, y, digit):
        self.state[y][x] = digit

    def get_empty_cells(self):
        return [(x, y) for y, line in enumerate(self.state) for x, cell in enumerate(line) if cell == 0]

    def get_line(self, y):
        return tuple(self.state[y])

    def get_column(self, x):
        return tuple([line[x] for line in self.state])

    def get_square(self, x, y):
        square_x = (x // 3) * 3
        square_y = (y // 3) * 3
        return tuple(cell for line in self.state[square_y:square_y + 3] for cell in line[square_x:square_x + 3])

    def possible_digits(self, x, y):
        possibles = []
        line = self.get_line(y)
        column = self.get_column(x)
        square = self.get_square(x, y)
        for current_tested_number in range(1, 10):
            if current_tested_number not in line and current_tested_number not in column and current_tested_number not in square:
                possibles.append(current_tested_number)
        return possibles

    def easy_solve(self):
        while not self.is_win():
            for x, y in self.get_empty_cells():
                possibles = self.possible_digits(x, y);
                if len(possibles) == 1:
                    self.insert(x, y, possibles[0])
                    break
            else:
                return False
        return True   


board = initial_board()
print(board)
if not board.is_valid():
    print('The board is not valid') 
else:
    board.easy_solve()
    print(board)


