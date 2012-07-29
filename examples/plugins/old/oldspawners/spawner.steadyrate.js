/**
 * Make the emitter use a SpawnerSteadyRate
 * 
 * @param {Number?} rate the rate at which it gonna emit
*/
Fireworks.Emitter.prototype.useSpawnerSteadyRate	= function(rate){
	var spawner	= new Fireworks.SpawnerSteadyRate(rate);
	return this.setSpawner(spawner);
}

/**
 * Spawner deliverying paricles at a steady rate
 * 
 * @param {Number?} rate the rate at which it gonna emit
*/
Fireworks.SpawnerSteadyRate	= function(rate){
	console.warn('use old spawners. considere port it to new effect version')
	console.trace();

	// call constructor of parent calss
	Fireworks.Spawner.call( this );
	// init class variables
	this._rate	= rate	|| 10;
	this._nToCreate	= 1;
	// start the spawner on init
	this.start();
}

// inherit from Fireworks.Spawner
Fireworks.SpawnerSteadyRate.prototype = new Fireworks.Spawner();
Fireworks.SpawnerSteadyRate.prototype.constructor = Fireworks.SpawnerSteadyRate;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Getter/Setter for the rate
 * 
 * @param {Number?} value the value to change
 * @returns {Fireworks.SpawnerSteadyRate} for chained API
*/
Fireworks.SpawnerSteadyRate.prototype.rate	= function(value){
	if( value === undefined )	return this._rate;
	this._rate	= value;
	return this;
}

/**
 * update the spawner
 *
 * @param {Fireworks.Emitter} emitter the emitter for which Fireworks.Spawner
 * @param {Number} deltaTime the amount of seconds since last iteration
*/
Fireworks.SpawnerSteadyRate.prototype.update	= function(emitter, deltaTime){
	// if the spawner is not running, return now
	if( this.isRunning() === false )	return;
	// update this._nToCreate
	this._nToCreate	+= this._rate * deltaTime;
	// nParticles is the interger part of this._nToCreate as you spawn them one by one
	var nParticles	= Math.floor(this._nToCreate);
	// dont spawn more particles than available
	// TODO here estimate how much more is needed to never lack of it
	nParticles	= Math.min(nParticles, emitter.deadParticles().length);
	// update this._nToCreate
	this._nToCreate	-= nParticles;
	// spawn each particle
	for(var i = 0; i < nParticles; i++){
		emitter.spawnParticle();
	}
}

