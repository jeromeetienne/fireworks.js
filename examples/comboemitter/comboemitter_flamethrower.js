Fireworks.ComboEmitter.Flamethrower	= function(opts){
	this._container	= new THREE.Object3D();
	this._emitterJet= null;	
	this._onReady	= opts.onReady	|| function(comboEmitter){};
	this._webaudio	= opts.webaudio	|| new WebAudio();
	this._baseSound	= null;
	this._sound	= null;
	
	// data to handle attackTime/releaseTime
	this._state	= 'stopped';
	this._lastStart	= 0;
	this._lastStop	= 0;
	this._attackTime	= 1.0;
	this._releaseTime	= 0.3;
	
	
	this._flamejetCtor();
	this._soundCtor();
	// update the emitter in rendering loop
	this._$loopCb	= world.loop().hook(this._loopCb.bind(this));
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

Fireworks.ComboEmitter.Flamethrower.prototype.ungracefullStop	= function(){
	this._state	= 'stopped';
	this._lastStop	= 0;
}

/**
 * @return {boolean} true if it is ready, false otherwise
*/
Fireworks.ComboEmitter.Flamethrower.prototype.isReady	= function(){
	// test if the sound has been loaded
	if( !this._baseSound.isPlayable() )	return false;
	// test the spritesheet has been loaded
	if( !this._emitterJet )			return false;
	// if all previous tests passed, it is ready
	return true;
}

Fireworks.ComboEmitter.Flamethrower.prototype._notifyReadyIfPossible	= function(){
	if( this.isReady() === false )	return;
	this._onReady(this);
}

//////////////////////////////////////////////////////////////////////////////////
//		Getter								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Flamethrower.prototype.object3D	= function(){
	return this._container;
}

Fireworks.ComboEmitter.Flamethrower.prototype.sound	= function(){
	return this._baseSound;
}

//////////////////////////////////////////////////////////////////////////////////
//		rendering loop function						//
//////////////////////////////////////////////////////////////////////////////////


Fireworks.ComboEmitter.Flamethrower.prototype._loopCb	= function(delta, now){
	if( !this._emitterJet ) return;
	
	// render this._emitterJet
	this._emitterJet.update(delta).render();
	
	// handle intensity depending on attackTime/releaseTime
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
	
	// set gravity in local space
	var emitter	= this._emitterJet;
	var container	= this._container;
	var effect	= emitter.effect('gravity');
	var matrix	= container.matrixWorld.clone().setPosition({x:0,y:0,z:0}).transpose();
	var position	= effect.opts.shape.position.set(0, 10, 0);
	matrix.multiplyVector3(position);
}


//////////////////////////////////////////////////////////////////////////////////
//		Flame jet emitter						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Create the flame jet
*/
Fireworks.ComboEmitter.Flamethrower.prototype._flamejetCtor	= function(){
	var urls	= [
		// "../assets/images/flame/flame00.png",
		// "../assets/images/flame/flame01.png",
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


	loadTremulousFlameParticule(urls, buildEmitter.bind(this));
	return;

	function buildEmitter(texture){
		//console.log("spriteSheet loaded");
		var cemitter	= this;
		var emitter	= this._emitterJet	= Fireworks.createEmitter({nParticles : 100})
			.effectsStackBuilder()
				.spawnerSteadyRate(20)
				.position(Fireworks.createShapeSphere(0, 0,   0, 0.01))
				.velocity(Fireworks.createShapeSphere(0, 0, -30, 0.1), 30)
				.lifeTime(0.8, 1.5)
				.friction(0.98)
				.acceleration({
					effectId	: 'gravity',
					shape		: Fireworks.createShapePoint(0, 10, 0)
				})
				.randomVelocityDrift(Fireworks.createVector(0,0,20))
				.createEffect('scale', {
						origin	: 1/8,
						factor	: 1.005
					}).onBirth(function(particle){
						var object3d	= particle.get('threejsObject3D').object3d;
						var scale	= this.opts.origin * cemitter.object3D().scale.x;
						object3d.scale.set(scale, scale, scale)
					}).onUpdate(function(particle, deltaTime){
						var object3d	= particle.get('threejsObject3D').object3d;
						object3d.scale.multiplyScalar(this.opts.factor);
					}).back()
				.createEffect('rotation')
					.onBirth(function(particle){
						var object3d	= particle.get('threejsObject3D').object3d;
						object3d.rotation	= Math.random()*Math.PI*2;
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
				.createEffect("soundIntensity")
					.onIntensityChange(function(newIntensity, oldIntensity){
						this._soundSetIntensity(newIntensity, oldIntensity);
					}.bind(this)).back()
				.createEffect("spawnerIntensity")
					.onIntensityChange(function(newIntensity, oldIntensity){
						var spawner	= this.emitter().effect('spawner');
						if( newIntensity === 0 ){
							spawner.opts.stop();
						}
						if( oldIntensity === 0 && newIntensity > 0 ){
							spawner.opts.start();
						}
					}).back()
				.back()
			.start();
		emitter.intensity(0);
		// notify the caller it is ready if possible
		this._notifyReadyIfPossible();
	};
	
	//////////////////////////////////////////////////////////////////////////
	//		misc helpers						//
	//////////////////////////////////////////////////////////////////////////
	function loadTremulousFlameParticule(urls, onReady){
		// load all the images from urls
		tQuery.TextureUtils.loadImages(urls, function(images, urls){
			// build a tiled spreadsheet canvas with images
			var canvas	= tQuery.TextureUtils.buildTiledSpriteSheet({
				images	: images,
				spriteW	: images[0].width,
				spriteH	: images[0].height,
				nSpriteX: 1
			});
			// create the texture
			var texture	= new THREE.Texture( canvas );
			texture.needsUpdate = true;
			// generate Alpha as it got no alpha 
			tQuery.TextureUtils.generateAlphaFromLuminance(texture, 16, 1);
			// notify caller
			onReady(texture, urls)
		})
	}
}

Fireworks.ComboEmitter.Flamethrower.prototype._flamejetDtor	= function(){
}


//////////////////////////////////////////////////////////////////////////////////
//		sound								//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.ComboEmitter.Flamethrower.prototype._soundCtor	= function()
{
	// create a sound 
	this._baseSound	= this._webaudio.createSound().loop(true);	
	// load the sound
	this._baseSound.load('sounds/flamethrower-freesoundloop.wav', function(sound){
		// notify the caller it is ready if possible
		this._notifyReadyIfPossible();
	}.bind(this));
}

Fireworks.ComboEmitter.Flamethrower.prototype._soundDtor	= function()
{
	this._sound	&& this._sound.stop();
	this._baseSound.destroy();
}

Fireworks.ComboEmitter.Flamethrower.prototype._soundSetIntensity= function(newIntensity, oldIntensity)
{
	//console.log('isPlayable', this._baseSound.isPlayable())
	// if sound isnt yet playable (like not loaded), return now
	if( this._baseSound.isPlayable() === false )	return;
	
	if( newIntensity > 0 && this._sound === null ){
		this._sound	= this._baseSound.play();
	}

	var sound	= this._sound;
	sound.node.playbackRate.value	= 0.5+newIntensity*1.5;
	sound.node.gain.value		= newIntensity*10;
}





