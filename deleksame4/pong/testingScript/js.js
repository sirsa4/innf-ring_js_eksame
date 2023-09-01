//sette opp canvas, bredde, høyde, hente 2d content 
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 400;
var ctx = canvas.getContext('2d');

//gjøre klar 2 spillerbrikker på høyre og venstre
//spillerbrikk er 10px unna canvas kant

//spiller bredde og høyde
var playerWidth = 10;
var playerHeight = 100;
var playerY = canvas.height / 2 - playerHeight ;

//spiller liv
var p1Life = 3;
var p2Life = 3;
document.getElementById('spiller1').innerHTML = p1Life;
document.getElementById('spiller2').innerHTML = p2Life;




//spiller 1
var player1 = {
    l: p1Life,
    x: 10,
    y: playerY,
    w: playerWidth,
    h: canvas.height / 2 - playerHeight / 2,

    //bevegelser for piltast. opp: 38 keycode og ned keycode 40
    down: false,
    up: false
}
console.log(player1);

//player keyup and down event
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

//player 1 funsjoner for skjekke om piltast trukket/slippet opp og ned
function keyDown(e){
    if(e.keyCode === 38){
        player1.up = true;
    } else if(e.keyCode === 40){
        player1.down = true;
    }
}
function keyUp(e){
    if(e.keyCode === 38){
        player1.up = false;
    } else if(e.keyCode === 40){
        player1.down = false;
    }
}

//spiller2
var player2 = {
    l: p2Life,
    x: canvas.width - 10 - playerWidth,
    y: playerY,
    w: playerWidth,
    h: canvas.height / 2 - playerHeight /2

    //bevegelser for player2 opp: keycode 87 og ned: keycode 83

}

/* console.log(player1); */

//gjøre klar ball
var radius = 15;

var ball = {
    r: radius,
    x: canvas.width / 2,
    y: canvas.height / 2
}


//tegne funksjoner for spillere og ball

//tegne player1
function play1() {
    ctx.beginPath();
    ctx.rect(player1.x, player1.y, player1.w, player1.h);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

//tegne spiller 2
function play2() {
    ctx.beginPath();
    ctx.rect(player2.x, player2.y, player2.w, player2.h);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

//tegne ball
function balll (){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = 'red'; 
    ctx.fill();
    ctx.closePath();
}


//animate funksjon
function animate(){
     requestAnimationFrame(animate); 
     ctx.clearRect(0,0,canvas.width, canvas.height); 

    //tegne elementer på canvas
    play1();
    play2();
    balll();

    //player1 bevegelse og kollisjon check
    if(player1.up){
        player1.y -= 5;
        if(player1.y < 0){
            player1.y = 0;
        }
    } else if(player1.down){
        player1.y +=5;
        if(player1.y > canvas.height - player1.h){
            player1.y = canvas.height - player1.h;
        }
    }
    
}
animate();