var canvas = document.getElementById('canvas');
canvas.width = 480;
canvas.height = 320;
var ctx = canvas.getContext('2d');

//make ball x, y pos ready
var x = canvas.width / 2;
var y = canvas.height - 200;
var radius = 10;

//ball movement variables for x and y
var dx = 2;
var dy = -2;

//draw ball
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    
}

//paddle info
var paddleH = 10;
var paddleW = 75;
var paddleX = (canvas.width - paddleW) / 2;

//paddle movement variable
var left = false;
var right = false;

//paddle keyboard events
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

//paddle keyboard event functions

//keyUp()
function keyDown(e){
    if(e.keyCode === 39 || e.keyCode === 68){
        right = true;
    } else if(e.keyCode === 37 || e.keyCode === 65){
        left = true;
    }
}

//keyDown()
function keyUp(e){
    if(e.keyCode === 39 || e.keyCode === 68){
        right = false;
    } else if(e.keyCode === 37 || e.keyCode === 65){
        left = false;
    }
}

//draw paddle
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleH, paddleW, paddleH);
    ctx.fill();
    ctx.closePath();
}


//animate function with setInterval
function draw(){
     ctx.clearRect(0,0,canvas.width, canvas.height); 
    drawBall();
    drawPaddle();

    //bounce wall

    //top and left wall
    if(y + dy < 0){
        dy = -dy;
    }
    if(x + dx < 0){
        dx = -dx;
    }

    //right and bottom wall
    if(x + dx > canvas.width - radius){
        dx = -dx;
    }
    if(y + dy > canvas.height - radius){
        dy = -dy;
    }
    x += dx;
    y += dy;

    //paddle movement
    if(left){
        paddleX -=5;
        if(paddleX < 0){
            paddleX = 0;
        }
    } else if(right){
        paddleX += 5;
        if(paddleX + paddleW > canvas.width){
            paddleX = canvas.width - paddleW;
        }
    }
}
setInterval(draw, 10) 