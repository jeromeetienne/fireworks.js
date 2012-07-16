/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.radialVelocity	= function(minSpeed, maxSpeed)
{
	Fireworks.createEffect('radialVelocity', {
		minSpeed	: minSpeed,
		maxSpeed	: maxSpeed	
	}).onCreate(function(particle){
		particle.set('velocity', {
			vector	: new Fireworks.Vector()
		});
	}).onBirth(function(particle, deltaTime){
		var position	= particle.get('position').vector;
		var velocity	= particle.get('velocity').vector;
		var length	= this.opts.minSpeed + (this.opts.maxSpeed - this.opts.minSpeed)*Math.random();
		velocity.copy(position).setLength(length);
	}).onUpdate(function(particle, deltaTime){
		var position	= particle.get('position').vector;
		var velocity	= particle.get('velocity').vector;
		position.x	+= velocity.x * deltaTime;
		position.y	+= velocity.y * deltaTime;
		position.z	+= velocity.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
