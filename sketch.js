var ball, paddle, edges, bricks;
var score = 0;
var lives = 3;
var gamestate = "serve";
var playerName = "";
var database;



function setup(){
    createCanvas(500,500);

    database = firebase.database();
    ball = createSprite(200,200,10,10);
    ball.shapeColor = "red"
  
    paddle = createSprite(200, 350, 120, 10);
    paddle.shapeColor = "blue";
  
    edges = createEdgeSprites();
  
    bricks = new Group();
    playerName = getUrlVars()["playerName"];
    
  
    createBrickRow(65, "red");
    createBrickRow(65+29, "orange");
    createBrickRow(65+29+29, "green");
    createBrickRow(65+29+29+29, "yellow");
}

function draw(){
    background("black");
  
  textSize(20);
  text("Score: "+score,40,25);
  text("Lives: "+lives, 40, 45);
  text(playerName, 240,45);
  
  if(gamestate == "serve"){
    text("Click to serve the ball.", 120,250);
    ball.velocityX =0;
    ball.velocityY =0;
    ball.x = 200;
    ball.y = 200;
  }
  else if(gamestate =="end") {
    text("Game Over", 150, 250);
    ball.remove;
  }
  else {
    gameplay();
  }
  
  drawSprites();
}

function createBrickRow(y, color) {
    for(c=0; c<6; c++)
    {
      var brick = createSprite(65+54*c,y,50, 25);
      brick.shapeColor = color;
      bricks.add(brick);
    }
}

function mouseClicked()
{
  ball.velocityX = 10;
  ball.velocityY = 6;
  
  if(gamestate == "serve"){
    gamestate = "play";
    ball.velocityY = -7;
    ball.velocityX = -7;
  }
  
}

function brickHit(ball, brick) {

 brick.remove();
 score = score+5;
 
 if (ball.velocityY > -12 && ball.velocityY < 12) {
   ball.velocityX *= 1.05;
   ball.velocityY *= 1.05;
 }
  
}

function lifeover(){
  lives = lives - 1;
  if(lives>=1) {
    gamestate = "serve";
  }
  else {
    gamestate = "end";
  }
}

function gameplay(){
  paddle.x = mouseX;
  
  if(paddle.x < 60)
  {
    paddle.x = 60;
  }
    
  if(paddle.x > 340)
  {
    paddle.x = 340;
  }
  
  ball.bounceOff(edges[0]);
  ball.bounceOff(edges[1]);
  ball.bounceOff(edges[2]);
  
  ball.bounceOff(bricks, brickHit);
  ball.bounceOff(paddle)
  
  if(!bricks[0])
  {
    //console.log("Won");
    ball.velocityX = 0;
    ball.velocityY = 0;
    text("Well Done!!",150,200);
    updateHighScoreInDB();
  }
  if(ball.isTouching(edges[3])) {
    lifeover();
  }
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = decodeURI(value);
  });
  console.log(vars)
  return vars;
}

function updateHighScoreInDB() {
  var highscore = 0;
  database.ref("score1").on("value", (data) => {
    highscore = int(data.val());
  });
  console.log("high score" + highscore)
  if (highscore < score) {
    database.ref("/").update({
      score1: score,
      name1: playerName
    })
  }
}
