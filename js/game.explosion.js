game.explosion = {
  particle: function(x,y) {
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
  },
  particles: [],
  flash: function(x,y) {
  	var ctx = game.ctx;
  	ctx.fillStyle = "white";
  	ctx.beginPath();
  	var radius = Math.floor(Math.random() * 50) + 50;
  	ctx.arc(x,y,radius,0, 2 * Math.PI, false);
  	ctx.fill();
  },
  add: function(x,y) {
  	var particleCount = 50;
  	for(var i = 0; i < particleCount; i++){
  		this.particles.unshift(new this.particle(x,y));
  	}
  },
  draw: function() {
  	for(var i = 0; i < this.particles.length; i++){
  		var ctx = game.ctx;
  		var particle = this.particles[i];
  		ctx.beginPath();
  		ctx.arc(particle.x,particle.y,particle.size, 0, 2 * Math.PI, false);
  		ctx.fillStyle = particle.color;
  		ctx.fill();
  	}
  },
  update: function() {
  	for(var i = 0; i < this.particles.length; i++){
  		var particle = this.particles[i];

  		//Move particle
  		var distanceX = game.time.distancePerSec(particle.speedX);
  		var distanceY = game.time.distancePerSec(particle.speedY);
  		particle.x += distanceX;
  		particle.y += distanceY;

  		//Check if particle left the bounds
  		if(particle.y < 0 - particle.size * 2){
  			this.particles.splice(i,1);
  		} else if(particle.x > screen.width + particle.size * 2){
  			this.particles.splice(i,1);
  		} else if(particle.y > screen.height + particle.size * 2){
  			this.particles.splice(i,1);
  		} else if(particle.x < 0 - particle.size * 2){
  			this.particles.splice(i,1);
  		}
  	}
  }
}
