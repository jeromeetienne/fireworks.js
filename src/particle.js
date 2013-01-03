/**
 * The emitter of particles
*/
Fireworks.Particle	= function(){
}

Fireworks.Particle.prototype.set	= function(key, value){
	this[key]	= value;
	return this[key];
}

Fireworks.Particle.prototype.get	= function(key){
	return this[key];
}

Fireworks.Particle.prototype.has	= function(key){
	return this[key] !== undefined	? true : false;
}
