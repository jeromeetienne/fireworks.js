/**
 * Shortcut to create Fireworks.EffectAge
*/
Fireworks.Emitter.prototype.pushAge	= function(maxAge){
	var emitter	= this;
	emitter.effects().push(new Fireworks.EffectAge(emitter, maxAge));
	return this;	// for chained API
};


Fireworks.EffectAge	= function(emitter, maxAge)
{
	maxAge	= maxAge !== undefined ? maxAge : 1;
	this.onCreate	= function(particle){
		particle.xAge	= {
			curAge	: 0,
			maxAge	: 0
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xAge;
		ctx.curAge	= 0;
		ctx.maxAge	= maxAge;
	}.bind(this);
	
	this.onUpdate	= function(particle, deltaTime){
		var ctx	= particle.xAge;
		ctx.curAge	+= deltaTime;
		if( ctx.curAge > ctx.maxAge )	emitter.killParticle(particle);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.EffectAge.prototype = new Fireworks.Effect();
Fireworks.EffectAge.prototype.constructor = Fireworks.EffectAge;
