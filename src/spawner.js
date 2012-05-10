Fireworks.SpawnerRate	= function(){

}

// TODO inherit from Fireworks.Spawner

Fireworks.SpawnerRate.prototype.update	= function(emitter, deltaTime){
	var nParticles	= 1;
	// dont spawn more particles than available
	nParticles	= Math.min(nParticles, emitter.deadParticles().length);
	// spawn each particle
	for(var i = 0; i < nParticles; i++){
		emitter.spawnParticle();
	}
}
