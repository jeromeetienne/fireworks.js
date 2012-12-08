/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.lifeTime = function(minAge, maxAge)
{
	// sanity check
	console.assert( minAge !== undefined )
	// if maxAge isnt 
	if( maxAge === undefined )	maxAge	= minAge;
	console.assert( maxAge !== undefined )
	// create the effect itself
	var emitter	= this._emitter;
	Fireworks.createEffect('lifeTime', {
		minAge	: minAge,
		maxAge	: maxAge
	}).onCreate(function(particle){
		var data	= particle.lifeTime = {
			curAge	: 0,
			minAge	: 0,
			maxAge	: 0,
			normalizedAge	: function(){
				return (data.curAge - data.minAge) / (data.maxAge - data.minAge);
			}
		};
	}).onBirth(function(particle){
		var lifeTime	= particle.lifeTime;
		lifeTime.curAge	= 0;
		lifeTime.maxAge	= this.opts.minAge + Math.random() * (this.opts.maxAge - this.opts.minAge);
	}).onUpdate(function(particle, deltaTime){
		var lifeTime	= particle.lifeTime;
		lifeTime.curAge	+= deltaTime;
		if( lifeTime.curAge > lifeTime.maxAge )	emitter.killParticle(particle);
	}).pushTo(this._emitter);
	// return this for chained API
	return this;
};
