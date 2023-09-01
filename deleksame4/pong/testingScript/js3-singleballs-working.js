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
var shot1 = null;

//ammo og skyte for player1
var ammo1 = true;
var shoot1 = false;
var ammo2 = true;
       

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
    up: false,
    xx: false
}


//player 1 keyup and down event
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);
//onkeyup and down
/* document.addEventListener('onkeydown', onkeyDown, false);
document.addEventListener('onkeyup', onkeyUp, false); */

//player 1 funsjoner for skjekke om piltast trukket/slippet opp og ned 87 83
var ball_1 = false;

function keyDown(e){
    if(e.keyCode === 87){
        player1.up = true;
    } else if(e.keyCode === 83){
        player1.down = true;
        
    } 
  if(e.keyCode === 88){
        if(ammo1 === true){
            console.log('keydown X shoot, ball_1 true');
            shot1 = true;
            player1.xx = true;
        }
            
  }
}



function keyUp(e){
    if(e.keyCode === 87){
        player1.up = false;
    } else if(e.keyCode === 83){
        player1.down = false;
    } 
    if(e.keyCode === 88){
        console.log('Keyup X ');
        ball_1 = false;
        shot1 = false;
        
      } 
}
console.log(shoot1);
console.log(ammo1);
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
    up: false,
    xx: false

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
    } else if (e.keyCode === 190){
        player2.xx = true;
    }
}
function key_up(e){
    if(e.keyCode === 38){
        player2.up = false;
    } else if(e.keyCode === 40){
        player2.down = false;
    }else if (e.keyCode === 190){
        player2.xx = false;
    }
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



//status på ball for å kontrollere at bare 1 ball finnes om gangen
/* var ball_1 = false; */

//radius for ball
var radius = 50;

/* var player1BallX = player1.m + player1.w + radius; */
var player1BallX = player1.m + player1.w + radius;
var player1BallY = player1.y + playerHeight / 2;
var playerBallRadius = 15; 

//ball bevegelse
var player1BallMoveX = 5;

//player1 ball assosiative array
var p1b = {
    x: player1BallX,
    y: player1BallY,
    r: playerBallRadius,

    //bevegelse
    m: player1BallMoveX

}

//player1 ball tegne funksjon
function play1b(){
    ctx.beginPath();
    ctx.arc(p1b.x, p1b.y, p1b.r,0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}


//player2 ball
//gjøre klar ball som spiller2 skyter ut

//status på ball for å kontrollere at bare 1 ball finnes om gangen
var ball_2 = false;


/* var player2BallX = player2.x + player2.w + radius; */
var player2BallX = player2.x - radius;
var player2BallY = player2.y + playerHeight / 2;

//ball bevegelse
var player2BallMoveX = 5;

//player1 ball assosiative array
var p2b = {
    x: player2BallX,
    y: player2BallY,
    r: playerBallRadius,

    //bevegelse
    m: player2BallMoveX

}

//player1 ball tegne funksjon
function play2b(){
    ctx.beginPath();
    ctx.arc(p2b.x, p2b.y, p2b.r,0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

var gameover = false;
//update funksjon som oppdater
function update(){
    /*  p2Life--;  
     document.getElementById('spiller2').innerHTML = p2Life;  */

        //ball kollisjon test for y-akse
 /*    if(ball.y + ball.my < ball.r ){
        ball.my = -ball.my;
    } else if(ball.y + ball.my > canvas.height - ball.r){
        ball.my = -ball.my;
    } */
    
     //player 2 bevegelse og kollisjon check
     //kode hentet fra workshop og mdn 2d breakoutgame
     if(player1.up){
         player1.y -= player1.m;
         if(player1.y < 0){
             player1.y = 0;
             
         }
     } else if(player1.down){
         player1.y   += player1.m;
         if(player1.y > canvas.height - player1.h){
             player1.y = canvas.height - player1.h;
         }
     } else if(player1.xx){
        ball_1 = true;
     }
     //player2 kontroller opp, ned og . for å skyte ball
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
    } else if(player2.xx){
        console.log('punkt-knapp fungerer');
        ball_2 = true;

    }


   //player 1 ball kollisjon med player2
   //ball forsvinner. Kollisjon fra canvas animasjon modull.
   if(
    player2.x + player2.w > p1b.x - p1b.r && 
    player2.x < p1b.x + p1b.r &&
    player2.y + player2.h > p1b.y - p1b.r &&
    player2.y < p1b.y + p1b.r
   ){
      ball_1 = false;
      document.getElementById('spiller2').innerHTML = p2Life - 1;
   }

   //player2 ball kollisjon - ball fra player1
   if(
    player1.x + player1.w > p2b.x - p2b.r && 
    player1.x < p2b.x + p2b.r &&
    player1.y + player1.h > p2b.y - p2b.r &&
    player1.y < p2b.y + p2b.r
   ){
      ball_2 = false;
      document.getElementById('spiller1').innerHTML = p1Life - 1;
   }
   
   

 
    }
 console.log(p2Life);
console.log(ball_1);
    //animate funksjon tegner elementer på canvas
function animate(){
     requestAnimationFrame(animate); 
     ctx.clearRect(0,0,canvas.width, canvas.height); 

    //tegne elementer på canvas
    play1();
    play2(); 
    update();
    if(ball_1){
        play1b(); 
    
        p1b.x += p1b.m;
    }
    
    if(ball_2){
        play2b();
        p2b.x -= p2b.m;
    }
    //ball for player1 tegnes hvis X-tast er trykket i tastetur

}


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


//fikse p2b variabler for draw funksjon, de mangler