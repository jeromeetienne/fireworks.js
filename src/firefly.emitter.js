/**
 * The emitter of particles
*/
FireFly.Emitter	= function(){
	this._nParticles= 0;
	this._particles	= [];
	this._generator	= null;
	this._effects	= [];
	this._onUpdated	= null;
}

FireFly.Emitter.prototype.destroy	= function()
{
	this._effects.forEach(function(effect){
		effect.destroy();
	});
	this._generator	&& this._generator.destroy();
	this._particles.forEach(function(particle){
		particle.destroy();
	});
}


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////


FireFly.Emitter.prototype.start	= function()
{
	this._nParticles= 30;
	this._generator	= new FireFly.GeneratorRate();
	this._effects.push( new FireFly.Effect.Base() );


	this._particles		= new Array(this._nParticles);
	for(var i = 0; i < this._nParticles; i++){
		this._particles[i]	= new FireFly.Particle();
	}

	this._liveParticles	= [];
	this._deadParticles	= this._particles.slice(0);

	// onCreate on all particles
	this._effects.forEach(function(effect){
		if( !effect.onCreate )	return;
		this._particles.forEach(function(particle){
			effect.onCreate(particle);			
		})
	}.bind(this))
}

FireFly.Emitter.prototype.effects	= function(){
	return this._effects;
}
FireFly.Emitter.prototype.particles	= function(){
	return this._particles;
}
FireFly.Emitter.prototype.liveParticles	= function(){
	return this._liveParticles;
}
FireFly.Emitter.prototype.deadParticles	= function(){
	return this._deadParticles;
}

FireFly.Emitter.prototype.update	= function(deltaTime){
	// update the generator
	this._generator.update(this, deltaTime);
	// update each particles
	this._effects.forEach(function(effect){
		if( !effect.onUpdate )	return;
		this._liveParticles.forEach(function(particle){
			effect.onUpdate(particle);			
		})
	}.bind(this));
}