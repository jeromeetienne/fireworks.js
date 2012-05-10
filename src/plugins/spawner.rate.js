Fireworks.SpawnerRate	= function(){

}

// inherit from Fireworks.Spawner
Fireworks.SpawnerRate.prototype = new Fireworks.Spawner();
Fireworks.SpawnerRate.prototype.constructor = Fireworks.SpawnerRate;

Fireworks.SpawnerRate.prototype.update	= function(emitter, deltaTime){
	var nParticles	= 1;
	// dont spawn more particles than available
	nParticles	= Math.min(nParticles, emitter.deadParticles().length);
	// spawn each particle
	for(var i = 0; i < nParticles; i++){
		emitter.spawnParticle();
	}
}

