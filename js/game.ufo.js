game.ufo = {
  lastSpawnTime: 0,
  fastestSpawnRate: 1 * 1000,
  slowestSpawnRate: 5 * 1000,
  spawnRate: 5 * 1000,
  particle: function(){
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
  },
  add: function() {
  	this.all.unshift(new this.particle());
  },
  all: [],
  update: function(){
  	//Check for laser hit
  	this.checkDamage();

  	//Update Position
  	for(var i = 0; i < this.all.length; i++){
  		var ufoship = this.all[i];

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
  		var distanceX = game.time.distancePerSec(ufoship.speedX);
  		var distanceY = game.time.distancePerSec(ufoship.speedY);
  		ufoship.x += distanceX;
  		ufoship.y += distanceY;
  	}

  	//Add UFO at spawn interval
  	var time = new Date().getTime();
  	if(time - this.lastSpawnTime > this.spawnRate){
  		this.add();
  		this.lastSpawnTime = time;
  	}
  },
  checkDamage: function() {
  	for(var i = 0; i < game.spaceship.lasers.length; i++){
  		var laser = game.spaceship.lasers[i];
  		for(var j = 0; j < this.all.length; j++){
  			var ufoship = this.all[j];
  			var distance = laser.speed * frame.time() / 1000;
  			for(var k = 0; k < distance; k++){
  				if(
  					laser.x < ufoship.x + ufoship.width &&
  					laser.x > ufoship.x &&
  					laser.y - k < ufoship.y + ufoship.height &&
  					laser.y - k > ufoship.y
  				){
  					//Destroy UFO
  					game.explosion.add(ufoship.x,ufoship.y);
  					this.all.splice(j, 1);

  					//Sound Effect
  					var random = Math.floor(Math.random() * 2) + 2;
  					var explosionSound = game.sound.all[random];
  					explosionSound.load();
  					if(game.sound.muted === false)
  						explosionSound.play();

  					//Destroy Laser
  					game.spaceship.lasers.splice(i,1);

  					//Increment Score
  					game.score++;

  					//Decrement UFO Spawn Rate
  					if(this.spawnRate > this.fastestSpawnRate){
  						this.spawnRate -= 1000;
  					}

  					//No use in continuing with the loop
  					break;
  				}
  			}
  		}
  	}
  },
  draw: function() {
  	for(var i = 0; i < this.all.length; i++){
  		var ufoship = this.all[i];
  		var ctx = game.ctx;
  		ctx.beginPath();
  		ctx.moveTo(ufoship.x + ufoship.width / 2, ufoship.y);
  		ctx.lineTo(ufoship.x, ufoship.y + ufoship.height / 2);
  		ctx.lineTo(ufoship.x + ufoship.width / 2, ufoship.y + ufoship.height);
  		ctx.lineTo(ufoship.x + ufoship.width, ufoship.y + ufoship.height / 2);
  		ctx.closePath();
  		ctx.fillStyle = "white";
  		ctx.fill();
  	}
  }
}
