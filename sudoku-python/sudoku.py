from copy import deepcopy
import random

class Board:
    def __init__(self, state=None):
        if state is None:
            self.state = [[0] * 9 for i in range(9)]
        else:
            self.state = deepcopy(state)

    def randomize(self, num_of_hints):
        complete = Board()
        complete.solve()
        for i in range(3):
            for j in range(5):
                complete.switch_lines(random.randint(i * 3, i * 3 + 2), random.randint(i * 3, i * 3 + 2))
                complete.switch_columns(random.randint(i * 3, i * 3 + 2), random.randint(i * 3, i * 3 + 2))
        for j in range(5):
            complete.switch_lines(random.choice([0, 3, 6]), random.choice([0, 3, 6]), 3)
            complete.switch_columns(random.choice([0, 3, 6]), random.choice([0, 3, 6]), 3)
        self.state = deepcopy(complete.state)
        for i in range(81 - num_of_hints):
            x, y = random.randint(0, 8), random.randint(0, 8)
            while self.state[y][x] == 0:
                x, y = random.randint(0, 8), random.randint(0, 8)
            self.insert(x, y, 0)

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
    def next(self, x, y):
        if x == 8 and y == 8:
            return False
        elif x == 8:
            return 0, y + 1
        return x + 1, y

    def next_empty(self, x, y):
        n = self.next(x, y)
        empties = self.get_empty_cells()
        while n not in empties:
            if not n:
                return False
            n = self.next(n[0], n[1])
        return n

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

    def set_line(self, y, line):
        self.state[y] = list(deepcopy(line))

    def switch_lines(self, y1, y2, hm=1):
        group1 = []
        group2 = []
        for i in range(hm):
            group1.append(self.get_line(y1 + i))
            group2.append(self.get_line(y2 + i))
        for i, (line1, line2) in enumerate(zip(group1, group2)):
            self.set_line(y2 + i, line1)
            self.set_line(y1 + i, line2)

    def get_column(self, x):
        return tuple([line[x] for line in self.state])

    def set_column(self, x, column):
        for y, row in enumerate(self.state):
            row[x] = column[y]

    def switch_columns(self, x1, x2, hm=1):
        group1 = []
        group2 = []
        for i in range(hm):
            group1.append(self.get_column(x1 + i))
            group2.append(self.get_column(x2 + i))
        for i, (column1, column2) in enumerate(zip(group1, group2)):
            self.set_column(x2 + i, column1)
            self.set_column(x1 + i, column2)

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

    def solve(self, x=False, y=False):
        if not x and not y:
            x, y = self.get_empty_cells()[0]
        possibles = self.possible_digits(x, y)
        if len(possibles) == 0:
            return False
        for d in possibles:
            self.insert(x, y, d)
            if self.next_empty(x, y):
                next_x, next_y = self.next_empty(x, y)
                result = self.solve(next_x, next_y)
                if not result:
                    self.insert(x, y, 0)
                    continue
                else:
                    self = result
            return self

board = Board()
board.randomize(13)
print(board)
board.solve()
print(board)