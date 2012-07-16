/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.randomDriftVelocity	= function(drift)
{	
	var emitter	= this._emitter;
	
	Fireworks.createEffect('RandomDriftVelocity', {
		drift	: drift
	}).onUpdate(function(particle, deltaTime){
		var xBase	= emitter.getParticleData(particle, 'xBase');
		xBase.velocity.x+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
		xBase.velocity.y+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
		xBase.velocity.z+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;

		var xBase	= emitter.getParticleData(particle, 'xBase');
		xBase.velocity.x+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
		xBase.velocity.y+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
		xBase.velocity.z+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;
	}).pushTo(emitter);

	if(false){
		Fireworks.createEffect('RandomDriftVelocity', {
			drift	: drift
		}).onUpdate(function(particle, deltaTime){
			var velocity	= particle.get('velocity').velocity;
			velocity.x	+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
			velocity.y	+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
			velocity.z	+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;
		}).pushTo(emitter);
	}
	return this;	// for chained API
};
