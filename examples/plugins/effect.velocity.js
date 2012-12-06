/**
 * Create a velocity effect
 * @param {Fireworks.Shape}	shape	set the direction of the velocity by a randompoint in this shape
 * @param {Number?}		speed	set the speed itself. if undefined, keep randompoint length for speed
*/
Fireworks.EffectsStackBuilder.prototype.velocity	= function(shape, speed)
{
	Fireworks.createEffect('velocity', {
		shape	: shape, 
		speed	: speed !== undefined ? speed : -1
	}).onCreate(function(particle){
		particle.velocity = {
			vector	: new Fireworks.Vector()
		};
	}).onBirth(function(particle){
		var velocity	= particle.velocity.vector;
		this.opts.shape.randomPoint(velocity)
		if( this.opts.speed !== -1 )	velocity.setLength(this.opts.speed);
	}).onUpdate(function(particle, deltaTime){
		var position	= particle.position.vector;
		var velocity	= particle.velocity.vector;
		position.x	+= velocity.x * deltaTime;
		position.y	+= velocity.y * deltaTime;
		position.z	+= velocity.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
