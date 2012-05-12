/**
 * Shortcut to create Fireworks.Effect.Init2Shapes
*/
Fireworks.Emitter.prototype.pushTquery	= function(opts){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.Tquery(emitter, opts));
	return this;	// for chained API
};


Fireworks.Effect.Tquery	= function(emitter, opts)
{
	opts		= opts			|| {};
	opts.container	= opts.container	|| tQuery.world;
	this.opts	= opts;
	
	//var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/lensflare1.jpg" );
	var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/lensFlare/Flare1.png" );
	//var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/lensFlare/Flare2.png" );
	//var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/ball.png" );
	//var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/shadow.png" );
	var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/sprite0.png" );
	//var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/tremulous/flame/flame10.jpg" );
	//var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/tremulous/lasgun/purple_particle.jpg" );
	var flareA	= THREE.ImageUtils.loadTexture( "../assets/images/tremulous/psaw/blue_particle.jpg" );
	var param	= {
		map			: flareA,
		useScreenCoordinates	: false,
		color			: 0xAA4488,
		blending		: THREE.AdditiveBlending,
		opacity			: 0.3
	};
	this.onCreate	= function(particle){
		var sprite		= new THREE.Sprite( param );
		var object3d		= tQuery(sprite);
		//object3d	: tQuery.createCube().scaleBy(1/10)
		particle.xTquery	= {
			object3d	: object3d
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xTquery;
		opts.container.add( ctx.object3d );
	}.bind(this);

	this.onDeath	= function(particle){
		var ctx	= particle.xTquery;
		opts.container.remove( ctx.object3d );
	}
}

// inherit from Fireworks.Effect
Fireworks.Effect.Tquery.prototype = new Fireworks.Effect();
Fireworks.Effect.Tquery.prototype.constructor = Fireworks.Effect.Tquery;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

