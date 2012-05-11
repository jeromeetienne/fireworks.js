Fireworks.EffectBase	= function(emitter, opts)
{
	this.onCreate	= function(particle){
		emitter.setParticleData(particle, 'xBase', {
			position	: new Fireworks.Vector(),
			velocity	: new Fireworks.Vector(),
			acceleration	: new Fireworks.Vector(),
			friction	: 1.0
		});
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= emitter.getParticleData(particle, 'xBase')
		ctx.position.set(0,0,0);
		//ctx.velocity.random().setLength( Math.random() * 3 );
		ctx.velocity.set(1,0,0);
		ctx.acceleration.set(0,0,0);
		ctx.friction	= 0.99
	}.bind(this);
	
	this.onUpdate	= function(particle){
		var ctx	= particle.xBase;
		ctx.velocity.addSelf(ctx.acceleration);
		ctx.velocity.multiplyScalar(ctx.friction);
		ctx.position.addSelf(ctx.velocity);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.EffectBase.prototype = new Fireworks.Effect();
Fireworks.EffectBase.prototype.constructor = Fireworks.EffectBase;


