/**
 * Spawner deliverying paricles at a steady rate
 * 
 * @param {Number?} rate the rate at which it gonna emit
*/
Fireworks.EffectsStackBuilder.prototype.spawnerSteadyRate	= function(rate)
{
	// handle parameter polymorphism
	rate	= rate !== undefined ? rate	: 1;
	// define local variables
	var emitter	= this.emitter();
	var nToCreate	= 1;
	var spawning	= true;
	
	// create the effect itself
	Fireworks.createEffect('spawner', {
		rate	: rate,
		start	: function(){ spawning = true;	},
		stop	: function(){ spawning = false;	}
	}).onPreUpdate(function(deltaTime){
		var rate	= this.opts.rate;
		// if spawning is false, do nothing
		if( spawning === false )	return;
		// update nToCreate
		nToCreate	+= rate * deltaTime;
		// nParticles is the interger part of nToCreate as you spawn them one by one
		var nParticles	= Math.floor(nToCreate);
		// dont spawn more particles than available
		// TODO here estimate how much more is needed to never lack of it
		nParticles	= Math.min(nParticles, emitter.deadParticles().length);
		// update nToCreate
		nToCreate	-= nParticles;
		// spawn each particle
		for(var i = 0; i < nParticles; i++){
			emitter.spawnParticle();
		}
	}).pushTo(this._emitter);
	// return this for chained API
	return this;
};
