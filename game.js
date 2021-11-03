var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var score = document.getElementById("score");
var music = document.getElementById("radio");
var userScore = 0;
var isGameOver = false;
var BrickList = [];



var ball = {
    x: 350,
    y: 550,
    dx: 5,
    dy: 5,
    radius: 8,
}


var paddle = {
    width: 200,
    height: 10,
    x: canvas.width / 2 - 30,
    y: canvas.height - 45,
    speed: 20,
    isMovingLeft: false,
    isMovingRight: false,
}


var BrickConfig = {
    offSetX: 25,
    offSetY: 25,
    margin: 25,
    width: 70,
    height: 15,
    totalRow: 5,
    totalColumn: 8,
}


var scoreMax = BrickConfig.totalColumn * BrickConfig.totalRow;


for (let i = 0; i < BrickConfig.totalRow; i++) {
    for (let j = 0; j < BrickConfig.totalColumn; j++) {
        BrickList.push({
            x: BrickConfig.offSetX + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offSetY + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false,
        })
    }
}
console.log(BrickList)


function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    context.fillStyle = '#ffcccc';
    context.fill();
    context.closePath();
}


function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fill();
    context.closePath();
}


function drawBricks() {
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, BrickConfig.width, BrickConfig.height);
            console.log(b);
            console.log(b.x);
            console.log(b.y);
            context.fill();
            context.closePath();
        }
    })
}
function drawRectangular() {
    context.beginPath();
    context.rect(250, 100, 285, 350);
    context.fillStyle = '#99cccc';
    context.fill();
    context.closePath();
}


function drawNotificationOver() {
    drawRectangular();
    context.beginPath();
    context.fillStyle = 'red';
    context.font = '25px serif';
    context.fillText("GAME OVER!", 320, 220);
    context.fill();
    context.closePath();
    context.beginPath();
    context.fillStyle = 'black';
    context.font = '20px serif';
    context.fillText("Chúc bạn may mắn lần sau!!!", 280, 260);
    context.fill();
    context.closePath();
    context.beginPath();
    context.fillStyle = 'black';
    context.font = '15px serif';
    context.fillText("Điểm của bạn là:" + userScore, 330, 285);
    context.fill();
    context.closePath();
    context.beginPath();
    context.fillStyle = 'White';
    context.font = '15px serif';
    context.fillText("Nhấn click để tiếp tục trò chơi", 300, 420);
    context.fill();
    context.closePath();
}


function drawNotificationWin() {
    drawRectangular();
    context.beginPath();
    context.fillStyle = 'yellow';
    context.font = '25px serif';
    context.fillText("YOU WIN", 340, 220);
    context.fill();
    context.closePath();
    context.beginPath();
    context.fillStyle = 'black';
    context.font = '20px serif';
    context.fillText("Xin chúc mừng bạn là", 305, 260);
    context.fill();
    context.closePath();
    context.beginPath();
    context.fillStyle = 'black';
    context.font = '15px serif';
    context.fillText("người chiến thắng", 330, 300);
    context.fill();
    context.closePath();
    context.closePath();
    context.beginPath();
    context.fillStyle = 'White';
    context.font = '15px serif';
    context.fillText("Nhấn click để tiếp tục trò chơi", 300, 420);
    context.fill();
    context.closePath();
}


function handleBallCollideBounds() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}


function handleBallCollidePaddle() {
    if (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height - 35) {
        ball.dy = -ball.dy;
    }
}


function handleBallCollideBricks() {
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            if (ball.x >= b.x && ball.x <= b.x + BrickConfig.width &&
                ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BrickConfig.height) {
                ball.dy = -ball.dy,
                    b.isBroken = true;
                userScore += 1;
                score.innerHTML = "<p>Điểm hiện tại:</p>" + userScore;
                if (userScore == scoreMax) {
                    music.pause();
                    canvas.innerHTML = '<audio autoplay src="./audio/Win.mp3"></audio>';
                    drawNotificationWin();
                    canvas.pause();
                }
            }
        }
    })
}


function updateBallPosition() {
    ball.x -= ball.dx;
    ball.y -= ball.dy;
}


function updatePaddlePosition() {
    if (paddle.isMovingLeft) {
        paddle.x -= paddle.speed;
    }
    else if (paddle.isMovingRight) {
        paddle.x += paddle.speed;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
    else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}


function draw() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        updatePaddlePosition();
        handleBallCollideBounds();
        handleBallCollidePaddle();
        handleBallCollideBricks();
        updateBallPosition();
        if (ball.y > canvas.height - ball.radius) {
            isGameOver = true;
        }
        requestAnimationFrame(draw);
    }
    else {
        music.pause();
        canvas.innerHTML = '<audio autoplay src="./audio/Mario.mp3"></audio>';
        drawNotificationOver();
    }

}


document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = false;
    }
    else if (event.keyCode == 39) {
        paddle.isMovingRight = false;
    }
})


document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        paddle.isMovingLeft = true;
    }
    else if (event.keyCode == 39) {
        paddle.isMovingRight = true;
    }
})
document.addEventListener('click', function (event) {
    this.location.reload();
})
draw();

