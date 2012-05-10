FireFly.GeneratorRate	= function(){

}

// TODO inherit from FireFly.Generator

FireFly.GeneratorRate.prototype.update	= function(emitter, deltaTime){
	var nParticles	= 1;
	// dont spawn more particles than available
	nParticles	= Math.min(nParticles, emitter.deadParticles().length);
	// spawn each particle
	for(var i = 0; i < nParticles; i++){
		// change the particles 
		var particle	= emitter.deadParticles().pop();
		emitter.liveParticles().push(particle);
		// do the birth on all effects
		emitter.effects().forEach(function(effect){
console.log("nParticle to create", nParticles, effect);
			effect.onBirth && effect.onBirth(particle);			
		}.bind(this));
	}
}
