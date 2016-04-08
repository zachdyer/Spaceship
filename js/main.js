var timerStart = new Date().getTime();
var distancePerSec = function(speed){
	return speed * (frame.time() / 1000);
};
var scale = 0.5;

var screen = new Object();
screen.canvas = document.getElementById("canvas");
screen.context = screen.canvas.getContext('2d');
screen.width = window.innerWidth;
screen.height = window.innerHeight;
screen.canvas.width = screen.width;
screen.canvas.height = screen.height;
screen.adjust = function(){
	var canvas = screen.canvas;
	screen.width = window.innerWidth;
	screen.height = window.innerHeight;
	canvas.width = screen.width;
	canvas.height = screen.height;
	spaceship.y = screen.height * 0.75;
};
screen.clear = function(){
	screen.context.clearRect(0,0,screen.width,screen.height);
};
screen.draw = function(){
	star.draw();
	if(game.loading){
		screen.drawLoading();
	}
	if(game.title){
		screen.drawTitle();
		game.drawScore();
	}
	if(game.play){
		spaceship.draw();
		spaceship.drawLasers();
		upgrades.draw();
		ufo.draw();
		ufo.explosion.draw();
		game.drawScore();
	}
	if(game.over){
		ufo.draw();
		ufo.explosion.draw();
		spaceship.drawLasers();
		upgrades.draw();
		game.drawGameOver();
		game.drawScore();
	}
	menu.draw();
};
screen.drawLoading = function(){
	var ctx = screen.context;
	ctx.fillStyle = "white";
	ctx.font = "40pt Arial";
	ctx.textAlign = "center";
	var timer = new Date().getTime() - timerStart;
	if(timer >= 0 && timer < 250)
		ctx.fillText("LOADING", screen.width / 2, screen.height / 2);
	if(timer >= 250 && timer < 500)
		ctx.fillText("LOADING.", screen.width / 2, screen.height / 2);
	if(timer >= 500 && timer < 750)
		ctx.fillText("LOADING..", screen.width / 2, screen.height / 2);
	if(timer >= 750 && timer < 1000)
		ctx.fillText("LOADING...", screen.width / 2, screen.height / 2);
	if(timer >= 1000){
		timerStart = new Date().getTime();
	}
};
screen.drawTitle = function(){
	var ctx = screen.context;
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.font = "14pt Arial";

	var titleImage = images.all[0];
	ctx.drawImage(titleImage, screen.width / 2 - titleImage.width / 2, screen.height / 2 - titleImage.height / 2);
	var timer = new Date().getTime() - timerStart;
	if(timer >= 0 && timer < 500)
		ctx.fillText("Press Enter to Play", screen.width / 2, screen.height / 2 + 100);
	if(timer >= 1000){
		timerStart = new Date().getTime();
	}
};

var star = new Object();
star.new = function(){
	var minSpeed = 250;
	this.speed = Math.random() * 500 + minSpeed;
	this.radius = this.speed / 500;
	this.x = Math.floor(Math.random() * screen.width) - this.radius * 2;
	this.y = Math.floor(Math.random() * screen.height);
	var colors = ['white','cyan','white','green','yellow','white'];
	var randNum = Math.floor(Math.random() * colors.length);
	this.color = colors[randNum];
}
star.all = new Array();
star.draw = function(){
	var ctx = screen.context;
	for(var i = 0; i < star.all.length; i++){
		var currentStar = star.all[i];
		ctx.fillStyle = currentStar.color;
		ctx.beginPath();
		ctx.arc(currentStar.x, currentStar.y, currentStar.radius, 0, 2 * Math.PI, false);
		ctx.fill();
	}
};
star.update = function(){
	for(var i = 0; i < star.all.length; i++){
		var currentStar = star.all[i];
		var distance = currentStar.speed * frame.time() / 1000;
		currentStar.y += distance;
		if(currentStar.y > screen.height + currentStar.radius * 2){
			currentStar.x = Math.random() * screen.width;
			currentStar.y = 0 - currentStar.radius * 2;
		}
	}
};
star.load = function(){
	var starCount = 100;
	for(var i = 0; i < starCount; i++){
		star.all.unshift(new star.new());
	}
};

var spaceship = new Object();
spaceship.x = screen.width / 2;
spaceship.y = screen.height * 0.75;
spaceship.speed = 200;
spaceship.width = 170 * scale;
spaceship.height = 102 * scale;
spaceship.draw = function(){
	var ctx = screen.context;

	//New Ship
	var playerShip = images.all[1];
	ctx.drawImage(playerShip,spaceship.x,spaceship.y,spaceship.width,spaceship.height);


};
spaceship.move = function(event){
	if(
		game.paused === false &&
		event.clientX > 0 &&
		event.clientX < screen.width - spaceship.width &&
		event.clientY > 0 &&
		event.clientY < screen.height - spaceship.height
	){
		spaceship.x = event.clientX;
		spaceship.y = event.clientY;
	}
};
spaceship.laserCoolDownMax = 500;
spaceship.laserCoolDown = spaceship.laserCoolDownMax;
spaceship.lastLaserFire = 0;
spaceship.laser = function(x,y){
	this.x = x;
	this.y = y;
	this.speed = 2000;
	this.size = 10;
}
spaceship.laserSize = 5;
spaceship.lasers = [];
spaceship.drawLaser = function(x,y){
	var ctx = screen.context;
	ctx.beginPath();
	ctx.arc(x,y,spaceship.laserSize,0,2 * Math.PI, false);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.strokeStyle = "#aefffb";
	ctx.lineWidth = 3;
	ctx.stroke();
};
spaceship.drawLasers = function(){
	for(var i = 0; i < spaceship.lasers.length; i++){
		var laser = spaceship.lasers[i];
		spaceship.drawLaser(laser.x,laser.y);
	}
};
spaceship.fire = function(){
	if(game.play){
		var laser = new spaceship.laser(spaceship.x + spaceship.width / 2,spaceship.y);
		spaceship.lasers.unshift(laser);
		sound.play(1);
	}
};
spaceship.updateLasers = function(){
	var time = new Date().getTime();
	if(
		time - spaceship.lastLaserFire > spaceship.laserCoolDown && key.spacebar ||
		time - spaceship.lastLaserFire > spaceship.laserCoolDown && key.leftClick
	){
		spaceship.fire();
		spaceship.lastLaserFire = time;
	}

	for(var i = 0; i < spaceship.lasers.length; i++){
		var laser = spaceship.lasers[i];
		var distance = laser.speed * frame.time() / 1000
		laser.y -= distance;
		if(laser.y < 0){
			spaceship.lasers.pop();
		}
	}
};
spaceship.updatePosition = function(){
	var distance = spaceship.speed * frame.time() / 1000;
	if(key.left && spaceship.x > 0){
		spaceship.x -= distance;
	}
	if(key.right && spaceship.x < screen.width - spaceship.width){
		spaceship.x += distance;
	}
	if(key.up && spaceship.y > 0){
		spaceship.y -= distance;
	}
	if(key.down && spaceship.y < screen.height - spaceship.height){
		spaceship.y += distance;
	}
};
spaceship.checkDamage = function(){
	for(var i = 0; i < ufo.ufos.length; i++){
		var ufoship = ufo.ufos[i];
		if(
			//UFO Center Point Collision
			ufoship.x + ufoship.width / 2 > spaceship.x &&
			ufoship.x + ufoship.width / 2 < spaceship.x + spaceship.width &&
			ufoship.y + ufoship.height / 2 > spaceship.y &&
			ufoship.y + ufoship.height / 2 < spaceship.y + spaceship.height
		){
			game.play = false;
			game.over = true;

			//Explosion Sound effect
			var explosion = sound.all[4];
			if(sound.muted === false){
				explosion.play();
			}
			ufo.explosion.add(spaceship.x,spaceship.y);
		}

	}
};

var upgrades = new Object();
upgrades.lastSpawn = 0;
upgrades.spawnRate = 10 * 1000;
upgrades.all = new Array();
upgrades.new = function(type){
	var radius = 20;
	this.radius = radius;
	var x = Math.random() * screen.width - (radius * 2);
	this.x = x;
	this.y = 0 - (radius * 2);
	this.speed = 200;
	this.type = type;
	this.color;
};
upgrades.update = function(){
	//Timer to add new upgrades
	var time = new Date().getTime();
	if(time - upgrades.lastSpawn > upgrades.spawnRate){
		upgrades.all.unshift(new upgrades.new('cooldown'));
		upgrades.lastSpawn = time;
	}
	for(var i = 0; i < upgrades.all.length; i++){
		var upgrade = upgrades.all[i];
		//Move upgrade
		var distance = distancePerSec(upgrade.speed);
		upgrade.y += distance;

		//Check center point collision
		if(
			upgrade.x + upgrade.radius > spaceship.x &&
			upgrade.x + upgrade.radius < spaceship.x + spaceship.width &&
			upgrade.y + upgrade.radius > spaceship.y &&
			upgrade.y + upgrade.radius < spaceship.y + spaceship.height
		){
			//Delete from array
			upgrades.all.splice(i,1);

			//Add upgrade
			switch(upgrade.type){
				case "cooldown":
					sound.all[5].currentTime = 0.5;
					if(sound.muted === false)
						sound.all[5].play();
					spaceship.laserCoolDown -= 50;
					break;
			}
		}

		//Delete from array if off the screen
		if(upgrade.y > screen.height + upgrade.radius * 2){
			upgrades.all.splice(i,1);
		}
	}
};
upgrades.draw = function(){
	for(var i = 0; i < upgrades.all.length; i++){
		var upgrade = upgrades.all[i];
		var ctx = screen.context;
		ctx.beginPath();
		ctx.arc(upgrade.x + upgrade.radius, upgrade.y + upgrade.radius,upgrade.radius,0,Math.PI * 2, false);
		ctx.fillStyle = "white";
		ctx.fill();
		if(upgrade.type == "cooldown"){
			var bulletRadius = 3;
			ctx.beginPath();
			ctx.arc(upgrade.x + upgrade.radius,upgrade.y + upgrade.radius, bulletRadius, 0, 2 * Math.PI, false);
			ctx.arc(upgrade.x + upgrade.radius,upgrade.y + upgrade.radius - bulletRadius * 3, bulletRadius, 0, 2 * Math.PI, false);
			ctx.arc(upgrade.x + upgrade.radius,upgrade.y + upgrade.radius + bulletRadius * 3, bulletRadius, 0, 2 * Math.PI, false);
			ctx.fillStyle = "black";
			ctx.fill();
		}
	}
};


var ufo = new Object();
ufo.lastSpawnTime = 0;
ufo.fastestSpawnRate = 1 * 1000;
ufo.slowestSpawnRate = 5 * 1000;
ufo.spawnRate = ufo.slowestSpawnRate;
ufo.ship = function(){
	var height = 20;
	var width = 40;
	var x = Math.random() * screen.width - width;
	if(x < 0){
		x = 0;
	}
	var speedX = Math.random() * 200 + 100;
	var chance = Math.random();
	if(chance < 0.5){
		speedX = -speedX;
	}
	var speedY = Math.random() * 200 + 100;
	this.x = x;
	this.y = 0 - height;
	this.speedX = speedX;
	this.speedY = speedY;
	this.width = width;
	this.height = height;
	this.enteredScreen = false;
};
ufo.add = function(){
	ufo.ufos.unshift(new ufo.ship());
};
ufo.ufos = [];
ufo.update = function(){
	//Check for laser hit
	ufo.checkDamage();

	//Update Position
	for(var i = 0; i < ufo.ufos.length; i++){
		var ufoship = ufo.ufos[i];

		//Prepare UFO to top screen detection
		if(ufoship.y > 0 && ufoship.enteredScreen === false){
			ufoship.enteredScreen = true;
		}

		//UFO Bounds Detection
		if(ufoship.x > screen.width - ufoship.width){
			ufoship.speedX = -ufoship.speedX;
		}
		if(ufoship.y > screen.height - ufoship.height){
			ufoship.speedY = -ufoship.speedY;
		}
		if(ufoship.x < 0){
			ufoship.speedX = -ufoship.speedX;
		}
		if(ufoship.y < 0 && ufoship.enteredScreen){
			ufoship.speedY = -ufoship.speedY;
		}

		//Move UFO to new position
		var distanceX = distancePerSec(ufoship.speedX);
		var distanceY = distancePerSec(ufoship.speedY);
		ufoship.x += distanceX;
		ufoship.y += distanceY;
	}

	//Add UFO at spawn interval
	var time = new Date().getTime();
	if(time - ufo.lastSpawnTime > ufo.spawnRate){
		ufo.add();
		ufo.lastSpawnTime = time;
	}
};
ufo.checkDamage = function(){
	for(var i = 0; i < spaceship.lasers.length; i++){
		var laser = spaceship.lasers[i];
		for(var j = 0; j < ufo.ufos.length; j++){
			var ufoship = ufo.ufos[j];
			var distance = laser.speed * frame.time() / 1000;
			for(var k = 0; k < distance; k++){
				if(
					laser.x < ufoship.x + ufoship.width &&
					laser.x > ufoship.x &&
					laser.y - k < ufoship.y + ufoship.height &&
					laser.y - k > ufoship.y
				){
					//Destroy UFO
					ufo.explosion.add(ufoship.x,ufoship.y);
					ufo.ufos.splice(j, 1);

					//Sound Effect
					var random = Math.floor(Math.random() * 2) + 2;
					var explosionSound = sound.all[random];
					explosionSound.load();
					if(sound.muted === false)
						explosionSound.play();

					//Destroy Laser
					spaceship.lasers.splice(i,1);

					//Increment Score
					game.score++;

					//Decrement UFO Spawn Rate
					if(ufo.spawnRate > ufo.fastestSpawnRate){
						ufo.spawnRate -= 1000;
					}

					//No use in continuing with the loop
					break;
				}
			}
		}
	}
};
ufo.draw = function(){
	for(var i = 0; i < ufo.ufos.length; i++){
		var ufoship = ufo.ufos[i];
		var ctx = screen.context;
		ctx.beginPath();
		ctx.moveTo(ufoship.x + ufoship.width / 2, ufoship.y);
		ctx.lineTo(ufoship.x, ufoship.y + ufoship.height / 2);
		ctx.lineTo(ufoship.x + ufoship.width / 2, ufoship.y + ufoship.height);
		ctx.lineTo(ufoship.x + ufoship.width, ufoship.y + ufoship.height / 2);
		ctx.closePath();
		ctx.fillStyle = "white";
		ctx.fill();
	}
};
ufo.explosion = new Object();
ufo.explosion.particle = function(x,y){
	this.x = x;
	this.y = y;
	var speedX = Math.random() * 1000 + 100;
	var speedY = Math.random() * 1000 + 100;
	var xNegPos = Math.floor(Math.random() * 2 + 1);
	if(xNegPos === 1){
		speedX = -speedX;
	}
	var yNegPos = Math.floor(Math.random() * 2 + 1);
	if(yNegPos === 1){
		speedY = -speedY;
	}
	this.speedX = speedX;
	this.speedY = speedY;
	this.size = Math.random() * 3 + 1;
	var colors = ['yellow','orange','white'];
	var color = colors[Math.floor(Math.random() * 3)];
	this.color = color;
};
ufo.explosion.particles = [];
ufo.explosion.flash = function(x,y){
	var ctx = screen.context;
	ctx.fillStyle = "white";
	ctx.beginPath();
	var radius = Math.floor(Math.random() * 50) + 50;
	ctx.arc(x,y,radius,0, 2 * Math.PI, false);
	ctx.fill();
};
ufo.explosion.add = function(x,y){
	var particleCount = 50;
	for(var i = 0; i < particleCount; i++){
		ufo.explosion.particles.unshift(new ufo.explosion.particle(x,y));
	}
};
ufo.explosion.draw = function(){
	for(var i = 0; i < ufo.explosion.particles.length; i++){
		var ctx = screen.context;
		var particle = ufo.explosion.particles[i];
		ctx.beginPath();
		ctx.arc(particle.x,particle.y,particle.size, 0, 2 * Math.PI, false);
		ctx.fillStyle = particle.color;
		ctx.fill();
	}
}
ufo.explosion.update = function(){
	for(var i = 0; i < ufo.explosion.particles.length; i++){
		var particle = ufo.explosion.particles[i];

		//Move particle
		var distanceX = distancePerSec(particle.speedX);
		var distanceY = distancePerSec(particle.speedY);
		particle.x += distanceX;
		particle.y += distanceY;

		//Check if particle left the bounds
		if(particle.y < 0 - particle.size * 2){
			ufo.explosion.particles.splice(i,1);
		} else if(particle.x > screen.width + particle.size * 2){
			ufo.explosion.particles.splice(i,1);
		} else if(particle.y > screen.height + particle.size * 2){
			ufo.explosion.particles.splice(i,1);
		} else if(particle.x < 0 - particle.size * 2){
			ufo.explosion.particles.splice(i,1);
		}

	}
};


var images = new Object();
images.add = function(src){
	var image = new Image();
	image.src = src;
	return image;
};
images.all = [
	new images.add("img/SpaceShip.gif"),
	new images.add("img/6B.png")
];
images.loaded = false;
images.load = function(){
	var imagesLoaded = 0;
	for(var i = 0; i < images.all.length; i++){
		images.all[i].addEventListener('load',function(){
			imagesLoaded++;
			if(imagesLoaded === images.all.length){
				images.loaded = true;
				game.isLoaded();
			}
		},false);
	}
};

var sound = new Object();
sound.add = function(src,volume){
	var sound = document.createElement('audio');
	var source = document.createElement('source');
	source.type = "audio/mpeg";
	source.src = src;
	sound.volume = volume;
	sound.appendChild(source);
	return sound;
};
sound.all = [
	new sound.add("sounds/music2.mp3",0.3),
	new sound.add("sounds/laser.mp3",1),
	new sound.add("sounds/explosion.mp3",1),
	new sound.add("sounds/explosion2.mp3",1),
	new sound.add("sounds/spaceshipExplosion.mp3",1),
	new sound.add("sounds/upgrade.mp3",1)
];
sound.loaded = false;
sound.load = function(){
	var soundsLoaded = 0;
	for(var i = 0; i < sound.all.length; i++){
		var soundFile = sound.all[i];
		soundFile.addEventListener("canplaythrough",function(){
			soundsLoaded++;
			if(soundsLoaded === sound.all.length){
				sound.loaded = true;
				game.isLoaded();
			}
		},false);
	}
};
sound.muteSounds = function(){
	sound.all[0].pause();
	for(var i = 0; i < sound.all.length; i++){
		var soundFile = sound.all[i];
		soundFile.pause();
	}
};
sound.play = function(index){
	if(sound.muted === false){
		sound.all[index].load();
		sound.all[index].play();
	}
};

var menu = new Object();
menu.draw =  function(){
	var ctx = screen.context;
	ctx.textAlign = "right";
	ctx.font = "10pt Arial";
	var y = 40;
	var newLine = 20;
	var padding = 20;
	if(sound.muted === false){
		ctx.fillText("M - Mute",screen.width - padding, y);
	} else {
		ctx.fillText("M - Unmute",screen.width - padding, y);
	}
	y += newLine;
	if(game.paused === false){
		ctx.fillText("P - Pause", screen.width - padding, y);
	} else {
		ctx.fillText("P - Unppause", screen.width - padding, y);
	}
	y += newLine;
	ctx.fillText("FullScreen Mode: F11", screen.width - padding,y);
	y += newLine;
	ctx.fillText("FPS: " + game.FPS, screen.width - padding, y);
	y += newLine;
	var cooldown = new Date().getTime() - spaceship.lastLaserFire;
	var cooldownLeft = spaceship.laserCoolDown - cooldown;
	if(cooldownLeft < 0){
		cooldownLeft = 0;
	}
	if(game.play){
		ctx.fillText("Laser Cooldown: " + cooldownLeft, screen.width - padding, y);
	}
};

var controls = new Object();

var key = new Object();
key.left = false;
key.right = false;
key.up = false;
key.down = false;
key.spacebar = false;
key.leftClick = false;

var frame = new Object();
frame.last = new Date().getTime();
frame.current;
frame.time = function(){
	frame.current = new Date().getTime();
	return frame.current - frame.last;
};
frame.key = 1;

var game = new Object();
game.score = 0;
game.highScore = 0;
game.FPS = 0;
game.currentFPS = 0;
game.lastFPSTime = new Date().getTime();
game.updateFPS = function(){
	game.currentFPS++;
	var currentTime = new Date().getTime();
	if(currentTime - game.lastFPSTime > 1000){
		game.FPS = game.currentFPS;
		game.currentFPS = 0;
		game.lastFPSTime = currentTime;
	}

};
game.checkHighScore = function(){
	if(game.score > game.highScore){
		game.highScore = game.score;
		alert("Congratulations! New high score!");
	}
};
game.drawScore = function(){
	var ctx = screen.context;
	ctx.textAlign = "left";
	ctx.font = "10pt Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + game.score,20, 40);
	if(game.highScore > 0){
		ctx.fillText("High score: " + game.highScore, 20, 60);
	}
};
game.drawGameOver = function(){
	var ctx = screen.context;
	ctx.textAlign = "center";
	ctx.font = "40pt Arial";
	ctx.fillStyle = "white";
	ctx.fillText("GAME OVER",screen.width / 2, screen.height / 2);
	ctx.font = "10pt Arial";
	ctx.fillText("Press Enter to Continue",screen.width / 2, screen.height / 2 + 100);
};
game.keydown = function(event) {
	switch(event.keyCode){
		case 37:
			key.left = true;
			break;
		case 38:
			key.up = true;
			break;
		case 39:
			key.right = true;
			break;
		case 40:
			key.down = true;
			break;
		case 32: //Spacebar
			key.spacebar = true;
			break;
		case 13: //Enter
			if(game.over){
				game.checkHighScore();
				game.reset();
			}
			else if(game.title){
				game.title = false;
				game.play = true;
				screen.canvas.webkitRequestFullscreen();
			}
			break;
		case 77: //M - Mute
			if(sound.muted === false){
				sound.muted = true;
				sound.muteSounds();
			} else {
				sound.muted = false;
				sound.play(0);
			}
			break;
		case 80: //P - Pause
			if(game.paused === false){
				game.paused = true;
			} else {
				game.paused = false;
			}
			break;
	}
};
game.keyup = function(event){
	switch(event.keyCode){
		case 37:
			key.left = false;
			break;
		case 38:
			key.up = false;
			break;
		case 39:
			key.right = false;
			break;
		case 40:
			key.down = false;
			break;
		case 32:
			key.spacebar = false;
			break;
	}
};
game.mouseDown = function(){
	key.leftClick = true;
	game.paused = false;
};
game.mouseUp = function(){
	key.leftClick = false;
};
game.loading = true;
game.title = false;
game.play = false;
game.over = false;
game.paused = false;
game.pause = function(){
	game.paused = true;
};
game.load = function(){
	star.load();
	images.load();
	sound.load();
};
game.isLoaded = function(){
	if(sound.loaded && images.loaded){
		game.loading = false;
		game.title = true;
		if(sound.muted === false){
			sound.all[0].play();
		}
	}
};
game.reset = function(){
	game.over = false;
	game.title = true;
	ufo.ufos = [];
	spaceship.lasers = [];
	spaceship.x = screen.width / 2;
	spaceship.laserCoolDown = spaceship.laserCoolDownMax;
	upgrades.all = new Array();
	game.score = 0;
	ufo.lastSpawnTime = 0;
	ufo.spawnRate = ufo.slowestSpawnRate;
	ufo.explosion.particles = new Array();
};
game.update = function(){
	if(game.paused === false)
		star.update();
	if(game.play && game.paused === false){
		star.update();
		spaceship.updatePosition();
		spaceship.updateLasers();
		spaceship.checkDamage();
		upgrades.update();
		ufo.update();
		ufo.explosion.update();
	}
	if(game.over){
		star.update();
		upgrades.update();
		ufo.update();
		ufo.explosion.update();
		spaceship.updateLasers();
	}
};
game.loop = function(){
	if(game.paused == false){
		game.update();
		screen.clear();
		screen.draw();
		game.updateFPS();
	}
	window.requestAnimationFrame(game.loop);
	frame.last = new Date().getTime();
};
game.scale = 1;

//Listeners
window.addEventListener("resize",screen.adjust,false);
window.addEventListener("mousemove",spaceship.move,false);
window.addEventListener("mousedown",game.mouseDown,false);
window.addEventListener("mouseup",game.mouseUp,false);
window.addEventListener("keydown",game.keydown,false);
window.addEventListener("keyup",game.keyup,false);
window.addEventListener("blur",game.pause,false);
sound.all[0].addEventListener("ended",sound.all[0].play,false);

//Load Game
game.load();

//Game Loop
game.loop();
