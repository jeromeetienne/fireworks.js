/**
 * Make the emitter use a SpawnerSteadyRate
*/
Fireworks.Emitter.prototype.useSpawnerOneShot	= function(nParticles){
	var spawner	= new Fireworks.SpawnerOneShot(nParticles);
	return this.setSpawner(spawner);
}

Fireworks.SpawnerOneShot	= function(nParticles){
	this._nParticles	= nParticles	|| 1;
	this._completed		= false;
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

