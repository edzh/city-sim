var Building = function(mass, x, y, z, color) {
	this.mass = mass;
	this.x = x;
	this.y = y;
	this.z = z;
	this.color = 0xaaaaaa;
};

var BuildingBlock = function(x, y) {
  this.x = x;
  this.y = y;
};

var building = new Building(0, 25, 25, Math.random()*100);
