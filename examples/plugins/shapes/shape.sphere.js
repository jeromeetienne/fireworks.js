/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createShapeSphere	= function(positionX, positionY, positionZ, radius, boundingbox){
	var position	= new Fireworks.Vector(positionX, positionY, positionZ);
	return new Fireworks.ShapeSphere(position, radius);
};


/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} position the position of the sphere
 * @param {Number} radius the radius of the sphere
*/
Fireworks.ShapeSphere	= function(position, radius)
{
	this.position	= position;
	this.radius	= radius;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.ShapeSphere.prototype = new Fireworks.Shape();
Fireworks.ShapeSphere.prototype.constructor = Fireworks.ShapeSphere;

Fireworks.ShapeSphere.prototype.contains	= function(point){
	// compute distance between the point and the position
	var distance	= this._vector.sub(point, this.position).length();
	// return true if this distance is <= than sphere radius
	return distance <= this.radius;
}

Fireworks.ShapeSphere.prototype.randomPoint	= function(vector){
	var point	= vector	|| this._vector;
	// get a random point
	point.x	= Math.random()-0.5;
	point.y	= Math.random()-0.5;
	point.z	= Math.random()-0.5;
	// compute the length between the point 
	var length	= Math.random()*this.radius;
	// set the point at the proper distance;
	point.setLength( length );
	// add the position
	point.addSelf(this.position);
	// return the point
	return point;
}
