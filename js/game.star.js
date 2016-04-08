game.star = {
  init: function() {
    var starCount = 100;
  	for(var i = 0; i < starCount; i++){
  		this.all.unshift(new this.particle());
  	}
  },
  update: function () {
    for(var i = 0; i < this.all.length; i++){
  		var currentStar = this.all[i];
  		var distance = currentStar.speed * game.time.frameDuration / 1000;
  		currentStar.y += distance;
  		if(currentStar.y > screen.height + currentStar.radius * 2){
  			currentStar.x = Math.random() * window.innerWidth;
  			currentStar.y = 0 - currentStar.radius * 2;
  		}
  	}
  },
  all: [],
  particle: function() {
    var minSpeed = 250;
  	this.speed = Math.random() * 500 + minSpeed;
  	this.radius = this.speed / 500;
  	this.x = Math.floor(Math.random() * window.innerWidth) - this.radius * 2;
  	this.y = Math.floor(Math.random() * window.innerHeight);
  	var colors = ['white','cyan','white','green','yellow','white'];
  	var randNum = Math.floor(Math.random() * colors.length);
  	this.color = colors[randNum];
  },
  draw: function() {
    var ctx = game.ctx;
  	for(var i = 0; i < this.all.length; i++){
  		var currentStar = this.all[i];
  		ctx.fillStyle = currentStar.color;
  		ctx.beginPath();
  		ctx.arc(currentStar.x, currentStar.y, currentStar.radius, 0, 2 * Math.PI, false);
  		ctx.fill();
      ctx.closePath();
  	}
  },

};
