/**
 * Shortcut to create Fireworks.Shape.Point
*/
Fireworks.createShapePoint	= function(positionX, positionY, positionZ){
	var position	= new Fireworks.Vector(positionX, positionY, positionZ);
	return new Fireworks.Shape.Point(position);
};

/**
 * Handle a Firework.Shape forming a point
 *
 * @param {Fireworks.Vector} position the position of the point
*/
Fireworks.Shape.Point	= function(position)
{
	this.position	= position;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.Shape.Point.prototype = new Fireworks.Shape();
Fireworks.Shape.Point.prototype.constructor = Fireworks.Shape.Point;

Fireworks.Shape.Point.prototype.contains	= function(point){
	if( point.x !== this.position.x )	return false;
	if( point.y !== this.position.y )	return false;
	if( point.z !== this.position.z )	return false;
	// if all tests, passed true
	return true;
}

Fireworks.Shape.Point.prototype.randomPoint	= function(vector){
	var point	= vector	|| this._vector;
	// get a random point
	point.copy(this.position);
	// return the point
	return point;
}
