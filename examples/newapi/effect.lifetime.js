/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.lifeTime	= function(minAge, maxAge)
{	
	var emitter	= this._emitter;
	console.assert( minAge !== undefined )
	console.assert( maxAge !== undefined )

	Fireworks.createEffect('lifeTime', {
		minAge	: minAge,
		maxAge	: maxAge
	}).onCreate(function(particle){
		particle.set('lifeTime', {
			curAge	: 0,
			minAge	: 0,
			maxAge	: 0
		});
	}).onBirth(function(particle){
		var lifeTime	= particle.get('lifeTime');
		lifeTime.curAge	= 0;
		lifeTime.maxAge	= this.opts.minAge + Math.random()*(this.opts.maxAge-this.opts.minAge);
	}).onUpdate(function(particle, deltaTime){
		var lifeTime	= particle.get('lifeTime');
		lifeTime.curAge	+= deltaTime;
		if( lifeTime.curAge > lifeTime.maxAge )	emitter.killParticle(particle);
	}).pushTo(emitter);

	return this;	// for chained API
};
