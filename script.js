var size = 10;
var paused = false;
var time = 'Snake-Game';
var speed = 600;
var bonus = 100;
var container = document.getElementById('container');

var snake = {
    head: [2, 3],
    body: [[1, 3], [0, 3]],
    direction: 'right',
    moveTop: function () {
        this.bodyMove();
        this.head[1] = this.head[1] - 1;
    },
    moveRight: function () {
        this.bodyMove();
        this.head[0] = this.head[0] + 1;
    },
    moveBottom: function () {
        this.bodyMove();
        this.head[1] = this.head[1] + 1;
    },
    moveLeft: function () {
        this.bodyMove();
        this.head[0] = this.head[0] - 1;
    },
    bodyMove: function () {
        for (var i = (this.body.length - 1); i > 0; i--) {
            this.body[i][0] = this.body[(i - 1)][0];
            this.body[i][1] = this.body[(i - 1)][1];
        }
        this.body[0][0] = this.head[0];
        this.body[0][1] = this.head[1];
    },
    grow: function () {
        snake.body.push([snake.body[snake.body.length - 1][0], snake.body[snake.body.length - 1][1]]);
    }
};

var apple = {
    exist: false,
    position: {
        x: 0,
        y: 0
    },
    create: function () {
        if (!this.exist) {
            this.position.x = parseInt(Math.random() * 10);
            this.position.y = parseInt(Math.random() * 10);
            this.exist = true;
        }
    },
    eat: function () {
        this.exist = false;
    }
};

var user = {
    name: 'user',
    score: 0,
    key: time,
    getBest: function () {
        if (storageAvailable()) {
            return window.localStorage.getItem(this.key);
        }
    },
    setBest: function (val) {
        if (storageAvailable()) {
            window.localStorage.setItem(this.key, val);
        }
    },
    clearScore: function () {
        if (storageAvailable()) {
            window.localStorage.removeItem(this.key);
        }
    }
};

document.body.onkeydown = function (e) {
    if (e.keyCode == 32) {
        pause();
    }
    if (!paused) {
        switch (e.keyCode) {
            case 38:
                if (snake.direction != 'bottom') {
                    snake.direction = 'top';
                }
                break;
            case 39:
                if (snake.direction != 'left') {
                    snake.direction = 'right';
                }
                break;
            case 40:
                if (snake.direction != 'top') {
                    snake.direction = 'bottom';
                }
                break;
            case 37:
                if (snake.direction != 'right') {
                    snake.direction = 'left';
                }
                break;
            default:
                break;
        }
    }
};

render();

loop(speed);

function loop(interval) {
    var game = setInterval(function () {
        apple.create();
        if (!paused) {
            switch (snake.direction) {
                case 'top':
                    if (snake.head[1] <= 0) {
                        stop(game);
                        break;
                    }
                    snake.moveTop();
                    break;
                case 'right':
                    if (snake.head[0] >= (size - 1)) {
                        stop(game);
                        break;
                    }
                    snake.moveRight();
                    break;
                case 'bottom':
                    if (snake.head[1] >= (size - 1)) {
                        stop(game);
                        break;
                    }
                    snake.moveBottom();
                    break;
                case 'left':
                    if (snake.head[0] <= 0) {
                        stop(game);
                        break;
                    }
                    snake.moveLeft();
                    break;
                default:
                    break;
            }
            if (apple.position.x == snake.head[0] && apple.position.y == snake.head[1]) {
                apple.eat();
                snake.grow();
                if (user.score > 1000 && bonus < 150) {
                    bonus = 150;
                    speed = 500;
                    clearInterval(game);
                    loop(speed);
                }
                if (user.score > 2000 && bonus < 200) {
                    bonus = 200;
                    speed = 400;
                    clearInterval(game);
                    loop(speed);
                }
                if (user.score > 3000 && bonus < 350) {
                    bonus = 350;
                    speed = 250;
                    clearInterval(game);
                    loop(speed);
                }
                if (user.score > 10000 && bonus < 600) {
                    bonus = 600;
                    speed = 100;
                    clearInterval(game);
                    loop(speed);
                }
                user.score += bonus;
            }
            render();
        }else{
            render();
            clearInterval(game);
            return;
        }
    }, interval);
}

function render() {
    clear();
    if(!paused) {
        createScore(user);
        createField(size);
        createSnake(snake);
        if (apple.exist) {
            createApple(apple);
        }
    }else{
        showPause();
    }
}

function showPause() {
    var div = document.createElement('div');
    div.className = 'pause';
    div.innerText = 'pause';
    container.appendChild(div);
}

function pause() {
    if (paused) {
        paused = false;
        loop(speed);
    } else {
        paused = true;
    }
}

function stop(timer) {
    clearInterval(timer);
    alert('Game over!');
    if (user.score > user.getBest()) {
        user.setBest(user.score);
    }
}

function createField(s) {
    var row;
    var col;

    for (var i = 0; i < s; i++) {
        row = document.createElement('div');
        row.className = 'row';
        container.appendChild(row);
        for (var j = 0; j < s; j++) {
            col = document.createElement('div');
            col.className = 'col';
            col.setAttribute('id', 'id_' + j + i);
            row.appendChild(col);
        }
    }
}

function createSnake(snake) {

    var head_exist = false;
    for (var i = 0; i < snake.body.length; i++) {
        body = document.getElementById('id_' + snake.body[i][0] + snake.body[i][1]);
        if (snake.body[i][0] == snake.head[0] && snake.body[i][1] == snake.head[1]) {
            body.className = 'col head-' + snake.direction;
            head_exist = true;
        } else {
            body.className = 'col snake';
        }
    }
    if(!head_exist){
        head = document.getElementById('id_' + snake.head[0] + snake.head[1]);
        head.className = 'col head-' + snake.direction;
    }
}

function createApple(apple) {
    var apple_img = document.getElementById('id_' + apple.position.x + apple.position.y);
    apple_img.className = 'col apple';
}

function createScore(user) {
    var score = document.createElement('div');
    score.className = 'row-score';
    score.innerText = '<- score ||| best ->';
    var labelCurScore = document.createElement('div');
    labelCurScore.className = 'label left';
    var labelBestScore = document.createElement('div');
    labelBestScore.className = 'label right';
    var span = document.createElement('span');
    span.setAttribute('id', 'cur-score');
    span.innerText = user.score;
    var span1 = document.createElement('span');
    span1.setAttribute('id', 'best-score');
    span1.innerText = user.getBest();

    container.appendChild(score);
    score.appendChild(labelCurScore);
    labelCurScore.appendChild(span);
    score.appendChild(labelBestScore);
    labelBestScore.appendChild(span1);
}

function clear() {
    container.innerHTML = '';
}

function storageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}