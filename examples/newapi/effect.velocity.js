/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.velocity	= function(x, y, z)
{
	var emitter	= this._emitter;
	
	Fireworks.createEffect('Velocity').onCreate(function(particle){
		particle.set('velocity', {
			vector	: new Fireworks.Vector()
		});
	}).onBirth(function(particle){
		var velocity	= particle.get('velocity').vector;
		velocity.set(x, y, z)
	}).onUpdate(function(particle){
		var position	= particle.get('position').vector;
		var velocity	= particle.get('velocity').vector;
		position.addSelf(velocity)
	}).pushTo(this);

	return this;	// for chained API
};
