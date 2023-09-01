//sette opp canvas, bredde, høyde, hente 2d content 
/* 
*kode for oppsett av canvas er inspirert fra cheatsheet for canvas fra forelesning.
ressurs: https://hiof.instructure.com/courses/5112/files/1001882?module_item_id=135862&fd_cookie_set=1
* Vi har læret hvordan man setter opp canvas i uke 41 og fikk cheatsheet på tegning av elementer på canvas + animering med setInterval(), men i denne oppgaven bruker jeg requestAnimationFrame() for animering hentet fra deleksamen 3 i steden.
* canvas element i html-dokument blir lagret i variabel med navnet 'canvas', hentet med document.getElementByid() metode. 
* canvas bredde/høyde er satt med properties canvas.width/height i pixler, 800/400
* var ctx er forkortelse for 'context'. Denne variabelen henter 2d context fra canvas variabelen over med metode getContext(). Vi kan bruke denne ctx variabelen til å tegne 2d elementer på canvas. I denne oppgaven er det 2 firekant, 2 sirkel(arc) og gameover text som er tegnet på canvas.
*/
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 400;
var ctx = canvas.getContext('2d');

//gjøre klar 2 spillerbrikker på høyre og venstre
//spillerbrikk er 10px unna canvas kant i x-aksen.

//spiller bredde og høyde
/*
* Disse variabelne innholder verdier som er i assosiative arrayer for player1 og player2.
* assosiative arrayer har vi lært i uke 38.
    https://hiof.instructure.com/courses/5112/pages/arrayer?module_item_id=120535
*kode for oppsett for assosiative er denne modullen i canvas. Jeg testet med å bruke det i en av workshopene lenge siden.
* Jeg bruker assosiative array for player1, player2, ball1 og ball2. Det er for å enklere struktur og mulighet til å bruke x,y på både player1 og player2. player1.x player1.y, player2.x, player2.y for eksempel.
* i oppgaven skal player1 sine x var 10px fra canvas kanten i venstre på skjermen og player2 sin x motsatt i høyre. var playerWidth er bare player1, player2 hardkodet sin x tegnepukt i canvas i assosiatve array player2
* i oppgaven skal både player og player2 ha 100px høyde. Dette er lagret i variabel playerHeight
* Variabel playerY er hvor spiller blir tegnet på i y-aksen på canvas. Variabelen har verdi canvas.height(400) / 2 som er 400 og - playerHeight(100) = 100. player1 og player blir her i y-aksen når spillet starter. De starter på samme sted.
 */
var playerWidth = 10;
var playerHeight = 100;
var playerY = canvas.height / 2 - playerHeight / 2 ;  //y-akse tegnepunkt for player1 og player2


//spiller bevegelse
/* 
* variabel playerMove er global for player1 og player2. Variabelen er player bevegelse i y-aksen går opp eller ned ved player1/2.y øker eller minker med 10px. 
* spiller blir tegnet på nytt igjen og igjen veldig raskt for å gi illusjon av bevegelse i skjermen. Så spiller går opp 10px, så blir spiller slettet fra opprinnelige posisjonen og tegnet på nytt 10px vekk i ny sted i y-aksen. Det er sammen når spiller går ned. */
var playerMove = 10;

//spiller liv
/* 
* Denne biten spiller liv variabler og skriver dem ut 2 <span> i html-dokument
* variabel p1Life er liv for player1 og skrives ut i <span> med id 'spiller1' i html dokument
* variabel p2Life er liv for player2 og skrives ut i <span> med id 'spiller2' i html dokument
 */
var p1Life = 3;
var p2Life = 3;
document.getElementById('spiller1').innerHTML = p1Life; 
document.getElementById('spiller2').innerHTML = p2Life;




//spiller 1 informasjon assosiativ array
/* 
*Denne assosiativ arrayen inneholder nøkkel, verdi par for player1.
*Siden player1 er en firekant, så trenger vi 4 verdier for å kunne tegne spilleren på canvas. x og y-akse for tegnepunkt på canvas, bredde og høyde på firekanten.
*player1.x er x-akse tegnepunkt for player1. Den er 10 som betyr 10 unna 0 punkt i canvas som er øverste venstre kant. på 0, 0 punkt i canvas er både x og y-akse øverste venstre kant.
*player1.y y-akse tegnepunkt for playe1 og y verdien er variabelen playerY som senterer i midten for y-aksen.
*player1.w er player1 firekant bredde som har variabelem playerWidth som verdi, 10px bredde.
*player1.h er høyde for player1 firekant og variabel playerHeight som verdi.
*player1.m har variabel playerMove som verdi, 10px. Det er hvor mye y-aksen går opp eller ned med x-tast.
*player1.down og player1.up nøkkel verdi for når bevegese tast er trukket på tastur. Begge er satt på false og blr til true w, s er trukket/holdt på testur. Da vil player1 bevegse seg etter tast. 
*player1.xx er x-tast i tastetur for å skyte ball ut for player1. Verdien er false og blir true når x-tast trukket og skyter ut en ball. Man ikke skyte nytt ball før ballen som pågår enten treffer motsatand spiller, player2 eller bommer og treffer veggen bak player2. knappen blir satt tilbake til false når man spiller x-tasten.

*/

var player1 = {
    x: 10,
    y: playerY,
    w: playerWidth,
    h: playerHeight,

    //bevegelse langs y-akse
    m: playerMove,

    //bevegelser for W, S. opp, w: 87 keycode og ned,s: keycode 83, xx: keycode 88 x-tast på tastetur for å skyte ut ball
    down: false,
    up: false,
    xx: false
}


//gameover flag for hele spillet. Status for denne variabelen er false og in animate() funksjon blir player1, player2 tegnet kun denne variabelen er false. update() funksjonen kjører også bare når status for denen variabel er false. Det i if animate() funksjon som har i parameter isgameover === false.
var isgameover = false;

//player 1 keyup and down event
/* 
* ressurs: 
    *kode oppsett for player1 og player2 addEventListener, if i funksjonene er inpirert fra spesielt 2D breakout spillet i mdn under. Jeg brukte også løsningsforslag fra workshop 8.
   - fra workshop 8: https://hiof.instructure.com/courses/5112/files/1014109?wrap=1
   - 2D breakout game: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls
   -for tastetur keyCode: Keycode
https://keycode.info/
* Jeg har brukt begge disse ressurene for å få til bevegelse for player1 og player2.
* Det er samme struktur for player1 og player2
* mdn lenken har spillerbrikke som går høyre og venstre i x-aksen, men i her player1 og player2 opp og ned i y-aksen.
*/

/*
* 2  tastetur lyttere, keyup og keydown med hver sin funksjon som den kjører 
* lyttet keydown har funksjon med samme navn 'keyDown'
* lyttet keyup har funksjon med samme navn 'keyUp'
* Disse 2 funksjonene arbeider sammen godt, for når vi trykker ned tast og slipper for så må begge registeres.
* Hvis opp eller ned trykkes ned og vi ikke har keyup, så spiller forsatte samme retting hele tiden. 
 */
document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);



//player 1 funsjoner for skjekke om tast w,s,x er trukket/slippet, w keycode87, s keycode 83, x keycode 88

//status for å få ball1, ball som player1 skyter ut når den treffer player2 eller veggen bak player2
var ball_1 = false;
/* 
*funksjon keyDown() 2 if og else if statement. 
*parameter har 'e' som henter keydown event egenskaper og metoder. vi bruker keyCode egenskapen for tastetur taster vi ønsker. Her har vi trukket ned w-tast på tastetur som har keyCode 87, s-tast ned som har keyCode 83 og  x-tast som keyCode 88.
* Når w-tast blir trykket ned, så blir status for player1.up til true. 
* Det er samme for s-tast ned der player1.down status blir true og for x tast blir player1.xx status til true.
* Når status for tastene er true, så vil det påvirke if(player1.up) if(player1.down) og if(player1.xx) i update() for lage bevegelse eller skyte ball.
 */

function keyDown(e){
    if(e.keyCode === 87){
        player1.up = true;
    } else if(e.keyCode === 83){
        player1.down = true;
        
    } 
  if(e.keyCode === 88){
            console.log('X-knapp trukket ned');
            player1.xx = true;
        
  }
}

/* 
*Denne funksjon er for keyup lytter.
*funksjon keyUp() gjør motsatt tastene opp, ned og x status tilbake til false når de er sluppet eller ikke hold lenger. 
* Denne funksjonen altså stopper bevegelse når tast er ikke trukket ved at if(player1.up), if(player1.down) og if(player1.xx) i update() funksjonen ikke kjører. Disse if statements kjører kun status for taste er true.
*
*/
function keyUp(e){
    if(e.keyCode === 87){
        player1.up = false;
    } else if(e.keyCode === 83){
        player1.down = false;
    } 
    if(e.keyCode === 88){
        console.log('Keyup X ');
        player1.xx = false;
        
      } 
}


//spiller2 informasjon object
//status på ball for å kontrollere at bare 1 ball finnes om gangen
/* 
*player2 er bygd på samme struktur som player1. 
*forskjellene er:
    -assosiative array for spiller 2 har navnet player2
    -funksjon navn for keydown lytter har navnet key_down for å ikke krasje med keydown lytter for player1
    -funksjon navn for keyup lytter har navnet key_up for å ikke krasje med keyup lytter for player1
    -player2 bruker tastene piltast(opp) keycode 38 for å gå opp i y-akse, piltast(ned) keycode 40 for å gå ned i y-akse og punktum . keycode 190 for å skyte ball2

*/
//denne flag variabel for å få ball2, ball som player2 skyter ut til å forsvinne når den treffer player1 eller veggen bak player1. 
var ball_2 = false;

/* 
*samme oppbygning som player1
 */
var player2 = {
  /*   l: p2Life, */
    x: canvas.width - 10 - playerWidth,
    y: playerY,
    w: playerWidth,
    h: playerHeight,

    //bevegelse langs y-akse
    m: playerMove,

    //bevegelser for player2 med piltast opp: keycode 38 og ned: keycode 40
    down: false,
    up: false,
    xx: false

}


//player 2 keyup and down event
/*
* samme oppbygning som player1, men navnet for funksjoner er annerledes. Her har funksjon for keydown lytter key_down og funksjon for keyup lytter heter key_up.
*tastene som får status true i key_down funksjon er keycode 38 piltast-opp for player2.up, keycode 40 piltast-ned for player2.down og keycode 190 punktum-tast for player2.xx.
*key_up funksjon gjør status til samme tastene til false når de er slippet eller ikke hold ned lenger.
 */
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
/*
*kode for oppsett for tegning av 2d figurer elementene for player1, player2, ball1 og ball2 er inspirert av canvas cheatsheet også.
*ressurs: https://hiof.instructure.com/courses/5112/files/1001882?module_item_id=135862&fd_cookie_set=1 

*funksjon player1() er funksjon som inneholder tegning data for player1 i canvas
*funksjon player2() er funksjon som inneholder tegning data for player2 i canvas
*player1 og player2 er begge i hver sin egen funksjon for å kunne lettere tegne dem i canvas ved å kalle funksjonene i animasjon funksjonen animate().
*I play1() og play1() er spiller figuren tegnet i firekant(rect) i en path. 
*path har start, beginPath() og avsluttning, closePath().
*Mellom start og slutt på path er det ctx.rect(), 2D firankt figur metode som er lagret i variablen ctx med 2dcontext som ble hentet med getContext() fra canvas elementet. Også har vi fillStyle og fill() for å gi firankt figuren farge fill, ellers blir fargen på default svart hvis vi har med bare fill() og uten fillStyle. Her har fillStyle verdi 'red' streng som verdi, rød farge fill. Verdien alle mulige css farge som rgb. hsl, hex, gradient, farge navn. Har brukte jeg farge navn red for player1 og blue for player2. Ball1 og ball2 har tilsvarende farge med spiller som skyter dem ut. rød ball player1 og blå ball for player2.
*ctx.rect tar imot 4 verdier. x-akse tegnepunkt, y-akse tegnepunkt, bredde på firekant, høyde på firekant.
*for player1 er veriden hentet fra player1 assosiative array. x-akse: player1.x, y-akse: player1.y, bredde: player1.w, høyde: player1.h
*player2 funksjon har samme struktur med tar imot verdier player2 assostive array i ctx.rect().
 */


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




//radius for ball1(player1 sin ball) og ball2(player2 sin ball), 15px som oppgaven spør.
var playerBallRadius = 15; 

//ball bevegelse variabler for ball1 x, player1BallMoveX og y, playerBallMoveY. Det er koordinatene ball1 blir tegnet på igjen og igjen for lage illusjon av bevegelse.
var player1BallMoveX = Math.random() + 10;
var player1BallMoveY = Math.random() + 5;

//ball1 initialize flag
//status på ball for å kontrollere at bare 1 ball finnes om gangen
var ball1active = false;

//player1 ball assosiative array som er brukt i funksjon play1b() og p1b.r i intb1()
/*
* x og y har verdi 0 for at intb1() og play1() forskjellige x og y verdier.
*intb1() bruker x og y verdier fra player1 assosiative array
*player1() brukes x og y verdier i arc() fra denne assosiative array for ball1, p1b.

 */
var p1b = {
    x: 0,
    y: 0,
    r: playerBallRadius,

    //bevegelse
    m: player1BallMoveX,
    n: player1BallMoveY

}

/*
*ressurs:
    -canvas cheatsheet for bevegelse av ball og mdn 2D breakoutgame https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Move_the_ball
    -arc() verdier forklaring: https://www.w3schools.com/tags/canvas_arc.asp
    -veiledningstime med Marius(bilde i prossesbeskrivelse) og workshop med studentassistent Ivar
*I denne delen av oppgaven har jeg hatt 2 hoved utfordringer som jeg satt god stund på. Først å skyte ball ut fra litt unna sin spiller midtpunkt(høyden) hvor en spiller måtte være på y-aksen. Jeg hadde ballen skyte fra midten av spiller figuren kun for startpunkten for spilleren i spill start. Ballen ble skudd fra samme sted i x,y-akse tegnepunkt i canvas etter spiller ble bevegd. Ballen følte ikke med sin spiller riktig. Andre utfordring er at etter veilednings hjelp, kunne ballen skytter fra riktig sted, mid i spiller figur, men så bevegde ballen seg etter bevegelsen til spiller som skjøt ut ballen siden ball sin x og y-aske tegnepunkt hang sammen med spilleren. 

*løsning for utfording 2 med initialize funksjon:
*intb1() og intb2() initial funsjoner ball1 og ball2. funksjonen gjør ballene sin x og y-akse tegnepunkt blir koblet til hver sin spiller assositive array med sin ball assostive array x og y. ball1 sin assosiative array er p1b og p2b er ball2 sin assosiative array. p1b.x = player1.x + player1.r, radius er for å få ballen unna player1 firekant like lang ball sin radius sånn at ballen skytes ut litt avastand fra spiller, p1b.y = player1.h delt på 2 + player1.y, det er for ballen til tegnes rett i midten av player1.sin høyde. Ball2 sin assosiative array og intb2() har lignende struktur.

*play1b() er tegne funksjon for ball1. Den er byd med path nesten samme som player1 og player2 tegne funksjon. Forskjellen er at ballen er sirkel og ikke firekant. Sirkel tegnes med arc() fra canvas 2d context. arc() tar imot 5 verdier i parameter, 6 verdier hvis man tar med bolean(true, false) som siste verdi for clockwise/anticlock som er retttning arc tegnes med. arc verdi: x-akse tegnepunkt, y-akse tegnepunkt, radius for arc, start vinkel, slutt vinkel.
verdiene i arc blir flyt med fra ball1 assosiative array p1b. arc() har da for x-akse: p1b.x som er 0, y-akse: p1b.y som også er 0, radius: p1b.r som 15 pga variabelen playerBallRadius, start vinkel er null, slutt vinkel har Math.PI gange 2 som gjør at full sirkel blir tegnet. ctx.fillStyle og fill() er for å gi farge. ball1 sin farge tilsvarer samme farge player1 som rød.

*Ball2 sin p2b assositive array, intb2() initialize funksjon og play2b() tegnefunksjon har lignende struktur som for ball1
*
 */

//ball1 initialize funksjon
function intb1(){
    p1b.x = player1.x + p1b.r;
    p1b.y = player1.h / 2 + player1.y;
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


var ball2active = false; // flag som gjør at ball kan skytes for når status er false. Status blir true når er skutt ut og holder seg true til den treffer player1 eller veggen bak. Da blir status false igjen og player2 kan skyte ball igjen. 

//ball bevegelse for ball2 i y-akse brukt p2b assosiative array nøkkler m og n.
var player2BallMoveX = 5 + Math.random() + 10;
var player2BallMoveY = 5 - Math.random() - 10;

//player2 ball assosiative array
var p2b = {
    x: 0,
    y: 0,
    r: playerBallRadius,

    //bevegelse
    m: player2BallMoveX,
    n: player2BallMoveY

}

//initialize funksjon for ball2. samme som for ball1.
function intb2(){
    p2b.x = player2.x - p2b.r;
    p2b.y = player2.h / 2 + player2.y;
}
//player2 ball tegne funksjon
function play2b(){
    ctx.beginPath();
    ctx.arc(p2b.x, p2b.y, p2b.r,0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

/* 
*for gameover utskrift i canvas når en spiller vinner har jeg lagd egen mini gameover for hver av 2 spillere.
*player1 og player2 sine gameover utskrift lignende struktur. Når player1 vinner, så kjører player1 sin gameover og player2 sin gameover kjører når player2 vinner.

*først lagde jeg flag for variabel. for player1 er vairabelen gameover1. Den er har status false når spillet pågår. player2 sin flag variabel er gameover2.

*Så ladge jeg assosiative arrayer som inneholder og x, y verdier for tegnpunt for fillText() path som skrives ut når en spiller har vunnet. player1 sin gameover1 assositive array er over1 object array. x har 150 pixler og og y har verdi canvas delt på 2 som midten av canvas lags y-aksen. Disse x og y koordinatene for fillText() path. player2 sin gameover assosiative array er over2 array. Jeg testet endel på x-akse verdier for ønskelig punkt for teksten. 150 synes jeg var grei punkt i x-aksen.

*Etter det byttet status for gameover1 og gameover2 til true i if statement i update() funksjon som kjekker om spiller har funnet. for gameover1 er if som kjekker når p2Life(player2 life) === 0, da blir status for gameover1 til true. For gameover2 er det i if som kjekker når p1Life(player1 life) === 0, da blir status for gameover2 til true.

*Når status for gameover1 er true, så kjører if i animate() funksjon. if kjekker når gameover1 === true, if er det fillText path for gameover1 og gameover() funksjon kjører samtidig. gameover() er den store game over funksjon for spiller som sletter alt i canvas bortsatt fra gameover1/gameover2 fillText på canvas. filltext() blir slettet når man klikker restart knappen via restart() funksjon som gameover status til true. gameover2 egen if som samme. if som kjekker når gameover2 === true. 
*/

//gameover flag status for når player1 finner. Den er false når spillet pågår
var gameover1 = false;

//gameover1 assosiative array. x og y koordinater for ctx.fillText()
var over1 = {
    x: 150,
    y: canvas.height /2

}

//gameover flag status for når player2 finner. fungerer samme måte som for gameover1
var gameover2 = false;


//gameover2 assosiative array. fillText x og y koordinater
var over2 = {
    x: 150,
    y: canvas.height /2
}

//update funksjon som oppdater og kjekker bevegelser for player1, player2, ball2, ball2. kraj test for player1 og player2 top og bunn lags y-aksen, krasj test for ball1, ball2 når det treffer spillere eller canvas i kant veggene.
/*
Jeg hentet inspirasjon kodene under fra disse lenkene
ressurs: 
    - spiller krasj langs y-akse i canvas: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Paddle_and_keyboard_controls
    - ball krasj test med vegg kanter: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
    - ball krasj med spiller: https://hiof.instructure.com/courses/5112/pages/kollisjonsdeteksjon?module_item_id=136953 
    -workshop 8 løsningsforlag fra canvas
 */
function update(){
    
     //player 2 bevegelse og kollisjon check

     //if her kjekker når player1.up er true. Da kan player1 beveges opp ved at y-akse tegnepunkt forandrer seg fra nåvarende tegnepunkt ny verdi med player1.m som 10px. Den blir tegnet på nytt hele tiden for å gi illusjon av bevegelse. når man holder tasten opp, så ser ut at spiller beveger seg. Når man slipper opp, så stopper spiller punktet spiller er på da i y-aksen. Men egentlig så betyr det er player1 tegnes på det punktet hele tiden veldig raskt. -= er for å beholde tilgere punkt i y-aksen eller med bare = vil player1 begynne å starte fra 10px i canvas.
     if(player1.up){
         player1.y -= player1.m;
    //denne if er vegg krasj test for når player1 treffer er på vei canvas topp. Den stopper opp når player sin y-akse er mindre 20, atså 19. Grunnen jeg ikke har når player1 <= 0 er fordi jeg hadde en bugg der player liv gikk ned når spiller treffer canvas topp. Jeg fant ikke løsning på den enn å passe på at spiller rekker å treffe canvas topp vegg. play1.y = 20 gjør at spiller blir tegnet på y 20 i canvas når player1 sin blir mindre 20px. Dette gir illusjon på spiller stopper, men spiller blir tegnet igjen og igjen på dette punket.
         if(player1.y < 20){
             player1.y = 20;
         }
    //Dette else if for når player1.down er true. Nesten samme funksjonalitet som når player1 går opp. Forskjellen er at player1.y += player1.m. y-aksen stiger som betyr player1 går ned med 10px når trykket/holder ned s-tast på tastatur. Canvas fungerer med y-akse øker på vei ned og synker ned på vei opp.
     } else if(player1.down){
         player1.y   += player1.m;
    //if krasj test for når player1 treffer canvas bunn i y-aksen. kondisjonen blir player1 sin y er større enn canvas sin høyde minus player1 sin egen høyde. Da tegnes player1 i y-aksen canvas høyde - player høyde. De blir at player1 står akkurat på bunn av canvas. Om man holder ned s-tast på tastatur, så vil få illusjon av stopp at player1 ikke går ned lengere det punket. Men akkurart som vegg for canvas topp, så det er her også spiller blir tegnet på nytt og nytt i samme punkt selv om det ser ut at er det er stop. player1 går ned i y-aksen med like hastighet som når den går opp 10px, player1.m.
         if(player1.y > canvas.height - player1.h){
             player1.y = canvas.height - player1.h;
         }
    //Else for når x-tast er trukket ned, status for player1.xx er blitt true da. ball_1 status blir true som gjør at ball skytes ut fra player1. Dette kjører if i animate() funsjon med parameter ball_1. Der funksjonen for ball1 intb1() og play1b()
     } else if(player1.xx === true){
        ball_1 = true;

     }

     //player2 kontroller opp, ned og . for å skyte ball
     /*
     * player2 er lik struktur som player1 
      */

     //if her kjører når player2 går opp og player.up får status true. 
    if(player2.up){
        player2.y -= player2.m;

    //player2 krasj for canvas top. hadde samme bugg som player1 hvor spiller liv gikk når den traff veggen.
        if(player2.y < 20){
            player2.y = 20;
        
        }
    //if for når player2.down har status true og player2 kan gå ned
    } else if(player2.down){
        player2.y += player2.m;

    //krasj test for canvas bunn for player2
        if(player2.y > canvas.height - player2.h){
            player2.y = canvas.height - player2.h;
        }
    //if for når player2 skyter ut sin ball, ball2. Det er når punktum-tast er trykket i tatatur og player2.xx får status true. ball_2 får status true og if med paramater ball2_2 kjører i animate() funksjonen.
    } else if(player2.xx === true){
       /*  console.log('punkt-knapp fungerer'); */
        ball_2 = true;
        
        

    }


   //player 1 ball kollisjon med player2. Når ball1 treffer player2 eller veggen bak
   //ball forsvinner. Kollisjon test for formell fra canvas animasjon modull i lenken over i update() kommentar.

   //formel forsto jeg ikke helt, men forstår at den kjekker player2 x, y koordinat mot ball sin x,y og raidus.
   if(
    player2.x + player2.w > p1b.x - p1b.r && 
    player2.x < p1b.x + p1b.r &&
    player2.y + player2.h > p1b.y - p1b.r &&
    player2.y < p1b.y + p1b.r
   ){
    //ball_1 status blir false når player2 truffet sånn at ballen forsvinner.
      ball_1 = false;
    
    //player2 liv går ned med 1 poeng når ballen treffer player2
      p2Life--;

    //x og y koordinatene tegnes vekk fra krasjpunket sånn at player2 liv ikke går ned kontinuerlig. Ny x verdi for ball samme player1.x og y player1.y.
      p1b.x = player1.x;
      p1b.y = player1.y;

      //flag for ball1 intb1() funksjon sånn at ball1 kan skytes igjen, men det fortsatt ikke skytes igjen hvis man ikke trykket skyte tast, x på tastetur for ball_1 status bli true for ball skal tegnes på canvas i animate() funksjon.
      ball1active = false;

      //ny player2 liv skrives ut i html etter treff med document.getElementby() som tar imot id fra span i index.html med id navn ''spiller2''.
      document.getElementById('spiller2').innerHTML = p2Life;
    
      //gameover kjekk for player1. Når player2 0 liv igjen blir status for gameover1 til true. i animate() funksjon kjører if med paramater gameover1=== true.
      if(p2Life === 0){
        console.log('Gameover. Player1 wins!');
        gameover1 = true;
      }
   } 
   //ball1 y-akse kollisjonspunkt med canvas topp og bunn
   // vegg kjekk for top av canvas. if for når ball1 sin y tegnpukt i y-aksen + p2b.m spiller bevegese langs. p1b.y er 0 og p1b.m er random tall, hvis det mindre p1b.r/ball raduius(15px), da går ballen motsatt retningen langs y-aksen med p1b.n = -p1b.n. Ballen begynner å gå ned.
   else if(p1b.y + p1b.m < p1b.r ){
    p1b.n = -p1b.n;

//vegg skjekk for bunn av canvas. når ballen sin y, m er større enn canvas sin høyde - ballen sin radius, da treffer ball1 canvas bunn. p1b.n = -p1b.n gjør at ball1 går motsatt rettning i y-aksen og går opp.
   } else if(p1b.y + p1b.m > canvas.height - p1b.r){
    p1b.n = -p1b.n;
    }
    //ball1 x-kollisjon med høyre siden av canvas. Når ball1 bommer på å treffe player2, da treffer ballen veggen. Dette skjer når ball1 sin x + ball sin bevegelse m, random tall er større enn canvas - ball 1 sin raidus.
    else if(p1b.x + p1b.m > canvas.width - p1b.r){
    
    //da blir status for ball1 false 
    ball_1 = false;
    //ball1 sin x og y koordinater blir bevegd fra krasjpunktet
    p1b.x = player1.x;
    p1b.y = player1.y;

    //status for ball1 blir false sånn at ball kan skytes igjen
    ball1active = false;
    
    }




   //player2 ball kollisjon MED ball fra player1 funger nesten samme måte for ball1 krasj test med player2. Forskjellen er ball2 skytes til venstre siden av av canvas hor kollisjon kjekk for canvas kant vestre i x-akse.

   //krasj test formel for ball2 med player1 er samme som krasj mellom ball1 og player2
   if(
    player1.x + player1.w > p2b.x - p2b.r && 
    player1.x < p2b.x + p2b.r &&
    player1.y + player1.h > p2b.y - p2b.r &&
    player1.y < p2b.y + p2b.r
   ){

    //status for ball2 blir false når ball2 treffer spiller for at player2 skal kunne skyte ball2 igjen.
       ball_2 = false;  
    
     //player1 liv går ned med 1 poeng hvis ball2 treffer den.
       p1Life--;

    //etter treff byttes koordinatene fra krasj punket der ball2 treffer player1 sånn at player1 liv ikke går ned konstant.
       p2b.x = player2.x;
       p2b.y = player2.y;
       console.log('Player1 truffet');
    
    //ball2 status blir false når ballen treffer player1 sånn at intb2() og player2b() kan kjører i animate() funksjon.
      ball2active = false;

    //ny liv for player1 skrives ut i html når den har blitt truffet av ballen. 1 mindre liv med hver treff.
      document.getElementById('spiller1').innerHTML = p1Life; 

    //if som kjekker at gameover2 status blir true når player1 liv blir 0.
      if(p1Life === 0){
        console.log('gameover. Player2 Wins!');
        gameover2 = true;
      }
    
   } 

   //ball2 krasj for canvas top. denne fungerer samme måte som den for ball1 krasj med canvas top.
   else if(p2b.y + p2b.m < p2b.r ){
    p2b.n = -p2b.n;

    //ball2 krasj test med canvas bunn. fungerer samme måte som krasj for ball1 krasj test canvas bunn.
    } else if(p2b.y + p2b.m > canvas.height - p2b.r){
    p2b.n = -p2b.n;
    }   
    //ball2 x-kollisjon med venstre siden av canvas. Her er det treffer ball2 sin x og radius - 15 er mindre enn 0. Den kjekker traffer på baksiden av canvas sin venstre kant i langs x-aksen.
    else if(p2b.x - (p2b.r - 15) < 0 ){
    
    //ball2 status blir også false når ball2 ikke treffer player1 og treffer veggen bak istedenfor. Ballen forsvinner og ikke tegnet på canvas, fordi if i animate() funksjon med parameter ball_2 blir true lenger. 
       ball_2 = false;
    
    //ball2 sin x og y tegnepunkter blir bevegd fra krasjpunket der ball2 treffer veggen 
       p2b.x = player2.x;
       p2b.y = player2.y;
    
    //ball2 active status blir false sånn at intb2() og play2b() kan kjøre i animate() if med ball_2 som parameter.
       ball2active = false;

        }

 
    }
 console.log(p2Life);
console.log(ball_1);

    //animate funksjon tegner elementer på canvas
    /* 
    *inspirsjon måten å bruke requestAnimationFrame() funksjon er fra deleksamen3 satyr spill.
    *Hvordan requestAnimationFrame fungerer er forklart i deleksamen3.
    *ressurs:
        -deleksamen3
        -canvas cheatsheet for clearRect() 
     */
function animate(){
     
    //clearRect() er funksjon som ligger i canvas 2d context og den sletter alle 2d elementer i hele canvas. Den tar imot 4 verdier: x-akse, y-akse, bredde og høyde. Her begynner clearen fra canvas i x og y-akse null. 0,0 er helt top i venstre delen av canvas kant. bredde: canvas.width som her sin bredde langs x-aksen fra 0 til 800px, høyde: canvas.height som er canvas sin høyde fr 0 til 400px. Det hele canvas område, så alt blir slettet. requestAnimationFrame() gjør at alt i canvas blir tegnet på nytt hele tiden. Så animate() sletter alt, tegner alle elementer igjen og igjen hele tiden. Det er denne funksjonaliteten som lar oss lage illusjoner av bevegelser. Elementer i canvas slettes og tegnes på nytt i ny område canvas sin x og y-aksen at det ser ut som i vår øyne.
     ctx.clearRect(0,0,canvas.width, canvas.height); 

    //tegne elementer på canvas når gameover er false. player1, player2 tegnes kun når spillet pågår. update() kjører i denne if er false.
    if(isgameover === false){
        play1();
        play2(); 
        update();
    }
  
    //ball1 for player1 tegnes hvis X-tast er trykket i tastetur
    if(ball_1){
        //if for ball1 active at intb1() kan kjøre x-tast er trukket på tastaturen. ball1active status blir true når ballen er lufta og ikke har trukket player2 eller veggen bak. Når ball1 treffer spiller, player2 eller veggen bak, blir status for ball1active til false og da kan ball1 skytes igjen. Dette gjør at player1 kan skyte kun 1 ball om gangen og ikke flere baller samtidig. 
        if(ball1active === false){
            intb1();
            ball1active = true;
        //else tegnes ballen med play1b() og p1b.x og p1b.y er lager illusjon av bevegelse ved p1b.x blir inkrementert verdi av p1b.m og p1b.y med p1b.n
        } else {
            play1b(); 
            p1b.x += p1b.m;
            p1b.y += p1b.n;
            
        }
        
    }
    
    //ball2 for player2 tegnes hvis punktum-tast er trykket i tastetur. Ball2 tegneskjekk fungerer med lik struktur som if for bal1
    if(ball_2){
        if (ball2active === false) {
            intb2();
            ball2active = true;
        } else {
            play2b();
            p2b.x -= p2b.m;
            p2b.y += p2b.n;
           
        }
        
    }

    //if for gameover2. Når den er true, kjører path for fillText(). fillText() her har 3 verdier. tekststreng, x-akse verdi: over2.x er fra assositve array for koordinatene for player2 gameover, over2.y for y-akse er også fra samme array.
    if(gameover2 === true){
        /* gameover1 = false; */
        ctx.beginPath();
        //font størrelse og font-familie Rye
        ctx.font = "40px Rye";
        //fillStyle og fill() fungerer som i player og ball path.
        ctx.fillStyle = 'red';
        ctx.fill();
        //filltext med tekststreng som ser t player2 vinner
        ctx.fillText('Gameover, player2 wins!', over2.x, over2.y);
        //avsluttning på path
        ctx.closePath();
        //gameover kjører også når player2 vinner
         gameOver(); 
    }

    //gameover1 for player1 fungerer på samme måte. Bare at player1 vinner her.
    if(gameover1 === true){
        /* gameover1 = false; */
        ctx.beginPath();
        ctx.font = "40px Rye";
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.fillText('Gameover, player1 wins!', over1.x, over1.y);
        ctx.closePath();
         gameOver(); 
    }
    //denne funksjonen tar imot funksjon for den kan kjøre hele tiden. Her kjører den samme funksjon den er i, animate().
    requestAnimationFrame(animate);
}

//animate funksjon kjører her.
animate();





//gameover funksjon
function gameOver(){
    //status for isgameover blir true når det gameover sånn at elementer, player1, player2 ikke tegnes på canvas lenger og update() ikke kjører. if i animate() med parameter isgameover === false blir ikke sant lenger.
    isgameover = true;

    //restart knapp vises når spill er over ved å display block.
    document.getElementById('restart').style.display = 'block';
   
    //player1 og player2 blir satt tilbake startpunkt i spillstart når det er gameover.
    player1.y = playerY;
    player2.y = playerY;
}


//restart knapp funksjon som resetter spillet.

//knappen hentes med document.getElementById og gis klikk event lytter med funksjon restart() i parameter.
document.getElementById('restart').addEventListener('click', restart);

//restart funksjon som kjører når man klikker på restart knappen som vises når det er gameover. Dette reset funksjon som starter spillet på. Spillere får sine hver 3 liv tilbake, gameover for spillere blir fjernet.
function restart(){
    //status isgameover blir false, sånn player1, player1 kan tegnes på canvas og update() kan gjøre. Det påvirkes if i animate() med parameter isgameover === false.
    isgameover = false;

    //gameover1 status false for player1. Player har ikke vunnet spillet ved nytt spill start. player1 må klare treffe player2 med ball 3 ganger for å vinne igjen.
    gameover1 = false;

    //samme for player2. gameover status for player2 er false ved nytt spill start.
    gameover2 = false;

    //player1 og player2 liv blir satt tilbake til 3 skrives ut i html.
    p1Life = 3;
    p2Life = 3;
   document.getElementById('spiller1').innerHTML = 3; 
   document.getElementById('spiller2').innerHTML = 3;

   //restart knappen forsvinner når man klikker på den nytt spill starter. Den får display none stil og er ikke synlig spillet pågår. Knappen dukker opp igjen når en spiller kampen sånn spillet kan startes igjen om man ønsker.
   document.getElementById('restart').style.display = 'none';
}
