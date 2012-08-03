/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createShapeBox	= function(positionX, positionY, positionZ, sizeX, sizeY, sizeZ){
	var position	= new Fireworks.Vector(positionX, positionY, positionZ);
	var size	= new Fireworks.Vector(sizeX, sizeY, sizeZ);
	return new Fireworks.Shape.Box(position, size);
};

/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} position the position of the sphape
 * @param {Fireworks.Vector} shape the size of the shape
*/
Fireworks.Shape.Box	= function(position, size)
{
	this.position	= position;
	this.size	= size;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.Shape.Box.prototype = new Fireworks.Shape();
Fireworks.Shape.Box.prototype.constructor = Fireworks.Shape.Box;

Fireworks.Shape.Box.prototype.contains	= function(point){
	// compute delta between the point and the position
	var delta	= this._vector.sub(point, this.position);
	// test the delta is too far
	if( Math.abs(delta.x) > this.size.x/2 )	return false;
	if( Math.abs(delta.y) > this.size.y/2 )	return false;
	if( Math.abs(delta.z) > this.size.z/2 )	return false;
	// if all tests, passed true
	return true;
}

Fireworks.Shape.Box.prototype.randomPoint	= function(vector){
	var point	= vector	|| this._vector;
	// get a random point
	point.x	= Math.random() * this.size.x - this.size.x/2;
	point.y	= Math.random() * this.size.y - this.size.y/2;
	point.z	= Math.random() * this.size.z - this.size.z/2;
	// add this.position
	point.addSelf(this.position);
	// return the point
	return point;
}
