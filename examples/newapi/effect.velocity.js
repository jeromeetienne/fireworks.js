/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.velocity	= function(shape)
{
	Fireworks.createEffect('Velocity', {
		shape	: shape
	}).onCreate(function(particle){
		particle.set('velocity', {
			vector	: new Fireworks.Vector()
		});
	}).onBirth(function(particle){
		var velocity	= particle.get('velocity').vector;
		this.opts.shape.randomPoint(velocity)
	}).onUpdate(function(particle, deltaTime){
		var position	= particle.get('position').vector;
		var velocity	= particle.get('velocity').vector;
		position.x	+= velocity.x * deltaTime;
		position.y	+= velocity.y * deltaTime;
		position.z	+= velocity.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
