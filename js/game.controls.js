game.controls = {
  draw:  function(){
  	var ctx = game.ctx;
  	ctx.textAlign = "right";
  	ctx.font = "10pt Arial";
  	var y = 40;
  	var newLine = 20;
  	var padding = 20;
  	if(sound.muted === false){
  		ctx.fillText("M - Mute",window.innerWidth - padding, y);
  	} else {
  		ctx.fillText("M - Unmute",window.innerWidth - padding, y);
  	}
  	y += newLine;
  	if(game.paused === false){
  		ctx.fillText("P - Pause", window.innerWidth - padding, y);
  	} else {
  		ctx.fillText("P - Unppause", window.innerWidth - padding, y);
  	}
  	y += newLine;
  	ctx.fillText("FullScreen Mode: F11", window.innerWidth - padding,y);
  	y += newLine;
  	ctx.fillText("FPS: " + game.FPS, window.innerWidth - padding, y);
  	y += newLine;
  	var cooldown = new Date().getTime() - spaceship.lastLaserFire;
  	var cooldownLeft = spaceship.laserCoolDown - cooldown;
  	if(cooldownLeft < 0){
  		cooldownLeft = 0;
  	}
  	if(game.play){
  		ctx.fillText("Laser Cooldown: " + cooldownLeft, window.innerWidth - padding, y);
  	}
  },
  keydown: function(event) {
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
  },
  keyup: function(event) {
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
  },
  mouseDown: function(){
  	game.controls.key.leftClick = true;
  	game.paused = false;
  },
  mouseUp: function() {
  	game.controls.key.leftClick = false;
  },
  key: {
    leftClick: false
  }
};

window.addEventListener("mousemove",game.spaceship.move, false);
window.addEventListener("mousedown",game.controls.mouseDown, false);
window.addEventListener("mouseup",game.controls.mouseUp, false);
window.addEventListener("keydown",game.controls.keydown, false);
window.addEventListener("keyup",game.controls.keyup, false);
window.addEventListener("blur",game.controls.pause, false);
