//var spacing = 75;-

window.Game = {};

(function() {
	function Entity(pos, left, right, up, down, species, name, size, comps) {
		this.x = pos[0];
		this.y = pos[1];
		this.cent = [this.x, this.y];
		this.times = [0, 0];
		this.dests = [[0], [0]];
		this.relx = 0;
		this.rely = 1;
		this.left = left || this.x;
		this.leftmost = this.x;
		this.right = right || this.x;
		this.rightmost = this.x;
		this.up = up || this.y;
		this.upmost = this.y;
		this.down = down || this.y;
		this.downmost = this.y;
		this.species = species || "squees";
		this.name = name || "Lampy";
		this.size = size || 5;
		this.buddies = comps || [[null, [this.x+1, this.y-1], [this.x+2, this.y-1]], 
		[[this.x, this.y], [this.x+1, this.y], [this.x+2, this.y]]];
		this.findedges();
		this.set();
		this.center();
		console.log(this.cent);
	}
	Entity.prototype.findedges = function() {
		var i;
		var l = this.buddies.length;
		var r = this.buddies[0].length;
		for (i = 0; i < r; i++) {
			if (this.buddies[0][i] != null) this.upmost = [0, i];
			if (this.buddies[l - 1][i] != null) this.downmost = [l - 1, i];
		}
		for (i = 0; i < l; i++) {
			if (this.buddies[i][0] != null) this.leftmost = [i, 0];
			if (this.buddies[i][r - 1] != null) this.rightmost = [i, r - 1];
		}
	}
	Entity.prototype.set = function() {
		this.left = this.buddies[this.leftmost[0]][this.leftmost[1]][0];
		this.right = this.buddies[this.rightmost[0]][this.rightmost[1]][0];
		this.up = this.buddies[this.upmost[0]][this.upmost[1]][1];
		this.down = this.buddies[this.downmost[0]][this.downmost[1]][1];
	}
	Entity.prototype.center = function() {
		this.cent[0] = (this.right + this.left) / 2;
		this.cent[1] = (this.down + this.up) / 2;
		//console.log(this.cent);
	}
	Entity.prototype.add = function(pos) {
		
	}
	Entity.prototype.applyall = function(x, y) {
		var i;
		var j;
		for (i = 0; i < this.buddies.length; i++) {
			for (j = 0; j < this.buddies[i].length; j++) {
				if (this.buddies[i][j] == null) continue;
				if (i == this.rely && j == this.relx) {
					if (x || y != 0) {
						//console.log(this.cent[0]);
						//console.log(this.buddies[i][j][0] + " gets " + x + " and " + this.buddies[i][j][1] + " gets " + y);
					}
				}
				this.buddies[i][j][0] += x;
				this.buddies[i][j][1] += y;
				if (i == this.rely && j == this.relx) {
					if (x || y != 0) {
						//console.log("Which results in " + this.buddies[i][j]);
					}
				}
			}
		}
	}
	Entity.prototype.move = function(now, trutime, pos, sides, newloc, timing) {
		if (trutime[0] == 0 && trutime[1] == 0) return false;
		var check = false;
		if (trutime[0] != 0) {
			var base = Math.floor(this.buddies[pos[0]][pos[1]][0]);
			if (Math.abs(trutime[0]) < now) {
				if ((this.buddies[pos[0]][pos[1]] % 1).toFixed(3) != 0.5) {
					this.buddies[pos[0]][pos[1]][0] = base + 0.5;
				}
			}
			else if (Math.abs(trutime[0]) - timing <= now) {
				check = true;
				var perc = 1 - (Math.abs(trutime[0]) - now) / timing;
				var amount = Math.abs(Math.sin(perc * Math.PI)/2);
				if (perc > 0.5) {
					amount = 0.5 - amount;				
					if (base != newloc[0]) base = newloc[0];
					if (sides[0] == -1) {
						this.buddies[pos[0]][pos[1]][0] = base + (1 - amount);
					}
					else {
						this.buddies[pos[0]][pos[1]][0] = base + sides[0] * amount;
					}
				}
				else {
					this.buddies[pos[0]][pos[1]][0] = base + sides[0] * amount + 0.5;
				}
			}
		}
		if (trutime[1] != 0) {
			var base = Math.floor(this.buddies[pos[0]][pos[1]][1]);
			if (Math.abs(trutime[1]) < now) {
				if ((this.buddies[pos[0]][pos[1]] % 1).toFixed(3) != 0.5) {
					this.buddies[pos[0]][pos[1]][1] = base + 0.5;
				}
			}
			else if (Math.abs(trutime[1]) - timing <= now) {
				check = true;
				var perc = 1 - (Math.abs(trutime[1]) - now) / timing;
				var amount = Math.abs(Math.sin(perc * Math.PI)/2);
				if (perc > 0.5) {
					amount = 0.5 - amount;
					if (base != newloc[1]) base = newloc[1];
					if (sides[1] == -1) {
						this.buddies[pos[0]][pos[1]][1] = base + (1 - amount);
					}
					else {
						this.buddies[pos[0]][pos[1]][1] = base + sides[1] * amount;
					}
				}
				else {
					this.buddies[pos[0]][pos[1]][1] = base + sides[1] * amount + 0.5;
				}
			}
		}
		return check;
	}
	Entity.prototype.cascade = function(now, timing) {
		if (this.times[0] == 0 && this.times[1] == 0) return;
		var i, j;
		var recon = [0, 0];
		var sides = [this.times[0] / Math.abs(this.times[0]), this.times[1] / Math.abs(this.times[1])];
		var check = false;
		var imax = this.buddies.length;
		for (i = 0; i < imax; i++) {
			var jmax = this.buddies[i].length;
			for (j = 0; j < jmax; j++) {
				if (this.buddies[i][j] != null) {
					if (this.times[0] != 0) {
						var x = this.times[0] < 0 ? j : (jmax - j - 1);
						var unit = timing * .2;
						recon[0] = this.times[0] < 0 ? this.times[0] - unit * x : this.times[0] + unit * x;
					}
					if (this.times[1] != 0) {
						var y = this.times[1] < 0 ? i : (imax - i - 1);
						var unit = timing * .2;
						recon[1] = this.times[1] < 0 ? this.times[1] - unit * y : this.times[1] + unit * y;
					}
					if (this.move(now, recon, [i, j], sides, 
					[this.dests[0][1] - (jmax - j - 1), this.dests[1][1] - (imax - i - 1)], timing)) check = true;
				}
			}
		}
		if (!check) {
			this.times[0] = 0;
			this.times[1] = 0;
			this.dests[0] = [];
			this.dests[1] = [];
		}
		else {
			this.set();
			this.center();
		}
		//this.set();
		//this.center();
	}
	Game.Entity = Entity;
})();

(function() {
	function Camera(obj, center) {
		this.following = obj || null;
		this.center = center || [12.5, 6];
		this.sight = [];
		this.zoom = 0;
		this.overcenter = [0, 0];
		console.log("Camera's set up");
		//this.setsights();
	}
	Camera.prototype.center = function(pos) {
		var check = pos;
		if (!check) {
			if (!this.following) return false;
			check = [this.cent[0], this.cent[1]];
		}
		return [this.center[0] - check[0], this.center[1] - check[1]];
	}
	Camera.prototype.fauxcenter = function() {
		//console.log(this.center, this.following.cent);
		return [this.center[0] - this.following.cent[0], this.center[1] - this.following.cent[1]];
	}
	Camera.prototype.setsights = function() {
		this.zoom = Math.floor(this.following.size / 3);
		this.sight[0] = this.following.relx + 10 + (0.5 * this.zoom);
		this.sight[1] = this.following.buddies[0].length - this.following.relx + 10 + (0.5 * this.zoom);
		this.sight[2] = this.following.rely + 6 + (0.5 * this.zoom);
		this.sight[3] = this.following.buddies.length - this.following.rely + 6 + (0.5 * this.zoom);
	}
	Camera.prototype.rightdist = function(check, checkee, limit) {
		var compare;
		if (check < checkee) {
			compare = checkee - limit;
		}
		else {
			compare = checkee + limit;
		}
		return Math.min(check - checkee, check - compare);
	}
	Camera.prototype.translate = function(objs, pos, limits) {
		if (!objs || objs.length == 0) return false;
		var check = pos;
		if (!check) {
			if (!this.following) return false;
			check = [this.following.x, this.following.y];
		}
		var temp = objs;
		var i, x, y, move;
		for (i = 0; i < objs.length; i++) {
			for (x = 0; x < objs[i].buddies.length; x++) {
				for (y = 0; y < objs[i].buddies[x].length; y++) {
					if (objs[i].buddies[x][y] == null) continue;
					temp[i].buddies[x][y] = [this.center[0] - this.rightdist(check[0], objs[i].buddies[x][y][0]
					, limits[0]), this.center[1] - this.rightdist(check[1], objs[i].buddies[x][y][1], limits[1])];
				}
			}
		}
		return temp;
	}
	Camera.prototype.follow = function() {
		var vals = this.fauxcenter();
		this.following.set();
		this.following.center();
		return vals;
	}
	Game.Camera = Camera;
})();

(function() {
	function World(size) {
		this.x = size[0];
		this.y = size[1];
		this.lamps = [];
	}
	World.prototype.get = function(x, y, xlen, ylen) {
		var i;
		var xmin = xlen > 0 ? Math.ceil(xlen) : Math.floor(xlen);
		var xmax = Math.abs(xmin) + 1;
		for (i = xmin; i < xmax; i++) {
			
		}
	}
	World.prototype.move = function(origin, to) {
		var temp = origin;
		temp[0] += to[0];
		temp[1] += to[1];
		if (temp[0] >= this.x) temp[0] = temp[0] % this.x;
		if (temp[0] < 0) temp[0] = this.x - temp[0];
		if (temp[1] >= this.y) temp[1] = temp[1] % this.y;
		if (temp[1] < 0) temp[1] = this.y - temp[1];
		return temp;
	}
	Game.World = World;
})();

(function() {
	function Player(obj) {
		this.obj = obj;
		console.log(obj);
		this.see = [];
	}
	Player.prototype.update = function(now) {
		var timing = 450;
		if (this.obj.times[0] == 0) {
			if (!(Game.controls.left && Game.controls.right)) {
				if (Game.controls.left) {
					this.obj.times[0] = -(now + timing);
					this.obj.dests[0] = [Math.floor(this.obj.right), Math.floor(this.obj.right) - 1];
				}
				if (Game.controls.right) {
					this.obj.times[0] = now + timing;
					this.obj.dests[0] = [Math.floor(this.obj.right), Math.floor(this.obj.right) + 1];
				}
			}
		}
		if (this.obj.times[1] == 0) {
			if (!(Game.controls.up && Game.controls.down)) {
				if (Game.controls.up) {
					this.obj.times[1] = -(now + timing);
					this.obj.dests[1] = [Math.floor(this.obj.down), Math.floor(this.obj.down) - 1];
				}
				if (Game.controls.down) {
					this.obj.times[1] = now + timing;
					this.obj.dests[1] = [Math.floor(this.obj.down), Math.floor(this.obj.down) + 1];
				}
			}
		}
		this.obj.cascade(now, timing);
	}
	Game.Player = Player;
})();

(function() {
	function Artist(spacing) {
		this.spacing = spacing || 75;
		this.colors = {'zimfs': 'blue',
		'dols': 'green',
		'squees': 'red',
		'turbs': 'yellow'}
		this.shift = [0, 0];
		this.limits = [[0, 200], [0, 100]];
	}
	Artist.prototype.drawLine = function(contex, start, end) {
		contex.beginPath();
		contex.moveTo(start[0], start[1]);
		contex.lineTo(end[0], end[1]);
		contex.stroke();
	}
	Artist.prototype.drawRect = function(contex, filled, dims, ind) {
		//if (ind) console.log(dims);
		if (filled) {
			contex.fillRect(dims[0], dims[1], dims[2], dims[3]);
		}
		else{
			contex.strokeRect(dims[0], dims[1], dims[2], dims[3]);
			contex.stroke();
		}
	}
	Artist.prototype.adjust = function(dims) {
		return [dims[0] + (this.shift[0] * this.spacing), dims[1] + (this.shift[1] * this.spacing), dims[2], dims[3]];
	}
	Artist.prototype.calculateDims = function(pos) {
		var temp = [this.spacing, this.spacing];
		var afterx = (pos[0] % 1).toFixed(3);
		var aftery = (pos[1] % 1).toFixed(3);
		temp.splice(0, 0, (~~pos[1]) * this.spacing);
		temp.splice(0, 0, (~~pos[0]) * this.spacing);
		if (afterx == 0.5) {
			if (aftery == 0.5) {
				return this.adjust(temp);
			}
		}
		var perc = Math.abs((aftery - 0.5) * 2);
		temp[3] -= this.spacing * perc;
		if (aftery > 0.5) temp[1] += this.spacing * perc;
		
		var perc = Math.abs((afterx - 0.5) * 2);
		temp[2] -= this.spacing * perc;
		if (afterx > 0.5) temp[0] += this.spacing * perc;
		return this.adjust(temp);
	}
	Artist.prototype.drawGrid = function(contex, width, height) {
		var xmax = (width / this.spacing) + 1;
		var ymax = (height / this.spacing) + 1;
		var i, xres, yres;
		for (i = 0; i < xmax; i++) {
			xres = (i * this.spacing) + (this.shift[0] * this.spacing);
			this.drawLine(contex, [xres, 0], [xres, height]);
		}
		for (i = 0; i < ymax; i++) {
			yres = (i * this.spacing) + (this.shift[1] * this.spacing);
			this.drawLine(contex, [0, yres], [width, yres]);
		}
	}
	Artist.prototype.drawEntity = function(contex, obj) {
		var i, j, ind;
		var col = this.colors[obj.species];
		contex.fillStyle = col;
		for (i = 0; i < obj.buddies.length; i++) {
			var len = obj.buddies[i].length;
			for (j = 0; j < len; j++) {
				if (obj.buddies[i][j] != null) {
					if (i == obj.rely && j == obj.relx) ind = 1;
					else ind = 0;
					this.drawRect(contex, true, this.calculateDims(obj.buddies[i][j]), ind);
				}
			}
		}
	}
	Game.Artist = Artist;
})();

(function() {
	var canvas = document.getElementById("gCan");
	var context = canvas.getContext("2d");
	
	Game.resize = function() {
		return [window.innerWidth, window.innerHeight];
	}

	canvas.width = Game.resize()[0];
	canvas.height = Game.resize()[1];
	
	var now = 0;
	var last = 0;
	var step = now-last;
	
	var offset = [0, 0];
	
	var artist = new Game.Artist(75);
	
	var playbox = new Game.Entity([3.5, 2.5]);
	var player = new Game.Player(playbox);
	
	var camera = new Game.Camera(player.obj, [(canvas.width / artist.spacing) / 2, (canvas.height / artist.spacing) / 2]);
	camera.follow([player.obj]);
	
	var update = function(now, step) {
		player.update(now);
	}
	
	var draw = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		artist.drawEntity(context, player.obj);
		artist.drawGrid(context, canvas.width, canvas.height);
	}
	
	var gameLoop = function(timestamp) {
		now = timestamp;
		step = (now-last) / 1000;
		last = now;
		
		update(now);
		artist.shift = camera.follow([player.obj]);
		draw();
		requestAnimationFrame(gameLoop);
	}
	
	Game.play = function() {
		requestAnimationFrame(gameLoop);
	}
})();

Game.controls = {
	left: false,
	up: false,
	right: false,
	down: false,
};

window.addEventListener("keydown", function(e) {
	switch(e.keyCode) {
		case 37:
			Game.controls.left = true;
			//console.log("left");
			break;
		case 38:
			Game.controls.up = true;
			//console.log("up");
			break;
		case 39:
			Game.controls.right = true;
			//console.log("right");
			break;
		case 40:
			Game.controls.down = true;
			//console.log("down");
			break;
	}
}, false);

window.addEventListener("keyup", function(e) {
	switch(e.keyCode) {
		case 37:
			Game.controls.left = false;
			break;
		case 38:
			Game.controls.up = false;
			break;
		case 39:
			Game.controls.right = false;
			break;
		case 40:
			Game.controls.down = false;
			break;
	}
}, false);

window.addEventListener("resize", function() {
	var c = document.getElementById("gCan");
	res = Game.resize();
	c.width = res[0];
	c.height = res[1];
}, true);

window.onload = function() {
	Game.play();
}