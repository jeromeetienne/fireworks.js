Fireworks.SpawnerRate	= function(rate){
	this._rate	= rate	|| 10;
	this._nToCreate	= 0;
}

// inherit from Fireworks.Spawner
Fireworks.SpawnerRate.prototype = new Fireworks.Spawner();
Fireworks.SpawnerRate.prototype.constructor = Fireworks.SpawnerRate;

Fireworks.SpawnerRate.prototype.update	= function(emitter, deltaTime){
	this._nToCreate	+= this._rate * deltaTime;
	var nParticles	= Math.floor(this._nToCreate);
	// dont spawn more particles than available
	nParticles	= Math.min(nParticles, emitter.deadParticles().length);
	this._nToCreate	-= nParticles;
	// spawn each particle
	for(var i = 0; i < nParticles; i++){
		emitter.spawnParticle();
	}
}

