Fireworks.ComboEmitter.Flamethrower	= function(){
	// TODO make a local THREE.Object3D instead ?
	this._container	= new THREE.Object3D();
	this._emitterJet= null;	

	this._baseSound	= null;
	this._webaudio	= null;
	this._sound	= null;
	
	this._state	= 'stopped';
	this._lastStart	= 0;
	this._lastStop	= 0;

	this._attackTime	= 1.0;
	this._releaseTime	= 0.2;
	
	
	this._flamejetCtor();
	this._soundCtor();
	// update the emitter in rendering loop
	this._$loopCb	= this._loopCb.bind(this);
	world.loop().hook(this._$loopCb);
}

Fireworks.ComboEmitter.Flamethrower.prototype._destroy	= function()
{
	world.loop().unhook(this._$loopCb);
	this._flamejetDtor();
	this._soundDtor();
}

// inherit from Fireworks.ComboEmitter
Fireworks.ComboEmitter.Flamethrower.prototype			= new Fireworks.ComboEmitter();
Fireworks.ComboEmitter.Flamethrower.prototype.constructor	= Fireworks.ComboEmitter.Flamethrower;

//////////////////////////////////////////////////////////////////////////////////
//		Getter								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Flamethrower.prototype.start	= function(){
	if( this._state === 'started' )	return;
	console.assert( this._state === 'stopped' )
	this._state	= 'started';
	this._lastStart	= Date.now()/1000;
}

Fireworks.ComboEmitter.Flamethrower.prototype.stop	= function(){
	if( this._state === 'stopped' )	return;
	console.assert( this._state === 'started' )
	this._state	= 'stopped';
	this._lastStop	= Date.now()/1000;
}


//////////////////////////////////////////////////////////////////////////////////
//		Getter								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Flamethrower.prototype.object3D	= function(){
	return this._container;
}


//////////////////////////////////////////////////////////////////////////////////
//		rendering loop function						//
//////////////////////////////////////////////////////////////////////////////////


Fireworks.ComboEmitter.Flamethrower.prototype._loopCb	= function(delta, now){
	if( !this._emitterJet ) return;
	
	
	this._emitterJet.update(delta).render();
	
	console.assert( this._state === 'started' || this._state === 'stopped' );	
	var present	= Date.now()/1000;
	if( this._state === 'started' ){
		if( present - this._lastStart <= this._attackTime ){
			var intensity	= (present - this._lastStart) / this._attackTime;		
			//console.log('starting', intensity);		
		}else{
			var intensity	= 1;
		}
		this._emitterJet.intensity( intensity );
	}else if( this._state === 'stopped' ){
		if( present - this._lastStop <= this._releaseTime ){
			var intensity	= 1 - (present - this._lastStop) / this._releaseTime;			
			//console.log('stopping', intensity)		
		}else{
			var intensity	= 0;
		}
		this._emitterJet.intensity( intensity );
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		Flame jet emitter						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Create the flame jet
*/
Fireworks.ComboEmitter.Flamethrower.prototype._flamejetCtor	= function(){
	var urls	= [
		"../assets/images/flame/flame00.png",
		"../assets/images/flame/flame01.png",
		"../assets/images/flame/flame02.png",
		"../assets/images/flame/flame03.png",
		"../assets/images/flame/flame04.png",
		"../assets/images/flame/flame05.png",
		"../assets/images/flame/flame06.png",
		"../assets/images/flame/flame07.png",
		"../assets/images/flame/flame08.png",
		"../assets/images/flame/flame09.png",
		"../assets/images/flame/flame10.png",
		"../assets/images/flame/flame11.png",
		"../assets/images/flame/flame12.png",
		"../assets/images/flame/flame13.png",
		"../assets/images/flame/flame14.png",
		"../assets/images/flame/flame15.png",
		"../assets/images/flame/flame16.png",
		"../assets/images/flame/flame17.png",
		"../assets/images/flame/flame18.png",
		"../assets/images/flame/flame19.png",
		"../assets/images/flame/flame20.png",
		"../assets/images/flame/flame21.png",
		"../assets/images/flame/flame22.png",
		"../assets/images/flame/flame23.png",
		"../assets/images/flame/flame24.png"
	];


	new TremulousParticuleLoader(urls, buildEmitter.bind(this));
	return;

	function buildEmitter(spriteSheet){
		console.log("spriteSheet loaded");
		// create the texture
		var texture	= new THREE.Texture( spriteSheet );
		texture.needsUpdate = true;
	
		var emitter	= this._emitterJet	= Fireworks.createEmitter({nParticles : 40})
			.useSpawnerSteadyRate(20)
			.effectsStackBuilder()
				.position(Fireworks.createShapeSphere(0, 0,   0, 0.01))
				.velocity(Fireworks.createShapeSphere(0, 0, -30, 0.1))
				.lifeTime(1.5)
				.friction(0.98)
				.acceleration({
					effectId	: 'gravity',
					shape		: Fireworks.createShapePoint(0, 5, 0)
				})
				.randomVelocityDrift(Fireworks.createVector(0,0,9))
				.createEffect('scale', {
						origin	: 1/8,
						factor	: 1.005
					}).onBirth(function(particle){
						var object3d	= particle.get('threejsObject3D').object3d;
						var scale	= this.opts.origin;
						object3d.scale.set(scale, scale, scale)
					}).onUpdate(function(particle, deltaTime){
						var object3d	= particle.get('threejsObject3D').object3d;
						object3d.scale.multiplyScalar(this.opts.factor);
					}).back()
				.renderToThreejsObject3D({
					container	: this._container,
					create		: function(){
						var object3d	= new THREE.Sprite({
							//color			: 0xffaacc,
							useScreenCoordinates	: false,
							map			: texture,
							blending		: THREE.AdditiveBlending,
							transparent		: true
						});
						object3d.opacity	= 0.9;
						object3d.rotation	= Math.floor(Math.random()*Math.PI*2);
						object3d.uvScale.set(1, 1/urls.length);
						return object3d;
					}
				})
				.createEffect("spriteSheetAnimation")
					.onUpdate(function(particle, deltaTime){
						var object3d	= particle.get('threejsObject3D').object3d;
						var canonAge	= particle.get('lifeTime').normalizedAge();
						var imageIdx	= Math.floor(canonAge * (urls.length));
						var uvOffsetY	= imageIdx * 1/urls.length;
						object3d.uvOffset.set(0, uvOffsetY)
					}).back()
				.createEffect("updateSound")
					.onIntensityChange(function(newIntensity, oldIntensity){
						this._soundSetIntensity(newIntensity, oldIntensity);
					}.bind(this)).back()
				.createEffect("updateSpeed")
					.onIntensityChange(function(newIntensity, oldIntensity){
						//console.log('onIntensityChange', arguments, this) 
						var effect		= this.emitter().effectByName('velocity');
						effect.opts.speed	= 20 + 10 * newIntensity;
					}).back()
				.createEffect("blablaTOREMOVE")
					.onIntensityChange(function(newIntensity, oldIntensity){
						if( newIntensity === 0 ){
							this.emitter().spawner().stop();						
						}
						if( oldIntensity === 0 && newIntensity > 0 ){
							this.emitter().spawner().start();
						}
					}).back()
				.back()
			.start();
		emitter.intensity(0);
	};
}

Fireworks.ComboEmitter.Flamethrower.prototype._flamejetDtor	= function(){
}


//////////////////////////////////////////////////////////////////////////////////
//		sound								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Flamethrower.prototype._soundCtor	= function()
{
	// init the library
	var webaudio	= new WebAudio();
	// create a sound 
	var buffer	= webaudio.context().createBuffer(1, 44100, 44100);
	var fArray	= buffer.getChannelData(0);
	for(var i = 0; i < fArray.length; i++){
		fArray[i]	= Math.random()*2;
	}
	// set the buffer
	this._baseSound	= webaudio.createSound().loop(true).buffer(buffer);

}

Fireworks.ComboEmitter.Flamethrower.prototype._soundDtor	= function()
{
	this._sound	&& this._sound.stop();
	this._baseSound.destroy();
	this._webaudio.destroy();
}

Fireworks.ComboEmitter.Flamethrower.prototype._soundSetIntensity= function(newIntensity, oldIntensity)
{
	if( newIntensity > 0 && this._sound === null ){
		this._sound	= this._baseSound.play();
	}

	var sound	= this._sound;
	sound.node.gain.value	= newIntensity;
}





