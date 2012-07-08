/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.friction	= function(value)
{
	var emitter	= this._emitter;
	
	Fireworks.createEffect('friction').onUpdate(function(particle){
		var velocity	= particle.get('velocity').vector;
		velocity.multiplyScalar(value)
	}).pushTo(this);

	return this;	// for chained API
};
