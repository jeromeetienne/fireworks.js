
var Fireworks	= {};/**
 * The emitter of particles
*/
Fireworks.Emitter	= function(opts){
	this._nParticles= opts.nParticles !== undefined ? opts.nParticles : 100;
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
//		Getters								//
//////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////
//		configuration helper						//
//		TODO put that elsewhere.. in each plugins ?? 			//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.addEffectBase	= function(){
	var emitter	= this;
	var effect	= new Fireworks.EffectBase(emitter);
	this._effects.push( effect );
	return this;	// for chained API
}

Fireworks.Emitter.prototype.addEffectAge	= function(){
	var emitter	= this;
	var effect	= new Fireworks.EffectAge(emitter);
	this._effects.push( effect );
	return this;	// for chained API
}

Fireworks.Emitter.prototype.setSpawnerRate	= function(){
	this._spawner	= new Fireworks.SpawnerRate();
	return this;	// for chained API
}

//////////////////////////////////////////////////////////////////////////////////
//		Start function							//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.start	= function()
{
	console.assert( this._spawner, "a spawner MUST be set" );
	console.assert( this._effects.length > 0, "Some effects MUST be set")
	
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
	}.bind(this));
	
	return this;	// for chained API
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

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * kill this particle
*/
Fireworks.Emitter.prototype.killParticle	= function(particle)
{
	var idx	= this._liveParticles.indexOf(particle);
	console.assert( idx !== -1 )
	this._liveParticles.splice(idx, 1)
	this._deadParticles.push(particle);
	// do the death on all effects
	emitter.effects().forEach(function(effect){
		effect.onDeath && effect.onDeath(particle);			
	}.bind(this));
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
Fireworks.Spawner	= function(){
}
/**
 * The emitter of particles
*/
Fireworks.Particle	= function(){
}
/**
 * An effect to apply on particles
*/
Fireworks.Effect	= function(){
}

//Firefly.Effect.prototype.onCreate	= function(){
//}
//
//Firefly.Effect.prototype.onBirth	= function(){
//}
//
//Firefly.Effect.prototype.onDeath	= function(){
//}
//
//Firefly.Effect.prototype.onUpdate	= function(){
//}
