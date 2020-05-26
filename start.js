
var acceleration = 0.08;
var nDrops = 50;
var drops = [];

function preload() {
  
  smiley = loadImage("https://cdn.glitch.com/10b06467-9f4e-4ab8-a9be-62476bfd291c%2FSmiley%20face.png?v=1589979771432");
}

function setup() {
  createCanvas(600, 480);
  video = createCapture(VIDEO);
  video.hide()
  
   for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }
}




function draw() {
 image(video, 0, 0)
  
//clear();
  drops.forEach(function(d) {
    d.drawAndDrop();
  });
}

function Drop() {
  this.initX = function() {
    this.x = random() * width;
  };
  this.initY = function() {
    this.y = -random() * height / 3; // Initialise rain somewhat off the screen
  };

  this.initX();
  this.y = random() * height;

  this.length = random() * 10;
  this.speed = random();

  this.drawAndDrop = function() {
    this.draw();
    this.drop();
  };

  this.draw = function() {
    image(smiley, this.x, this.y, 50, 50);
  };

  this.drop = function() {
    if (this.y < height) {
      this.y += this.speed;
      this.speed += acceleration;
    } else {
      this.speed = random();
      this.initY();
      this.initX();
    }
  };
}