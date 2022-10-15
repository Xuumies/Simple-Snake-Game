const WIDTH = 31;
const HEIGHT = 21;

class Arena {


    constructor() {
        this.rootElement = document.getElementById('root');
        this.arenaWidth = WIDTH;
        this.arenaHeight = HEIGHT;
        this.snake = new Snake({
            length: 3,
            direction: 'right',
            position: [15, 10],
        });
        this.foods = [
            new Food({
                position: [25, 15]
            }),
        ]

        this.build();
        const looper = () => {
            this.snake.move();
            this.snake.eat(this.foods);
            this.clear();
            this.draw();
        }

        looper();
        setInterval(looper, 100);
    }


    onKeyPress(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (this.snake.direction !== 'down') {
                    this.snake.direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (this.snake.direction !== 'up') {
                    this.snake.direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (this.snake.direction !== 'right') {
                    this.snake.direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (this.snake.direction !== 'left') {
                    this.snake.direction = 'right';
                }
                break;
        }
    }


    build() {
        this.buildDivs();
        this.registerEvents();
    }


    buildDivs() {
        for (let i = 0; i < this.arenaHeight; i++) {
            const row = document.createElement('div');
            row.classList.add('row');

            for (let i = 0; i < this.arenaWidth; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                row.appendChild(cell);
            }

            this.rootElement.appendChild(row);
        }
    }


    registerEvents() {
        document.addEventListener('keydown', (event) => this.onKeyPress(event));
    }


    clear() {
        const cells = document.querySelectorAll('.cell');
        for (const cell of cells) {
            cell.classList.remove('snake');
            cell.classList.remove('food');
            cell.classList.remove('head');
        }
    }

    draw() {
        this.snake.draw();
        for (const food of this.foods) {
            food.draw();
        }
    }
}


class Snake {

    constructor({ direction, position }) {
        this.direction = direction;
        this.position = position;
        this.body = [];
        this.grownHealth = 0;

        this.build();
    }


    move() {
        const lastPosition = this.body[this.body.length - 1].position;
        const newX = lastPosition[0] + (this.direction === 'right' ? 1 : this.direction === 'left' ? -1 : 0);
        const newY = lastPosition[1] + (this.direction === 'down' ? 1 : this.direction === 'up' ? -1 : 0);
        if (newX < 0 || newX >= WIDTH || newY < 0 || newY >= HEIGHT) {
            return;
        }
        this.body.push({
            position: [newX, newY],
        });
        if (this.grownHealth > 0) {
            this.grownHealth--;
        } else {
            this.body.shift();
        }
    }


    eat(foods) {
        const head = this.getHead();
        for (const food of foods) {
            if (head.position[0] === food.position[0] && head.position[1] === food.position[1]) {
                food.disintegrateFromReality();
                this.grownHealth += 1;
            }
        }
    }

    getHead() {
        return this.body[this.body.length - 1];
    }


    build() {
        for (let i = 0; i < 3; i++) {
            this.body.push({
                position: [this.position[0] + i, this.position[1]],
            });
        }
    }


    draw() {
        for (const part of this.body) {
            const position = part.position;
            const cell = document.querySelector(`.row:nth-child(${position[1] + 1}) .cell:nth-child(${position[0] + 1})`);
            cell.classList.add('snake');
        }
        const head = this.getHead();
        const cell = document.querySelector(`.row:nth-child(${head.position[1] + 1}) .cell:nth-child(${head.position[0] + 1})`);
        cell.classList.add('head');
    }

}

class Food {

    constructor({ position }) {
        this.position = position;
    }


    draw() {
        if (!this.eaten) {
            const cell = document.querySelector(`.row:nth-child(${this.position[1] + 1}) .cell:nth-child(${this.position[0] + 1})`);
            cell.classList.add('food');
        }
    }


    disintegrateFromReality() {
        this.position = [Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)];
    }

}


new Arena();
