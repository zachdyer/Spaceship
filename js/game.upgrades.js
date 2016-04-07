game.upgrades = {
  lastSpawn: 0,
  spawnRate: 10 * 1000,
  all: [],
  particle: function(type) {
  	var radius = 20;
  	this.radius = radius;
  	var x = Math.random() * window.innerWidth - (radius * 2);
  	this.x = x;
  	this.y = 0 - (radius * 2);
  	this.speed = 200;
  	this.type = type;
  	this.color;
  },
  update: function() {
  	//Timer to add new upgrades
  	var time = new Date().getTime();
  	if(time - this.lastSpawn > this.spawnRate){
  		this.all.unshift(new this.particle('cooldown'));
  		this.lastSpawn = time;
  	}
  	for(var i = 0; i < this.all.length; i++){
  		var upgrade = this.all[i];
  		//Move upgrade
  		var distance = game.time.distancePerSec(upgrade.speed);
  		upgrade.y += distance;

  		//Check center point collision
  		if(
  			upgrade.x + upgrade.radius > game.spaceship.x &&
  			upgrade.x + upgrade.radius < game.spaceship.x + game.spaceship.width &&
  			upgrade.y + upgrade.radius > game.spaceship.y &&
  			upgrade.y + upgrade.radius < game.spaceship.y + game.spaceship.height
  		){
  			//Delete from array
  			this.all.splice(i,1);

  			//Add upgrade
  			switch(upgrade.type) {
  				case "cooldown":
            console.log("upgrade");
  					game.audio[5].currentTime = 0.5;
            game.audio[5].volume = 0.25;
  					if(game.state.muted === false)
  						game.audio[5].play();
  					game.spaceship.laserCoolDown -= 50;
  					break;
  			}
  		}

  		//Delete from array if off the screen
  		if(upgrade.y > screen.height + upgrade.radius * 2){
  			this.all.splice(i,1);
  		}
  	}
  },
  draw: function() {
  	for(var i = 0; i < this.all.length; i++){
  		var upgrade = this.all[i];
  		var ctx = game.ctx;
  		ctx.beginPath();
  		ctx.arc(upgrade.x + upgrade.radius, upgrade.y + upgrade.radius, upgrade.radius,0,Math.PI * 2, false);
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
  }
};
