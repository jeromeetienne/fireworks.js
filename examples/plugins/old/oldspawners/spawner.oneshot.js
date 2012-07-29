/**
 * Make the emitter use a SpawnerSteadyRate
*/
Fireworks.Emitter.prototype.useSpawnerOneShot	= function(nParticles){
	nParticles	= nParticles !== undefined ? nParticles : this.nParticles();
	var spawner	= new Fireworks.SpawnerOneShot(nParticles);
	return this.setSpawner(spawner);
}

Fireworks.SpawnerOneShot	= function(nParticles){
	console.warn('use old spawners. considere port it to new effect version')
	console.trace();

	// call constructor of parent calss
	Fireworks.Spawner.call( this );
	// init class variables
	this._nParticles	= nParticles	|| 1;
	this._nSent		= 0;
	// start the spawner on init
	this.start();
}

// inherit from Fireworks.Spawner
Fireworks.SpawnerOneShot.prototype = new Fireworks.Spawner();
Fireworks.SpawnerOneShot.prototype.constructor = Fireworks.SpawnerOneShot;

Fireworks.SpawnerOneShot.prototype.update	= function(emitter, deltaTime){
	// if already completed, do nothing
	if( this._nParticles === this._nSent )	return;
	// spawn each particle
	var nParticles	= this._nParticles - this._nSent;
	nParticles	= Math.min(nParticles, emitter.deadParticles().length);
	for(var i = 0; i < nParticles; i++){
		emitter.spawnParticle();
	}
	// update the amount of sent particles
	this._nSent	+= nParticles;
	// mark it as completed
	this._completed	= true;
}

/**
 * reset the spawner
*/
Fireworks.SpawnerOneShot.prototype.reset	= function(){
	this._nSent	= 0;
}