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
	for(var i=0;i<this._effects.length;i++){
		this._effects[i].destroy()
	}
	for(var i=0;i<this._particles.length;i++){
		this._particles[i].destroy()
	}
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
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onIntensityChange){
			this._effects[i].onIntensityChange(this._intensity, oldValue);
		}
	}
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
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onCreate){
			for(var j=0;j<this._particles.length;j++){
				this._effects[i].onCreate(this._particles[j], j);
			}
		}
	}
	// set the intensity to 1
	this.intensity(1)

	return this;	// for chained API
}

Fireworks.Emitter.prototype.update	= function(deltaTime){
	// bound the deltaTime to this._maxDeltaTime
	deltaTime	= Math.min(this._maxDeltaTime, deltaTime)
	// honor effect.onPreUpdate
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onPreUpdate){
			this._effects[i].onPreUpdate(deltaTime);
		}
	}
	// update each particles
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onUpdate){
			for(var j=0;j<this._liveParticles.length;j++){
				this._effects[i].onUpdate(this._liveParticles[j], deltaTime);			
			}
		}
	}
	return this;	// for chained API
}

Fireworks.Emitter.prototype.render	= function(){
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onPreRender){
			this._effects[i].onPreRender();
		}
	}
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onRender){
			for(var j=0;j<this._liveParticles.length;j++){
				this._effects[i].onRender(this._liveParticles[j]);
			}
		}
	}
	for(var i=0;i<this._effects.length;i++){
		if(this._effects[i].onPostRender){
			this._effects[i].onPostRender();
		}
	}
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
	for(var i=0;i<this._effects.length;i++){
		this._effects[i].onDeath && this._effects[i].onDeath(particle);
	}
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
	for(var i=0;i<this._effects.length;i++){
		this._effects[i].onBirth && this._effects[i].onBirth(particle);
	}
}
