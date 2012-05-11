/**
 * Shortcut to create Fireworks.Effect.Init2Shapes
*/
Fireworks.Emitter.prototype.pushDieIfContained	= function(shape){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.DieIfContained(emitter, shape));
};


Fireworks.Effect.DieIfContained	= function(emitter, shape)
{
	this.onUpdate	= function(particle){
		var xBase	= emitter.getParticleData(particle, 'xBase');
		var position	= xBase.position;
		if( shape.contains(position) )	emitter.killParticle(particle);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.DieIfContained.prototype = new Fireworks.Effect();
Fireworks.Effect.DieIfContained.prototype.constructor = Fireworks.Effect.DieIfContained;


