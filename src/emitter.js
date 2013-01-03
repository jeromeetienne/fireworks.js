Fireworks.createEmitter	= function(opts){
	return new Fireworks.Emitter(opts);
}

/**
 * The emitter of particles
*/
Fireworks.Emitter	= function(opts){
	this._nParticles	= opts.nParticles !== undefined ? opts.nParticles : 100;
	this._particles		= [];
	this._effects		= [];
	this._started		= false;
	this._onUpdated		= null;
	this._intensity		= 0;
	this._maxDeltaTime	= 1/3;

	this._effectsStackBuilder	= new Fireworks.EffectsStackBuilder(this)
}

Fireworks.Emitter.prototype.destroy	= function()
{
	this._effects.forEach(function(effect){
		effect.destroy();
	});
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
Fireworks.Emitter.prototype.effect	= function(name){
	for(var i = 0; i < this._effects.length; i++){
		var effect	= this._effects[i];
		if( effect.name === name )	return effect;
	}
	return null;
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
Fireworks.Emitter.prototype.nParticles	= function(){
	return this._nParticles;
}

Fireworks.Emitter.prototype.effectsStackBuilder	= function(){
	return this._effectsStackBuilder;
}


/**
 * Getter/setter for intensity
*/
Fireworks.Emitter.prototype.intensity	= function(value){
	// if it is a getter, return value
	if( value === undefined )	return this._intensity;
	// if the value didnt change, return for chained api
	if( value === this._intensity )	return this;
	// sanity check
	Fireworks.debug && console.assert( value >= 0, 'Fireworks.Emitter.intensity: invalid value.', value);
	Fireworks.debug && console.assert( value <= 1, 'Fireworks.Emitter.intensity: invalid value.', value);
	// backup the old value
	var oldValue	= this._intensity;
	// update the value
	this._intensity	= value;
	// notify all effects
	this._effects.forEach(function(effect){
		if( !effect.onIntensityChange )	return;
		effect.onIntensityChange(this._intensity, oldValue);			
	}.bind(this));
	return this;	// for chained API
}

/**
 * Getter/setter for intensity
*/
Fireworks.Emitter.prototype.maxDeltaTime	= function(value){
	if( value === undefined )	return this._maxDeltaTime;
	this._maxDeltaTime	= value;
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//		backward compatibility						//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.setParticleData	= function(particle, namespace, value){
	particle[namespace] = value;
}

Fireworks.Emitter.prototype.getParticleData	= function(particle, namespace){
	return particle[namespace];
}

//////////////////////////////////////////////////////////////////////////////////
//		Start function							//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.start	= function()
{
	console.assert( this._effects.length > 0, "At least one effect MUST be set")
	console.assert( this._started === false );
	
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
		this._particles.forEach(function(particle, particleIdx){
			effect.onCreate(particle, particleIdx);			
		})
	}.bind(this));
	// set the intensity to 1
	this.intensity(1)

	return this;	// for chained API
}

Fireworks.Emitter.prototype.update	= function(deltaTime){
	// bound the deltaTime to this._maxDeltaTime
	deltaTime	= Math.min(this._maxDeltaTime, deltaTime)
	// honor effect.onPreUpdate
	this._effects.forEach(function(effect){
		if( !effect.onPreUpdate )	return;
		effect.onPreUpdate(deltaTime);			
	}.bind(this));
	// update each particles
	this._effects.forEach(function(effect){
		if( !effect.onUpdate )	return;
		this._liveParticles.forEach(function(particle){
			effect.onUpdate(particle, deltaTime);			
		})
	}.bind(this));
	return this;	// for chained API
}

Fireworks.Emitter.prototype.render	= function(){
	this._effects.forEach(function(effect){
		if( !effect.onPreRender )	return;
		effect.onPreRender();			
	}.bind(this));
	this._effects.forEach(function(effect){
		if( !effect.onRender )	return;
		this._liveParticles.forEach(function(particle){
			effect.onRender(particle);			
		})
	}.bind(this));
	this._effects.forEach(function(effect){
		if( !effect.onPostRender )	return;
		effect.onPostRender();			
	}.bind(this));
	return this;	// for chained API
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
	// sanity check
	Fireworks.debug && console.assert( idx !== -1 );
	this._liveParticles.splice(idx, 1)
	this._deadParticles.push(particle);
	// do the death on all effects
	this.effects().forEach(function(effect){
		effect.onDeath && effect.onDeath(particle);			
	}.bind(this));
}

/**
 * Spawn a particle
*/
Fireworks.Emitter.prototype.spawnParticle	= function(){
	// sanity check
	Fireworks.debug && console.assert(this._deadParticles.length >= 1, 'no more particle available' );
	// change the particles 
	var particle	= this.deadParticles().pop();
	this.liveParticles().push(particle);
	// do the birth on all effects
	this.effects().forEach(function(effect){
		effect.onBirth && effect.onBirth(particle);			
	}.bind(this));
}
