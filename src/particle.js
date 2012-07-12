/**
 * The emitter of particles
*/
Fireworks.Particle	= function(){
}

Fireworks.Particle.prototype.set	= function(key, value){
	console.assert( this[key] === undefined, "key already defined: "+key );
	this[key]	= value;
	return this[key];
}

Fireworks.Particle.prototype.get	= function(key){
	console.assert( this[key] !== undefined, "key undefined: "+key );
	return this[key];
}

Fireworks.Particle.prototype.has	= function(key){
	return this[key] !== undefined	? true : false;
}
