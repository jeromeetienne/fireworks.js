/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.Emitter.prototype.pushRandomDriftVelocity	= function(drift){
	
	Fireworks.createEffect('RandomDriftVelocity', {
		drift	: drift
	}).onUpdate(function(particle, deltaTime){
		var xBase	= particle.get('xBase');
		xBase.velocity.x+= (Math.random()*2 - 1) * this.opts.drift.x * deltaTime;
		xBase.velocity.y+= (Math.random()*2 - 1) * this.opts.drift.y * deltaTime;
		xBase.velocity.z+= (Math.random()*2 - 1) * this.opts.drift.z * deltaTime;
	}).pushTo(this);

	return this;	// for chained API
};
