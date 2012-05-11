Fireworks.Effect.DieIfContained	= function(emitter, shape)
{
	this.onUpdate	= function(particle){
		var xBase	= emitter.getParticleData(particle, 'xBase');
		var position	= xBase.position;
		if( shape.contains(position) )	emitter.killParticle();
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.DieIfContained.prototype = new Fireworks.Effect();
Fireworks.Effect.DieIfContained.prototype.constructor = Fireworks.Effect.DieIfContained;


