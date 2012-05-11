Fireworks.Effect.Init2Shapes	= function(emitter, opts)
{
	console.assert( opts.origin instanceof Fireworks.Shape );
	console.assert( opts.target instanceof Fireworks.Shape );
	var	speed	= opts.speed !== undefined ? opts.speed : 1;
	
	this.onBirth	= function(particle){
		var ctx	= emitter.getParticleData(particle, 'xBase')

		ctx.position.copy( opts.origin.randomPoint() );
		
		var delta	= opts.target.randomPoint().subSelf(ctx.position);
		delta.setLength(speed);

		ctx.velocity.copy( delta );
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.Init2Shapes.prototype = new Fireworks.Effect();
Fireworks.Effect.Init2Shapes.prototype.constructor = Fireworks.Effect.Init2Shapes;


