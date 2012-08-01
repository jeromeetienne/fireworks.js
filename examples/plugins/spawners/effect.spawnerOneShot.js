/**
 * Spawner deliverying paricles in one shot
 * 
 * @param {Number?} the number of particle to emit
*/
Fireworks.EffectsStackBuilder.prototype.spawnerOneShot	= function(nParticles)
{
	// handle parameter polymorphism
	nParticles	= nParticles	|| this.emitter().nParticles();
	// define local variables
	var emitter	= this.emitter();
	var nSent	= 0;
	var spawning	= true;

	// create the effect itself
	Fireworks.createEffect('spawner', {
		reset	: function(){ nSent	= 0;	},
		start	: function(){ spawning	= true;	},
		stop	: function(){ spawning	= false;}
	}).onPreUpdate(function(deltaTime){
		// if spawning is false, do nothing
		if( spawning === false )	return;
		// if already completed, do nothing
		if( nParticles === nSent )	return;
		// spawn each particle
		var amount	= nParticles - nSent;
		amount		= Math.min(amount, emitter.deadParticles().length);
		for(var i = 0; i < amount; i++){
			emitter.spawnParticle();
		}
		// update the amount of sent particles
		nSent	+= amount;
	}).pushTo(this._emitter);
	// return this for chained API
	return this;
};
