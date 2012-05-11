/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createBox	= function(centerX, centerY, centerZ, sizeX, sizeY, sizeZ){
	var center	= new Fireworks.Vector(centerX, centerY, centerZ);
	var size	= new Fireworks.Vector(sizeX, sizeY, sizeZ);
	return new Fireworks.Shape.Box(center, size);
};

/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} center the center of the sphape
 * @param {Fireworks.Vector} shape the size of the shape
*/
Fireworks.Shape.Box	= function(center, size)
{
	this.center	= center;
	this.size	= size;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.Shape.Box.prototype = new Fireworks.Shape();
Fireworks.Shape.Box.prototype.constructor = Fireworks.Shape.Box;

Fireworks.Shape.Box.prototype.contains	= function(point){
	// compute delta between the point and the center
	var delta	= this._vector.sub(point, this.center);
	// test the delta is too far
	if( Math.abs(delta.x) > this.size.x/2 )	return false;
	if( Math.abs(delta.y) > this.size.y/2 )	return false;
	if( Math.abs(delta.z) > this.size.z/2 )	return false;
	// if all tests, passed true
	return true;
}

Fireworks.Shape.Box.prototype.randomPoint	= function(){
	var point	= this._vector;
	// get a random point
	point.x	= Math.random() * this.size.x - this.size.x/2;
	point.y	= Math.random() * this.size.y - this.size.y/2;
	point.z	= Math.random() * this.size.z - this.size.z/2;
	// return the point
	return point;
}
