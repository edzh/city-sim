var Building = function(mass, x, y, z, color) {
	this.mass = mass;
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = 0xaaaaaa;
}

var building = new Building(0, 25, 25, Math.random()*100);
