Fireworks.Effect.ApplyForce	= function(emitter, opts)
{
	this.onUpdate	= function(particle){
		var xBase	= emitter.getParticleData(particle, 'xBase')
		xBase.position.addSelf(opts.vector);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.ApplyForce.prototype = new Fireworks.Effect();
Fireworks.Effect.ApplyForce.prototype.constructor = Fireworks.Effect.ApplyForce;


