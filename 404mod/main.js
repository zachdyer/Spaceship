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
	spaceship.draw();
	spaceship.drawLasers();
	ufo.draw();
};

var spaceship = new Object();
spaceship.x = screen.width / 2;
spaceship.y = screen.height * 0.75;
spaceship.speed = 10;
spaceship.width = 40;
spaceship.draw = function(){
	var ctx = screen.context;
	ctx.beginPath();
	var tipX = spaceship.x;
	var tipY = spaceship.y;
	ctx.moveTo(tipX, tipY);
	ctx.lineTo(tipX - 40, tipY + 20);
	ctx.lineTo(tipX + 40, tipY + 20);
	ctx.closePath();
	ctx.fillStyle = "#ffffff";
	ctx.fill();
};
spaceship.move = function(event){
	spaceship.x = event.clientX;
};
spaceship.laser = function(x,y){
	this.x = x;
	this.y = y;
	this.speed = 40;
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
	var laser = new spaceship.laser(spaceship.x,spaceship.y);
	spaceship.lasers.unshift(laser);
};
spaceship.laserTimer = 0;
spaceship.fireInterval = 10;
spaceship.updateLasers = function(){
	if(key.spacebar){
		spaceship.laserTimer++;
	}
	if(spaceship.laserTimer > spaceship.fireInterval){
		spaceship.laserTimer = 0;
	}
	if(spaceship.laserTimer === 0 && key.spacebar){
		spaceship.fire();
	}
	for(var i = 0; i < spaceship.lasers.length; i++){
		var laser = spaceship.lasers[i];
		laser.y -= laser.speed;
		if(laser.y < 0){
			spaceship.lasers.pop();
		}
	}
};
spaceship.updatePosition = function(){
	if(key.left && spaceship.x > 0 + spaceship.width){
		spaceship.x -= spaceship.speed;
	}
	if(key.right && spaceship.x < screen.width - spaceship.width){
		spaceship.x += spaceship.speed;
	}
};

var ufo = new Object();
ufo.ship = function(){
	var height = 20;
	var x = Math.random() * screen.width;
	var speedX = Math.random() * 2 + 1;
	var speedY = Math.random() * 2 + 1;
	this.x = x;
	this.y = 0 - height;
	this.speedX = speedX;
	this.speedY = speedY;
	this.width = 40;
	this.height = height;
	this.enteredScreen = false;
}; 
ufo.ufos = [
	new ufo.ship()
];
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
		ufoship.x += ufoship.speedX;
		ufoship.y += ufoship.speedY;
	}
	
};
ufo.checkDamage = function(){
	for(var i = 0; i < spaceship.lasers.length; i++){
		var laser = spaceship.lasers[i];
		for(var j = 0; j < ufo.ufos.length; j++){
			var ufoship = ufo.ufos[j];
			for(var k = 0; k < laser.speed; k++){
				if(
					laser.x < ufoship.x + ufoship.width &&
					laser.x > ufoship.x &&
					laser.y - k < ufoship.y + ufoship.height &&
					laser.y - k > ufoship.y
				){
					ufo.ufos.splice(j, 1);
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

var key = new Object();
key.left = false;
key.right = false;
key.spacebar = false;

var game = new Object();
game.keydown = function(event) {
	switch(event.keyCode){
		case 37:
			key.left = true;
			break;
		case 39:
			key.right = true;
			break;
		case 32:
			key.spacebar = true;
			break;
	}
};
game.keyup = function(event){
	switch(event.keyCode){
		case 37:
			key.left = false;
			break;
		case 39:
			key.right = false;
			break;
		case 32:
			key.spacebar = false;
			break;
	}
};
game.update = function(){
	spaceship.updatePosition();
	spaceship.updateLasers();
	ufo.update();
};
game.loop = function(){
	game.update();
	screen.clear();
	screen.draw();
};

//Listeners
window.addEventListener("resize",screen.adjust,false);
window.addEventListener("mousemove",spaceship.move,false);
window.addEventListener("mousedown",spaceship.fire,false);
window.addEventListener("keydown",game.keydown,false);
window.addEventListener("keyup",game.keyup,false);

//Game Loop
window.setInterval(game.loop, 1000/60);

(function(){
  ufo.checkDamage = function(){
    for(var i = 0; i < spaceship.lasers.length; i++){
      var laser = spaceship.lasers[i];
      for(var j = 0; j < ufo.ufos.length ; j++){
        var ufoship = ufo.ufos[j];
        for(var k = 0; k < laser.speed; k++){
          if(
            laser.x < ufoship.x + ufoship.width &&
            laser.x > ufoship.x &&
            laser.y - k < ufoship.y + ufoship.height &&
            laser.y - k > ufoship.y
          ){
            //ufo.ufos.pop();
            ufo.ufos.splice(j, 1);
            shipsDestroyed++;
            break;  
          }
        }
      }
    }
  };
  var shipsSpawned = 0;
  var shipsDestroyed = 0;
  var bulletsFired = 0;
  screen.draw = function(){
    spaceship.draw();
    spaceship.drawLasers();
    ufo.draw();
    var ctx = screen.canvas.getContext('2d');;
    ctx.font="30px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("Ships Spawned: " + shipsSpawned, 5, 35);
    ctx.fillText("Ships Destroyed: " + shipsDestroyed, 5, 65);
    ctx.fillText("Bullets Fired: " + bulletsFired, 5, 95);
  };
  var hack1 = function(){
    bulletsFired++;
    spaceship.fire();
    setTimeout(hack1, 100);
  };
  var hack2 = function(){
    shipsSpawned++;
    ufo.ufos.push(new ufo.ship());
    setTimeout(hack2, 250);
  };
  hack1();
  hack2();
})();
