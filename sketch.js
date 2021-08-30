const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;

var monkey, monkeyImage;
var vineGroup, vineImage;
var bombGroup, bombImage;
var jungle;
var jungle1Image, jungle2Image, jungle3Image, jungle4Image;
var bananaImage, bananaGroup;
var ground, platform, ground2;
var gameOver, gameOverImage;

var boomSound, splatSound;

var score = 0;

var start = 1;
var play = 2;
var end = 3;
var gameState = start;

function preload(){
  jungle1Image = loadImage("jungle.jpg");
  jungle2Image = loadImage("jungle2.jpg");
  jungle3Image = loadImage("jungle4.jpg");
  jungle4Image = loadImage("jungle6.jpg");
  bananaImage = loadImage("banana.png");
  monkeyImage = loadImage("monkey.png");
  vineImage = loadImage("vine.png");
  bombImage = loadImage("bomb.png");
  gameOverImage = loadImage("gameover.png");

  boomSound = loadSound("boom.mp3");
  splatSound = loadSound("splat.mp3");
}

function setup() {
  createCanvas(810,400);

  engine = Engine.create();
  world = engine.world;

  jungle = createSprite(600,200,800,500);
  jungle.addImage("jungle", jungle1Image);
  jungle.addImage("jungle2", jungle2Image);
  jungle.addImage("jungle3", jungle3Image);
  jungle.addImage("jungle4", jungle4Image);
  jungle.scale = 1.5;
  jungle.velocityX = -(3 + 2 * score/10);

  ground = new Ground(400,395,825,20);
  platform = new Ground(100,110,50,10);

  ground2 = createSprite(400,395,800,5);
  ground2.visible = false;

  monkey = createSprite(100,100,100,100);
  monkey.addImage("monkey", monkeyImage);
  monkey.scale = 0.1;
  monkey.setCollider("circle",0,0,500);
  monkey.debug = false;

  gameOver = createSprite(400,200,20,20);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  bananaGroup = new Group();
  vineGroup = new Group();
  bombGroup = new Group();

}

function draw() {
  background("green"); 

  if(jungle.x < 200){
    jungle.x = 600;
    jungle.velocityX = -(2 + 2 * score/10);
  }

  if(gameState === start){

    jungle.velocityX = 0;

    if(keyDown(32)){
      gameState = play;
    }

    monkey.velocityY = 0;

  }

  if(gameState === play){
    
    spawnBananas();
    spawnVines();
    spawnBombs();

    jungle.velocityX = -(2+2*score/10);

    if(keyDown(UP_ARROW)){
      monkey.x = monkey.x + 5;
      monkey.y = monkey.y - 25;
    }
    if(keyDown(LEFT_ARROW)){
      monkey.x = monkey.x - 10;
    }
    if(keyDown(RIGHT_ARROW)){
      monkey.x = monkey.x + 10;
    }
    

    if(bananaGroup.isTouching(monkey)){
      score = score + 1;
      bananaGroup.destroyEach();
      splatSound.play();
    }

    if(bombGroup.isTouching(monkey)){
      gameState = end;
      boomSound.play();
    }

    if(score >= 25){
      jungle.changeImage("jungle2",jungle2Image);
    }
    if(score >= 50){
      jungle.changeImage("jungle3",jungle3Image);
    }
    if(score >= 75){
      jungle.changeImage("jungle4",jungle4Image);
    }

    monkey.collide(ground2);

    platform.x = 0;
    platform.y = 400;

    monkey.velocityY = monkey.velocityY + 0.8;
  }

  if(gameState === end){
    jungle.velocityX = 0;
    bananaGroup.setVelocityXEach(0);
    bombGroup.setVelocityXEach(0);
    vineGroup.setVelocityXEach(0);
    monkey.velocityX = 0;

    monkey.visible = false;
    gameOver.visible = true;

    bananaGroup.destroyEach();
    bombGroup.destroyEach();
    vineGroup.destroyEach();

    if(keyDown(32)){
      reset();
    }

  }

  drawSprites();
  monkey.display();
  ground.display();

  Engine.update(engine);

  fill("white");
  textSize(15);
  text("Score : " + score,700,20);

  if(gameState === start){
    text("Press space bar to Play!",400,200);
    text("Use the left and right arrows to move",400,220);
    text("Use the up arrow to go up",400,240);
    text("Collect bananas to increase score",400,260);
    text("But avoid the bombs or gameover!",400,280);
  }
  if(gameState === end){
    text("Press space bar to restart",300,390);
  }

}

function spawnBananas(){
  if(frameCount % 60 === 0){
    var banana = createSprite(790,100,20,20);
    banana.y = Math.round(random(10,350));
    banana.addImage(bananaImage);
    banana.scale = 0.05;
    banana.velocityX = -(3 + 2 * score/10);
    banana.lifetime = -1;
    bananaGroup.add(banana);
  }
}

function spawnVines(){
  if(frameCount % 180 === 0){
    var vine = createSprite(790,100,20,20);
    vine.addImage("vine", vineImage);
    vine.scale = 0.5;
    vine.velocityX = -(2+2*score/10);
    vine.lifetime = -1;
    vineGroup.add(vine);
  }
}

function spawnBombs(){
  if(frameCount % 240 === 0){
    var bomb = createSprite(790,100,20,20);
    bomb.y = Math.round(random(10,350));
    bomb.velocityX = -(2+2*score/10);
    bomb.addImage(bombImage);
    bomb.scale = 0.1;
    bomb.lifeTime = -1;
    bombGroup.add(bomb);
  }
}

function reset(){
  gameOver.visible = false;
  monkey.visible = true;
  score = 0;
  monkey.x = 100;
  monkey.y = 100;
  gameState = play;
}