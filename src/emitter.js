/**
 * The emitter of particles
*/
Fireworks.Emitter	= function(){
	this._nParticles= 0;
	this._particles	= [];
	this._spawner	= null;
	this._effects	= [];
	this._onUpdated	= null;
}

Fireworks.Emitter.prototype.destroy	= function()
{
	this._effects.forEach(function(effect){
		effect.destroy();
	});
	this._spawner	&& this._spawner.destroy();
	this._particles.forEach(function(particle){
		particle.destroy();
	});
}


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.addEffectBase	= function(){
	var emitter	= this;
	var effect	= new Fireworks.Effect.Base(emitter);
	this._effects.push( effect );
	return this;	// for chained API
}

Fireworks.Emitter.prototype.addEffectAge	= function(){
	var emitter	= this;
	var effect	= new Fireworks.Effect.Agee(emitter);
	this._effects.push( effect );
	return this;	// for chained API
}

Fireworks.Emitter.prototype.start	= function()
{
	this._nParticles= 200;
	this._spawner	= new Fireworks.SpawnerRate();
	this._effects.push( new Fireworks.Effect.Base(emitter) );
	this._effects.push( new Fireworks.Effect.Age(emitter) );


	this._particles		= new Array(this._nParticles);
	for(var i = 0; i < this._nParticles; i++){
		this._particles[i]	= new Fireworks.Particle();
	}

	this._liveParticles	= [];
	this._deadParticles	= this._particles.slice(0);
	this._started		= true;

	// onCreate on all particles
	this._effects.forEach(function(effect){
		if( !effect.onCreate )	return;
		this._particles.forEach(function(particle){
			effect.onCreate(particle);			
		})
	}.bind(this))
	return this;	// for chained API
}

Fireworks.Emitter.prototype.effects	= function(){
	return this._effects;
}
Fireworks.Emitter.prototype.particles	= function(){
	return this._particles;
}
Fireworks.Emitter.prototype.liveParticles	= function(){
	return this._liveParticles;
}
Fireworks.Emitter.prototype.deadParticles	= function(){
	return this._deadParticles;
}

Fireworks.Emitter.prototype.update	= function(deltaTime){
	// update the generator
	this._spawner.update(this, deltaTime);
	// update each particles
	this._effects.forEach(function(effect){
		if( !effect.onUpdate )	return;
		this._liveParticles.forEach(function(particle){
			effect.onUpdate(particle, deltaTime);			
		})
	}.bind(this));
}

/**
 * kill this particle
*/
Fireworks.Emitter.prototype.killParticle	= function(particle)
{
	var idx	= this._liveParticles.indexOf(particle);
	console.assert( idx !== -1 )
	this._liveParticles.splice(idx, 1)
	this._deadParticles.push(particle);
}

/**
 * Spawn a particle
*/
Fireworks.Emitter.prototype.spawnParticle	= function(){
	// change the particles 
	var particle	= emitter.deadParticles().pop();
	emitter.liveParticles().push(particle);
	// do the birth on all effects
	emitter.effects().forEach(function(effect){
		effect.onBirth && effect.onBirth(particle);			
	}.bind(this));
}
