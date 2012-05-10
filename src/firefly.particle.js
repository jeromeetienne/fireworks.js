/**
 * The emitter of particles
*/
FireFly.Particle	= function(){
}

FireFly.Particle.prototype.spawning	= function(emitter)
{
	emitter.effects().forEach(function(effect){
		if( !effect.onBirth )	return;
		this._liveParticles.forEach(function(particle){
			effect.onBirth(particle);			
		})
	}.bind(this));
}