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
  	this.x = x;
  	this.y = 0 - height;
  	this.width = width * game.scale;
  	this.height = height * game.scale;
    this.speed = 200;
    this.rotation = 0;
  },
  add: function() {
  	this.particles.unshift(new this.particle());
  },
  particles: [],
  update: function(){
  	//Check for laser hit
  	this.checkDamage();
    this.move();

  	//Add UFO at spawn interval
  	var time = new Date().getTime();
  	if(time - this.lastSpawnTime > this.spawnRate){
  		this.add();
  		this.lastSpawnTime = time;
  	}

    this.despawn();
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
      game.drawImage(game.images[2], ufoship.x, ufoship.y, ufoship.width, ufoship.height, ufoship.rotation);
  	}
  },
  move: function(ufoship) {
    for(var i = 0; i < this.particles.length; i++){
  		var ufoship = this.particles[i];
      //Move UFO toward ship
      var speed = game.time.distancePerSec(ufoship.speed);
      ufoship.rotation = game.spaceship.x;
      if (Math.abs(ufoship.x - game.spaceship.x) > speed &&
        Math.abs(ufoship.y - game.spaceship.y) > speed &&
        game.state.gameover === false)
      {
        var delta_x = game.spaceship.x - ufoship.x;
        var delta_y = game.spaceship.y - ufoship.y;
        var goal_dist = Math.sqrt( (delta_x * delta_x) + (delta_y * delta_y) );
        var ratio = speed / goal_dist;
        var x_move = ratio * delta_x;
        var y_move = ratio * delta_y;
        ufoship.x += x_move;
        ufoship.y += y_move;

      } else {
        //If game over they keep decending
        ufoship.x += 0;
        ufoship.y += speed;
        //ufoship.rotation = 0;
      }

    }
  },
  despawn: function() {
    for(var i = 0; i < this.particles.length; i++) {
      var ufo = this.particles[i];
      if(ufo.y > window.innerHeight + ufo.height) {
        this.particles.splice(i,1);
      }
    }
  }
}
