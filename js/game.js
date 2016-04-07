var game = {
	loaded: 0,
	images: [],
	audio: [],
	paused: false,
	scale: 1,
	score: 0,
	startTime: Date.now(),
	import: function(imports) {
		var isFileExt = function(filename, ext) {
			if (filename.split('.').pop() === ext) {
				return true;
			} else {
				return false;
			}
		};
		for(var i = 0; i < imports.length; i++) {
			var imp = null;
			//Images
			if(isFileExt(imports[i], "png") || isFileExt(imports[i], "jpg") || isFileExt(imports[i], "gif")) {
				imp = new Image();
				imp.src = imports[i];
				this.images.push(imp);
			//Audio
			} else if(isFileExt(imports[i], "mp3")) {
				imp = document.createElement('audio');
				imp.type = "audio/mpeg";
				imp.setAttribute("src", imports[i]);
				this.audio.push(imp);
			} else {
				console.error("Sorry I could not recognize the file extension. You probably didn't type the correct extension. I can recognize jpg, gif, png, and mp3 file extensions. Also make sure you include the full file path starting from the root.");
				break;
			}

			//Check if done loading everything
			var ready = function() {
				game.loaded++;
				if(game.loaded == imports.length - 1) {
					console.log("Load time: " + (Date.now() - game.startTime));
					game.ready();
				}
			};
			if(imp.type === "audio/mpeg") {
				imp.addEventListener("loadeddata", ready);
			} else {
				imp.addEventListener("load", ready);
			}
		}
	},
	canvas: document.createElement("canvas"),
	ctx: null,
	setupScreen: function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.backgroundColor = game.config.canvasColor;
		this.ctx = this.canvas.getContext("2d");
		document.body.style.margin = "0";
		document.body.style.padding = "0";
		document.body.style.overflow = "hidden";
		document.body.appendChild(this.canvas);
	},
	loadGif: new Image(),
	loadScreen: function() {
		this.loadGif.src = game.config.loadGif;
		this.loadGif.style.position = "absolute";
		this.loadGif.style.left = window.innerWidth / 2 - 800 / 2 + "px";
		this.loadGif.style.top = window.innerHeight / 2 - 600 / 2 + "px";
		document.body.appendChild(this.loadGif);
	},
	init: function() {
		this.loadScreen();
		this.setupScreen();
		this.import(this.config.assets);
	},
	ready: function() {
		console.log("game ready");
		this.loadGif.style.display = "none";
		this.loop();
	},
	update: function() {
		game.time.update();
		game.star.update();
		game.spaceship.update();
		game.ufo.update();
		game.upgrades.update();

	},
	draw: function() {
		this.ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
		game.star.draw();
		game.spaceship.draw();
		game.ufo.draw();
		game.upgrades.draw();
	},
	loop: function() {
		if(game.paused == false){
			game.update();
			game.draw();
		}
		requestAnimationFrame(game.loop);
	}
};
