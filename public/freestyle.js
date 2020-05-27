let video;
let poseNet;
let poses = [];
let pose;
let noseX;
let noseY;
let leftHandX;
let leftHandY;
let oldrightHandX;
let rightHandX;
let rightHandY;
let targetX;
let targetY;
let targetWidth = 50;
let points;
let timer = 10;
let tints;
let input, button, greeting;
let score=[];

//particle variables
let particles = [];
const gravity = .25;
const colors = ['red', 'orange', 'yellow', 'lime', 'cyan', 'magenta', 'white'];
let endColor;



let acidSound;

function preload() {
  
  smiley = loadImage("https://cdn.glitch.com/10b06467-9f4e-4ab8-a9be-62476bfd291c%2FSmiley%20face.png?v=1589979771432");
acidSound = loadSound("https://cdn.glitch.com/10b06467-9f4e-4ab8-a9be-62476bfd291c%2FArmando%20-%20The%20Future%20(Armando's%20Original).mp3?v=1589989732936")

}

function setup() {
  
  createCanvas(640, 480)

  //pixel setup
  	pixelDensity(1);
//	createCanvas(600, 600);
	endColor = color(64, 0);

  
  
  //Set up video
  video = createCapture(VIDEO);
  video.hide()
  

  
  //Setup for poseNet
  poseNet = ml5.poseNet(video, modelReady)

  //Initializing targets
  targetX = random(targetWidth, width - targetWidth)
  targetY = random(targetWidth, height - targetWidth)

  points = 0;

  poseNet.on('pose', function(results) {
    poses = results;


    //Determing the poseNet points of the hands
    oldrightHandX = poses[0].pose.keypoints[10].position.x

    //This is what makes the interaction work??
    rightHandX = map(oldrightHandX, 0, width, width, 0)

    rightHandY = poses[0].pose.keypoints[10].position.y

    oldleftHandX = poses[0].pose.keypoints[9].position.x

    leftHandX = map(oldleftHandX, 0, width, width, 0)

    leftHandY = poses[0].pose.keypoints[9].position.y
    //console.log(poses)
  })
  
 

  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }

  
  
}


  

function draw() {
  
  
  textSize(70);
  text('STEP BACK', width/2-200, height/2);
  
  push();
    //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
  //draw video capture feed as image inside p5 canvas
 image(video, 0, 0, width, height)
  pop();
  
  
  
  
  noStroke()
 
  fill(150)

  drawLeftHand()
  drawRightHand()
  drawTarget()
  

  
  //setTimeout(drawTarget, 3000);


  if (dist(rightHandX, rightHandY, targetX, targetY) < targetWidth){
    
    filter(INVERT);

    targetX = random(targetWidth, width - targetWidth)
    targetY = random(targetWidth, height - targetWidth)
    points += 1;
    textSize(80);
    
    	//particles.push(new Firework(targetX, targetY));
  particles.push(new Firework(rightHandX, rightHandY));
  }

  if (dist(leftHandX, leftHandY, targetX, targetY) < targetWidth) {
    //console.log("point scored!")
    targetX = random(targetWidth, width - targetWidth)
    targetY = random(targetWidth, height - targetWidth)
    points++;
    filter(INVERT);
    
    	//particles.push(new Firework(targetX, targetY));
    particles.push(new Firework(leftHandX, leftHandY));
    
  }
  
  

  //trying to setup particle interaction
  particles.forEach((p) => {
		p.step();
		p.draw();
	});
	particles = particles.filter((p) => p.isAlive);

  

  
  textSize(50);
  text(points, 20, 40);
  textSize(50);
  fill(0, 255, 0)

  
  }
  




function modelReady() {
  console.log("model is loaded")
}

function drawNose() {
  if (poses.length > 0) {
    ellipse(noseX, noseY, 40)
  }
}

function drawLeftHand() {
  if (poses.length > 0) {
    ellipse(leftHandX, leftHandY, 40)
  }
}

function drawRightHand() {
  if (poses.length > 0) {
    ellipse(rightHandX, rightHandY, 40)
  }
}

function drawTarget() {
 // fill(255, 0, 0)
  image(smiley, targetX, targetY, 55, 55)

}





var acceleration = 0.08;
var nDrops = 30;
var drops = [];



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


function Acid(){
 acidSound.play()
}








class Particle {
	constructor(x, y, xSpeed, ySpeed, pColor, size) {
		this.x = x;
		this.y = y;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.color = pColor;
		this.size = size;
		this.isAlive = true;
		this.trail = [];
		this.trailIndex = 0;
	}

	step() {
		this.trail[this.trailIndex] = createVector(this.x, this.y);
		this.trailIndex++;
		if (this.trailIndex > 10) {
			this.trailIndex = 0;
		}
		this.x += this.xSpeed;
		this.y += this.ySpeed;

		this.ySpeed += gravity;

		if (this.y > height) {
			this.isAlive = false;
		}
	}

	draw() {
		this.drawTrail();
		fill(this.color);
		noStroke();
		//rect(this.x, this.y, this.size, this.size);
image(smiley, this.x, this.y, 30, 30);
    
    
	}

	drawTrail() {
		let index = 0;

		for (let i = this.trailIndex - 1; i >= 0; i--) {
			const tColor = lerpColor(color(this.color), endColor,
				index / this.trail.length);
			fill(tColor);
			noStroke();
			rect(this.trail[i].x, this.trail[i].y, this.size, this.size);
			index++;
		}

		for (let i = this.trail.length - 1; i >= this.trailIndex; i--) {
			const tColor = lerpColor(color(this.color), endColor,
				index / this.trail.length);
			fill(tColor);
			noStroke();
			rect(this.trail[i].x, this.trail[i].y, this.size, this.size);
			index++;
		}
	}
}

class Firework extends Particle {
	constructor(x, y) {
		super(x, y, random(-2, 2), random(-5, -13),
			random(colors), 10);
		this.countdown = random(30, 60);
	}

	step() {
		super.step();

		this.countdown--;
		if (this.countdown <= 0) {
			const explosionSize = random(10, 40);
			for (let i = 0; i < explosionSize; i++) {

				const speed = random(5, 10);
				const angle = random(TWO_PI);
				const xSpeed = cos(angle) * speed;
				const ySpeed = sin(angle) * speed;

				particles.push(new Particle(this.x, this.y,
					xSpeed, ySpeed,
					this.color, 5
				));
			}
			this.isAlive = false;
		}
	}
}