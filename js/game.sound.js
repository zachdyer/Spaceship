game.sound = {
  add: function(src,volume) {
  	var sound = document.createElement('audio');
  	var source = document.createElement('source');
  	source.type = "audio/mpeg";
  	source.src = src;
  	this.volume = volume;
  	this.appendChild(source);
  	return sound;
  },
  loaded: false,
  load: function() {
  	var soundsLoaded = 0;
  	for(var i = 0; i < this.all.length; i++){
  		var soundFile = this.all[i];
  		soundFile.addEventListener("canplaythrough",function(){
  			soundsLoaded++;
  			if(soundsLoaded === this.all.length){
  				this.loaded = true;
  				game.isLoaded();
  			}
  		}, false);
  	}
  },
  muteSounds: function() {
  	this.all[0].pause();
  	for(var i = 0; i < this.all.length; i++){
  		var soundFile = this.all[i];
  		soundFile.pause();
  	}
  },
  play: function(index) {
  	if(this.muted === false){
  		this.all[index].load();
  		this.all[index].play();
  	}
  },
  muted: false
};
