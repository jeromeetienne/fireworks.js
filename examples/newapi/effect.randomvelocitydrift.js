/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.randomVelocityDrift	= function(drift)
{
	Fireworks.createEffect('randomVelocityDrift', {
		drift	: drift
	}).onUpdate(function(particle, deltaTime){
		var velocity	= particle.get('velocity').vector;
		velocity.x	+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
		velocity.y	+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
		velocity.z	+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
