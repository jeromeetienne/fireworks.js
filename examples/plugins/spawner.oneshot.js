/**
 * Make the emitter use a SpawnerSteadyRate
*/
Fireworks.Emitter.prototype.useSpawnerOneShot	= function(nParticles){
	nParticles	= nParticles !== undefined ? nParticles : this.nParticles();
	var spawner	= new Fireworks.SpawnerOneShot(nParticles);
	return this.setSpawner(spawner);
}

Fireworks.SpawnerOneShot	= function(nParticles){
	// call constructor of parent calss
	Fireworks.Spawner.call( this );
	// init class variables
	this._nParticles	= nParticles	|| 1;
	this._completed		= false;
	// start the spawner on init
	this.start();
}

// inherit from Fireworks.Spawner
Fireworks.SpawnerOneShot.prototype = new Fireworks.Spawner();
Fireworks.SpawnerOneShot.prototype.constructor = Fireworks.SpawnerOneShot;

Fireworks.SpawnerOneShot.prototype.update	= function(emitter, deltaTime){
	// if already completed, do nothing
	if( this._completed )	return;
	// spawn each particle
	for(var i = 0; i < this._nParticles; i++){
		emitter.spawnParticle();
	}
	// mark it as completed
	this._completed	= true;
}

/**
 * reset the spawner
*/
Fireworks.SpawnerOneShot.prototype.reset	= function(){
	this._completed	= false;
}