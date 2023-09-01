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
var playerY = canvas.height / 2 - playerHeight ;  //y-akse tegnepunkt for player1 og player2


//spiller bevegelse
var playerMove = 10;

//spiller liv
var p1Life = 3;
var p2Life = 3;
/* document.getElementById('spiller1').innerHTML = p1Life; */
/* document.getElementById('spiller2').innerHTML = p2Life; */




//spiller 1 informasjon object
var player1 = {
   /*  l: p1Life, */
    x: 10,
    y: playerY,
    w: playerWidth,
    h: canvas.height / 2 - playerHeight / 2,

    //bevegelse langs y-akse
    m: playerMove,

    //bevegelser for W, S. opp, w: 87 keycode og ned,s: keycode 83
    down: false,
    up: false
}


//player 1 keyup and down event
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

//player 1 funsjoner for skjekke om piltast trukket/slippet opp og ned 87 83
function keyDown(e){
    if(e.keyCode === 87){
        player1.up = true;
    } else if(e.keyCode === 83){
        player1.down = true;
    }
}
function keyUp(e){
    if(e.keyCode === 87){
        player1.up = false;
    } else if(e.keyCode === 83){
        player1.down = false;
    }
}

//spiller2 informasjon object
var player2 = {
  /*   l: p2Life, */
    x: canvas.width - 10 - playerWidth,
    y: playerY,
    w: playerWidth,
    h: canvas.height / 2 - playerHeight / 2,

    //bevegelse langs y-akse
    m: playerMove,

    //bevegelser for player2 med piltast opp: keycode 38 og ned: keycode 40
    down: false,
    up: false

}


//player 2 keyup and down event
document.addEventListener('keydown', key_down, false);
document.addEventListener('keyup', key_up, false);


//player 2 keyboard events 38 40
function key_down(e){
    if(e.keyCode === 38){
        player2.up = true;
    } else if(e.keyCode === 40){
        player2.down = true;
    }
}
function key_up(e){
    if(e.keyCode === 38){
        player2.up = false;
    } else if(e.keyCode === 40){
        player2.down = false;
    }
}


//gjøre klar ball
var radius = 15;

//ball bevegelse
var ballX = 4;
var ballY = -4;

/*
mx = movement x-aske
my = movement y-akse 
 */
var ball = {
    r: radius,
    x: canvas.width / 2,
    y: canvas.height / 2,
    mx: ballX,
    my: ballY
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
    ctx.fillStyle = 'brown'; 
    ctx.fill();
    ctx.closePath();
}

var gameover = false;
//animate funksjon som tegner på canvas
function animate(){
     requestAnimationFrame(animate); 
     ctx.clearRect(0,0,canvas.width, canvas.height); 

    //tegne elementer på canvas
    play1();
    play2();
    balll();

    //ball kollisjon test for y-akse
    if(ball.y + ball.my < ball.r ){
        ball.my = -ball.my;
    } else if(ball.y + ball.my > canvas.height - ball.r){
        ball.my = -ball.my;
    }

    //ball kollisjon med player1 og player2
    // ball.x + ball.mx > canvas.width - ball.r
    //ball.x + ball.r < player2.x && ball.x > player2.x - ball.r
    /* 
    ball.x <= player2.x && 
    ball.y <= player2.y && 
    ball.x <= player2.x && 
    ball.y <= player2.y
    */

    /* 
    ball.x >= player2.x - ball.r && 
        ball.y >= player2.y - ball.r

        failed code
    */

        /* 
         ball.x - ball.r < player1.x + player1.w &&
        ball.x + ball.r > player1.x &&
        ball.x - ball.r < player1.y - player1.h &&
        ball.x + ball.r > player1.y

        console.log('player2');
       ball.mx = -ball.mx;
       p2Life--;
       document.getElementById('spiller2').innerHTML = p2Life;

       failed code
    ball.x - ball.r < player1.x + player1.w &&
    ball.x + ball.r > player1.x &&
    ball.x - ball.r < player1.y - player1.h &&
    ball.x + ball.r > player1.y
      

        */

    //player2 ball kollisjon
   if(
    player2.x + player2.w > ball.x - ball.r && 
    player2.x < ball.x + ball.r &&
    player2.y + player2.h > ball.y - ball.r &&
    player2.y < ball.y + ball.r
   ){
    console.log('player2');
    ball.mx = -ball.mx;
    p2Life--;
    document.getElementById('spiller2').innerHTML = p2Life;

    if(p2Life === 0){
        gameover = true;
        gameOver();
    }
   }

    //player1 ball kollisjon
    if(
        player1.x + player1.w > ball.x - ball.r && 
        player1.x < ball.x + ball.r &&
        player1.y + player1.h > ball.y - ball.r &&
        player1.y < ball.y + ball.r
    ){
        console.log('player1');
       ball.mx = -ball.mx;
       p1Life--;
       document.getElementById('spiller1').innerHTML = p1Life;

    }
    /* else if(ball.x <= 0) {
        if(ball.y > player2.x && ball.y < player2.x - player2.w){
            console.log('hit registered'); 
           ball.mx = -ball.mx; 
            }
    } */
         
    //test code
    /* 
    ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y
     */
    

    //player1 bevegelse og kollisjon check
    if(player1.up){
        player1.y -= player1.m;
        if(player1.y < 0){
            player1.y = 0;
        }
    } else if(player1.down){
        player1.y += player1.m;
        if(player1.y > canvas.height - player1.h){
            player1.y = canvas.height - player1.h;
        }
    }

    //player 2 bevegelse og kollisjon check
    if(player2.up){
        player2.y -= player2.m;
        if(player2.y < 0){
            player2.y = 0;
        }
    } else if(player2.down){
        player2.y += player2.m;
        if(player2.y > canvas.height - player2.h){
            player2.y = canvas.height - player2.h;
        }
    }

    ball.x += ball.mx;
    ball.y += ball.my;
    
}

//gameover

/* animate(); */

//play game funksjon

function play(){
p1Life = 3;
p2Life = 3;
animate();
}
play();
function gameOver(){
    if(gameover){
    p2Life = 3;
    p1Life = 3;
    console.log('player2 wins!');
    cancelAnimationFrame(animate)
    }
}


