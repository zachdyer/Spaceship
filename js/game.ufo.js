game.ufo = {
  lastSpawnTime: 0,
  fastestSpawnRate: 1 * 1000,
  slowestSpawnRate: 5 * 1000,
  spawnRate: 5 * 1000,
  particle: function(){
    var width = 114;
  	var height = 200;
  	var x = Math.random() * screen.width - width;
  	if(x < 0){
  		x = 0;
  	}
  	var speedX = Math.random() * 200 + 100;
  	var chance = Math.random();
  	var speedY = Math.random() * 200 + 100;
  	this.x = x;
  	this.y = 0 - height;
  	this.speedX = speedX;
  	this.speedY = speedY;
  	this.width = width * game.scale;
  	this.height = height * game.scale;
  	this.enteredScreen = false;
  },
  add: function() {
  	this.particles.unshift(new this.particle());
  },
  particles: [],
  update: function(){
  	//Check for laser hit
  	this.checkDamage();

  	//Update Position
  	for(var i = 0; i < this.particles.length; i++){
  		var ufoship = this.particles[i];

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

      if(game.spaceship.x > ufoship.x) {
        var distanceX = game.time.distancePerSec(ufoship.speedX);
      } else {
        var distanceX = game.time.distancePerSec(-ufoship.speedX);
      }

      if(game.spaceship.y > ufoship.y) {
        var distanceY = game.time.distancePerSec(ufoship.speedY);
      } else {
        var distanceY = game.time.distancePerSec(-ufoship.speedY);
      }
  		//var distanceX = game.time.distancePerSec(ufoship.speedX);
  		//var distanceY = game.time.distancePerSec(ufoship.speedY);
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
  		for(var j = 0; j < this.particles.length; j++){
  			var ufoship = this.particles[j];
  			var distance = laser.speed * game.time.frameDuration / 1000;
  			for(var k = 0; k < distance; k++){
  				if(
  					laser.x < ufoship.x + ufoship.width &&
  					laser.x > ufoship.x &&
  					laser.y - k < ufoship.y + ufoship.height &&
  					laser.y - k > ufoship.y
  				){

            //Destroy UFO
  					game.explosion.add(ufoship.x,ufoship.y);
  					this.particles.splice(j, 1);

  					//Sound Effect
  					var random = Math.floor(Math.random() * 2) + 2;
  					var explosionSound = game.audio[random];
  					explosionSound.load();
  					if(game.state.muted === false) {
              explosionSound.play();
            }

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
  	for(var i = 0; i < this.particles.length; i++){
  		var ufoship = this.particles[i];
  		var ctx = game.ctx;
      ctx.drawImage(game.images[2], ufoship.x, ufoship.y, ufoship.width, ufoship.height);
  	}
  }
}
