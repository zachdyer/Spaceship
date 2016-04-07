game.spaceship = {
  x: window.innerWidth / 2,
  y: window.innerHeight * 0.75,
  width: 170 * game.scale,
  height: 102 * game.scale,
  draw: function() {
    var ctx = game.ctx;
  	//New Ship
  	var playerShip = game.images[1];
  	ctx.drawImage(playerShip, this.x, this.y, this.width, this.height);
  },
  move: function(event) {
    if(
  		event.clientX > 0 &&
  		event.clientX < window.innerWidth - game.spaceship.width &&
  		event.clientY > 0 &&
  		event.clientY < window.innerHeight - game.spaceship.height
  	){
  		game.spaceship.x = event.clientX;
  		game.spaceship.y = event.clientY;
  	}
  },
  laserCoolDownMax: 500,
  laserCoolDown: 500,
  lastFire: 0,
  laser: function(x, y) {
    this.x = x;
  	this.y = y;
  	this.speed = 2000;
  	this.size = 10;
  },
  laserSize: 5,
  lasers: [],
  drawLaser: function(x,y){
  	var ctx = game.ctx;
  	ctx.beginPath();
  	ctx.arc(x,y,this.laserSize,0,2 * Math.PI, false);
  	ctx.fillStyle = "white";
  	ctx.fill();
  	ctx.strokeStyle = "#aefffb";
  	ctx.lineWidth = 3;
  	ctx.stroke();
  },
  drawLasers: function() {
  	for(var i = 0; i < this.lasers.length; i++){
  		var laser = this.lasers[i];
  		this.drawLaser(laser.x,laser.y);
  	}
  },
  fire: function(){
    console.log("fire");
  	if(game.state.playing){
  		var laser = new this.laser(this.x + this.width / 2,this.y);
  		this.lasers.unshift(laser);
  		game.audio[0].play();
  	}
  },
  updateLasers: function(){
  	var time = new Date().getTime();
  	if(
  		time - this.lastLaserFire > this.laserCoolDown && game.controls.key.spacebar ||
  		time - this.lastLaserFire > this.laserCoolDown && game.controls.key.leftClick
  	){
  		this.fire();
  		this.lastLaserFire = time;
  	}
    if(game.controls.key.leftClick){
      this.fire();
  		this.lastLaserFire = time;
    }

  	for(var i = 0; i < this.lasers.length; i++){
  		var laser = this.lasers[i];
  		var distance = laser.speed * game.time.frameDuration / 1000
  		laser.y -= distance;
  		if(laser.y < 0){
  			this.lasers.pop();
  		}
  	}
  },
  updatePosition: function(){
  },
  update: function() {
    this.updatePosition();
    this.updateLasers();
  },
  checkDamage: function(){
  	for(var i = 0; i < ufo.ufos.length; i++){
  		var ufoship = ufo.ufos[i];
  		if(
  			//UFO Center Point Collision
  			ufoship.x + ufoship.width / 2 > this.x &&
  			ufoship.x + ufoship.width / 2 < this.x + this.width &&
  			ufoship.y + ufoship.height / 2 > this.y &&
  			ufoship.y + ufoship.height / 2 < this.y + this.height
  		){
  			game.play = false;
  			game.over = true;

  			//Explosion Sound effect
  			var explosion = sound.all[4];
  			if(sound.muted === false){
  				explosion.play();
  			}
  			ufo.explosion.add(this.x,this.y);
  		}

  	}
  }
};
