/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} center the center of the sphere
 * @param {Number} radius the radius of the sphere
*/
Fireworks.ShapeSphere	= function(center, radius)
{
	this.center	= center;
	this.radius	= radius;
console.log("sphere", this.center.toString(), this.radius)
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.ShapeSphere.prototype = new Fireworks.Shape();
Fireworks.ShapeSphere.prototype.constructor = Fireworks.ShapeSphere;

Fireworks.ShapeSphere.prototype.contains	= function(point){
	// compute distance between the point and the center
	var distance	= this._vector.sub(point, center).length();
	// return true if this distance is <= than sphere radius
	return distance <= this.radius;
}

Fireworks.ShapeSphere.prototype.randomPoint	= function(){
	var point	= this._vector;
	// get a random point
	point.x	= Math.random()-0.5;
	point.y	= Math.random()-0.5;
	point.z	= Math.random()-0.5;
	// compute the length between the point 
	var length	= Math.random()*this.radius;
	// set the point at the proper distance;
	point.setLength( length );
	// add the center
	point.addSelf(this.center);
	// return the point
	return point;
}
