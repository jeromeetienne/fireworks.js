/**
 * Shortcut to create Fireworks.EffectAge
*/
Fireworks.Emitter.prototype.pushAge	= function(minAge, maxAge){
	var emitter	= this;
	if( arguments.length === 1 ){
		minAge	= minAge;
		maxAge	= minAge;
	}
	emitter.effects().push(new Fireworks.EffectAge(emitter, minAge, maxAge));
	return this;	// for chained API
};

/**
 * handle the age of a particle 
 *
*/
Fireworks.EffectAge	= function(emitter, minAge, maxAge)
{
	console.assert( minAge !== undefined )
	console.assert( maxAge !== undefined )
	this.onCreate	= function(particle){
		particle.xAge	= {
			curAge	: 0,
			minAge	: 0,
			maxAge	: 0
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xAge;
		ctx.curAge	= 0;
		ctx.maxAge	= minAge + Math.random()*(maxAge-minAge);
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
