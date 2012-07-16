/**
 * Shortcut to create Fireworks.EffectBase
*/
Fireworks.Emitter.prototype.pushBase	= function(maxAge){
	var emitter	= this;
	emitter.effects().push(new Fireworks.EffectBase(emitter, maxAge));
	return this;	// for chained API
};


Fireworks.EffectBase	= function(emitter, opts)
{
	this.name	= "Base";
	this.opts	= {
		friction	: 0.99,
		birthPosition	: new Fireworks.Vector(0,0,0),
		birthVelocity	: new Fireworks.Vector(1,0,0),
		birthAcceleration:new Fireworks.Vector(0,0,0)
	};
	this.onCreate	= function(particle){
		emitter.setParticleData(particle, 'xBase', {
			position	: new Fireworks.Vector(),
			velocity	: new Fireworks.Vector(),
			acceleration	: new Fireworks.Vector(),
			friction	: this.opts.friction
		});
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= emitter.getParticleData(particle, 'xBase')
		ctx.position.copy( this.opts.birthPosition );
		ctx.velocity.copy( this.opts.birthVelocity );
		ctx.acceleration.copy( this.opts.birthAcceleration );
		ctx.friction	= this.opts.friction;
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


