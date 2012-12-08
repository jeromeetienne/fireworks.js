/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.randomVelocityDrift	= function(drift)
{
	// create the effect itself
	Fireworks.createEffect('randomVelocityDrift', {
		drift	: drift
	}).onUpdate(function(particle, deltaTime){
		var velocity	= particle.velocity.vector;
		velocity.x	+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
		velocity.y	+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
		velocity.z	+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;
	}).pushTo(this._emitter);
	// return for chained API
	return this;	// for chained API
};
