game.time = {
  distancePerSec: function(speed){
  	return speed * (game.time.frameDuration / 1000);
  },
  fps: 60,
  frameDuration: 16,
  lastTick: Date.now(),
  update: function() {
    var currentTick = Date.now();
    this.frameDuration = currentTick - this.lastTick;
    this.fps = (1000 / this.frameDuration).toFixed();
    this.lastTick = currentTick;
  }
}
