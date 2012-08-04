Fireworks.ComboEmitter.Smokepuff	= function(opts){
	opts		= {};
	this._webaudio	= opts.webaudio	|| new WebAudio();
	this._loop	= opts.loop	|| tQuery.world.loop();
	this._container	= new THREE.Object3D();
	this._emitter	= null;	
	
	this._emitterCtor();
	this._soundCtor();

	// update the emitter in rendering loop
	this._$loopCb	= this._loop.hook(this._loopCb.bind(this));
}

Fireworks.ComboEmitter.Smokepuff.prototype._destroy	= function(){
	this._loop.unhook(this._$loopCb);
	this._emitterDtor();
	this._soundDtor();
}

// inherit from Fireworks.ComboEmitter
Fireworks.ComboEmitter.Smokepuff.prototype		= new Fireworks.ComboEmitter();
Fireworks.ComboEmitter.Smokepuff.prototype.constructor	= Fireworks.ComboEmitter.Smokepuff;

//////////////////////////////////////////////////////////////////////////////////
//		Getter								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Smokepuff.prototype.shoot	= function(){
	var spawner	= this._emitter.effect('spawner').opts;
	spawner.start();
	spawner.reset();
	
	this._soundPlay();
};

//////////////////////////////////////////////////////////////////////////////////
//		Getter								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Smokepuff.prototype.object3D	= function(){
	return this._container;
};

Fireworks.ComboEmitter.Smokepuff.prototype.sound	= function(){
	return this._sound;
};

//////////////////////////////////////////////////////////////////////////////////
//		rendering loop function						//
//////////////////////////////////////////////////////////////////////////////////


Fireworks.ComboEmitter.Smokepuff.prototype._loopCb	= function(delta, now){
	// render this._emitter
	this._emitter.update(delta).render();
}


//////////////////////////////////////////////////////////////////////////////////
//		Flame jet emitter						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Create the flame jet
*/
Fireworks.ComboEmitter.Smokepuff.prototype._emitterCtor	= function(){
	var container	= this._container;
	var texture	= THREE.ImageUtils.loadTexture( "../assets/images/cloud10.png");
	var emitter	= this._emitter	= Fireworks.createEmitter({nParticles : 100})
		.effectsStackBuilder()
			.spawnerOneShot(2)
			.position(Fireworks.createShapeSphere(0, 0, 0, 0.1))
			.velocity(Fireworks.createShapeSphere(0, 80, 0, 10), 40)
			.lifeTime(1.0, 1.4)
			.friction(0.90)
			.randomVelocityDrift(Fireworks.createVector(20,10,0))
			.createEffect('scale', {
					origin	: 1/60,
					factor	: 1.005
				}).onBirth(function(particle){
					var object3d	= particle.get('threejsObject3D').object3d;
					var scale	= this.opts.origin;
					object3d.scale.set(scale, scale)
				}).onUpdate(function(particle, deltaTime){
					var object3d	= particle.get('threejsObject3D').object3d;
					object3d.scale.multiplyScalar(this.opts.factor);
				}).back()
			.createEffect('rotation')
				.onBirth(function(particle){
					var object3d	= particle.get('threejsObject3D').object3d;
					object3d.rotation	= Math.floor(Math.random()*Math.PI*2);
				}).back()
			.createEffect('opacity', {
					factor	: 1,
					gradient: Fireworks.createLinearGradient()
							.push(0.00, 0.00)
							.push(0.05, 1.00)
							.push(0.70, 1.00) 
							.push(1.00, 0.00)			
				}).onUpdate(function(particle){
					var object3d	= particle.get('threejsObject3D').object3d;
					var canonAge	= particle.get('lifeTime').normalizedAge();
					object3d.opacity= this.opts.gradient.get(canonAge) * this.opts.factor;
				}).back()
			.renderToThreejsObject3D({
				container	: container,
				create		: function(){
					return new THREE.Sprite({
						//color		: 0x668844,
						//color		: 0x88aa66,
						// color		: 0x888888,
						color			: 0x666666,
						useScreenCoordinates	: false,
						map			: texture,
						//blending		: THREE.AdditiveBlending,
						transparent		: true
					});
				}	
			})
			.back()
		.start();
	// stop the spawner
	var spawner	= this._emitter.effect('spawner').opts;
	spawner.stop();
}

Fireworks.ComboEmitter.Smokepuff.prototype._emitterDtor	= function(){
}

//////////////////////////////////////////////////////////////////////////////////
//		sound								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Smokepuff.prototype._soundCtor	= function(){
	// generate the data with jsfx
	// tune your own [here](http://egonelbre.com/js/jsfx/)
	var lib		= ["synth",5.0000,0.2960,0.0000,0.1700,0.0000,0.1600,110.0000,462.0000,2400.0000,-0.7400,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.2165,0.0260,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
	var params	= jsfxlib.arrayToParams(lib);
	var data	= jsfx.generate(params);
	// create and fill the buffer
	var buffer	= this._webaudio.context().createBuffer(1, data.length, 44100);
	var fArray	= buffer.getChannelData(0);
	for(var i = 0; i < fArray.length; i++){
		fArray[i]	= data[i];
	}
	// create the sound
	var sound	= this._webaudio.createSound();
	this._sound	= sound;
	// set the buffer
	sound.buffer(buffer);
}
Fireworks.ComboEmitter.Smokepuff.prototype._soundDtor	= function(){
	this._sound.destroy();
}

Fireworks.ComboEmitter.Smokepuff.prototype._soundPlay	= function(){
	this._sound.play();
}