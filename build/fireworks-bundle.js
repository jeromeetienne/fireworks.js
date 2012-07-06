

var Fireworks	= {};/**
 * The emitter of particles
*/
Fireworks.Emitter	= function(opts){
	this._nParticles= opts.nParticles !== undefined ? opts.nParticles : 100;
	this._particles	= [];
	this._spawner	= null;
	this._effects	= [];
	this._started	= false;
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
Fireworks.Emitter.prototype.nParticles	= function(){
	return this._nParticles;
}

Fireworks.Emitter.prototype.setSpawner	= function(spawner){
	this._spawner	= spawner;
	return this;	// for chained API
}


Fireworks.Emitter.prototype.setParticleData	= function(particle, namespace, value){
	particle[namespace]	= value;
}

Fireworks.Emitter.prototype.getParticleData	= function(particle, namespace){
	console.assert( particle[namespace] !== undefined, "namespace undefined: "+namespace );
	return particle[namespace];
}

//////////////////////////////////////////////////////////////////////////////////
//		Start function							//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Emitter.prototype.start	= function()
{
	console.assert( this._spawner, "a spawner MUST be set" );
	console.assert( this._effects.length > 0, "Some effects MUST be set")
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
	console.assert( idx !== -1 )
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
	// change the particles 
	var particle	= this.deadParticles().pop();
	this.liveParticles().push(particle);
	// do the birth on all effects
	this.effects().forEach(function(effect){
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
 * Basic Fireworks.Effect builder
*/
Fireworks.createEffect	= function(name, opts){
	// handle polymophism
	if( typeof(name) === 'object' ){
		opts	= name;
		name	= undefined;
	}
	console.log("createEffect", name, opts)
	
	var effect	= new Fireworks.Effect();
	effect.opts	= opts;
	effect.name	= name;
	var methods	= {
		onCreate: function(val){
			effect.onCreate	= val;
			return methods;
		},
		onBirth: function(val){
			effect.onBirth	= val;
			return methods;
		},
		onUpdate: function(val){
			effect.onUpdate	= val;
			return methods;
		},
		onDeath: function(val){
			effect.onDeath	= val;
			return methods;
		},
		onPreRender: function(val){
			effect.onPreRender	= val;
			return methods;
		},
		onRender: function(val){
			effect.onRender	= val;
			return methods;
		},
		pushTo	: function(emitter){
			emitter.effects().push(effect);
			return methods;	
		},
		effect	: function(){
			return effect;
		}
	}
	return methods;
}

/**
 * An effect to apply on particles
*/
Fireworks.Effect	= function(){
}

/**
 * Callback called on particle creation
*/
//Fireworks.Effect.prototype.onCreate	= function(){
//}
//
/**
 * Callback called when a particle is spawning
 *
 * TODO to rename onSpawn
*/
//Fireworks.Effect.prototype.onBirth	= function(){
//}
//
//Fireworks.Effect.prototype.onDeath	= function(){
//}
//
//Fireworks.Effect.prototype.onUpdate	= function(){
//}

Fireworks.Shape	= function(){
}

///**
// * @param {Fireworks.Vector} point the point coordinate to test
// * @returns {Boolean} true if point is inside the shape, false otherwise
//*/
//Fireworks.Shape.prototype.contains	= function(point){
//}
//
///**
// * generate a random point contained in this shape
// * @returns {Fireworks.Vector} the just generated random point
//*/
//Firefly.Shape.prototype.randomPoint	= function(){
//}
/**
 * jme- copy of THREE.Vector3 https://github.com/mrdoob/three.js/blob/master/src/core/Vector3.js
 *
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

Fireworks.Vector = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};


Fireworks.Vector.prototype = {

	constructor: Fireworks.Vector,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},
	
	random	: function( ) {
		this.x	= Math.random() - 0.5;
		this.y	= Math.random() - 0.5;
		this.z	= Math.random() - 0.5;
		return this;
	}, // jme - added
	
	toString	: function(){
		return JSON.stringify(this);
	}, // jme - added

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},
	
	cross: function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf: function ( v ) {

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		return new Fireworks.Vector().sub( this, v ).lengthSq();

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	isZero: function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	},

	clone: function () {

		return new Fireworks.Vector( this.x, this.y, this.z );

	}

};
/**
 * Shortcut to create Fireworks.EffectAge
*/
Fireworks.Emitter.prototype.pushAge	= function(minAge, maxAge){
	var emitter	= this;
	if( arguments.length === 1 ){
		minAge	= minAge;
		maxAge	= minAge;
	}
	emitter.effects().push(new Fireworks.EffectAge(emitter, minAge, maxAge));
	return this;	// for chained API
};


Fireworks.EffectAge	= function(emitter, minAge, maxAge)
{
	console.assert( minAge !== undefined )
	console.assert( maxAge !== undefined )
	this.onCreate	= function(particle){
		particle.xAge	= {
			curAge	: 0,
			minAge	: 0,
			maxAge	: 0
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xAge;
		ctx.curAge	= 0;
		ctx.maxAge	= minAge + Math.random()*(maxAge-minAge);
	}.bind(this);
	
	this.onUpdate	= function(particle, deltaTime){
		var ctx	= particle.xAge;
		ctx.curAge	+= deltaTime;
		if( ctx.curAge > ctx.maxAge )	emitter.killParticle(particle);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.EffectAge.prototype = new Fireworks.Effect();
Fireworks.EffectAge.prototype.constructor = Fireworks.EffectAge;
Fireworks.Effect.ApplyForce	= function(emitter, opts)
{
	this.onUpdate	= function(particle){
		var xBase	= emitter.getParticleData(particle, 'xBase')
		xBase.position.addSelf(opts.vector);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.ApplyForce.prototype = new Fireworks.Effect();
Fireworks.Effect.ApplyForce.prototype.constructor = Fireworks.Effect.ApplyForce;


/**
 * Shortcut to create Fireworks.EffectBase
*/
Fireworks.Emitter.prototype.pushBase	= function(maxAge){
	var emitter	= this;
	emitter.effects().push(new Fireworks.EffectBase(emitter, maxAge));
	return this;	// for chained API
};


Fireworks.EffectBase	= function(emitter, opts)
{
	this.name	= "Base";
	this.opts	= {
		friction	: 0.99,
		birthPosition	: new Fireworks.Vector(0,0,0),
		birthVelocity	: new Fireworks.Vector(1,0,0),
		birthAcceleration:new Fireworks.Vector(0,0,0)
	};
	this.onCreate	= function(particle){
		emitter.setParticleData(particle, 'xBase', {
			position	: new Fireworks.Vector(),
			velocity	: new Fireworks.Vector(),
			acceleration	: new Fireworks.Vector(),
			friction	: this.opts.friction
		});
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= emitter.getParticleData(particle, 'xBase')
		ctx.position.copy( this.opts.birthPosition );
		ctx.velocity.copy( this.opts.birthVelocity );
		ctx.acceleration.copy( this.opts.birthAcceleration );
		ctx.friction	= this.opts.friction;
	}.bind(this);
	
	this.onUpdate	= function(particle){
		var ctx	= particle.xBase;
		ctx.velocity.addSelf(ctx.acceleration);
		ctx.velocity.multiplyScalar(ctx.friction);
		ctx.position.addSelf(ctx.velocity);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.EffectBase.prototype = new Fireworks.Effect();
Fireworks.EffectBase.prototype.constructor = Fireworks.EffectBase;


/**
 * Shortcut to create Fireworks.Effect.Init2Shapes
*/
Fireworks.Emitter.prototype.pushDieIfContained	= function(shape){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.DieIfContained(emitter, shape));
};


Fireworks.Effect.DieIfContained	= function(emitter, shape)
{
	this.onUpdate	= function(particle){
		var xBase	= emitter.getParticleData(particle, 'xBase');
		var position	= xBase.position;
		if( shape.contains(position) )	emitter.killParticle(particle);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.DieIfContained.prototype = new Fireworks.Effect();
Fireworks.Effect.DieIfContained.prototype.constructor = Fireworks.Effect.DieIfContained;

/**
 * Shortcut to create Fireworks.Effect.Init2Shapes
*/
Fireworks.Emitter.prototype.pushInit2Shapes	= function(opts){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.Init2Shapes(emitter, opts));
	return this;	// for chained API
};

Fireworks.Effect.Init2Shapes	= function(emitter, opts)
{
	console.assert( opts.origin instanceof Fireworks.Shape );
	console.assert( opts.target instanceof Fireworks.Shape );
	opts.speed	= opts.speed !== undefined ? opts.speed : 1;
	this.opts	= opts;
	this.name	= "Init2Shapes"
	this.onBirth	= function(particle){
		var ctx	= emitter.getParticleData(particle, 'xBase')

		ctx.position.copy( opts.origin.randomPoint() );
		
		var delta	= opts.target.randomPoint().subSelf(ctx.position);
		delta.setLength(opts.speed);

		ctx.velocity.copy( delta );
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.Init2Shapes.prototype = new Fireworks.Effect();
Fireworks.Effect.Init2Shapes.prototype.constructor = Fireworks.Effect.Init2Shapes;


/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createBox	= function(centerX, centerY, centerZ, sizeX, sizeY, sizeZ){
	var center	= new Fireworks.Vector(centerX, centerY, centerZ);
	var size	= new Fireworks.Vector(sizeX, sizeY, sizeZ);
	return new Fireworks.Shape.Box(center, size);
};

/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} center the center of the sphape
 * @param {Fireworks.Vector} shape the size of the shape
*/
Fireworks.Shape.Box	= function(center, size)
{
	this.center	= center;
	this.size	= size;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.Shape.Box.prototype = new Fireworks.Shape();
Fireworks.Shape.Box.prototype.constructor = Fireworks.Shape.Box;

Fireworks.Shape.Box.prototype.contains	= function(point){
	// compute delta between the point and the center
	var delta	= this._vector.sub(point, this.center);
	// test the delta is too far
	if( Math.abs(delta.x) > this.size.x/2 )	return false;
	if( Math.abs(delta.y) > this.size.y/2 )	return false;
	if( Math.abs(delta.z) > this.size.z/2 )	return false;
	// if all tests, passed true
	return true;
}

Fireworks.Shape.Box.prototype.randomPoint	= function(){
	var point	= this._vector;
	// get a random point
	point.x	= Math.random() * this.size.x - this.size.x/2;
	point.y	= Math.random() * this.size.y - this.size.y/2;
	point.z	= Math.random() * this.size.z - this.size.z/2;
	// add this.center
	point.addSelf(this.center);
	// return the point
	return point;
}
Fireworks.DatGui4Emitter	= function(emitter){
	var gui		= new dat.GUI();
	var effects	= emitter.effects();
	effects.forEach(function(effect, idx){
		var effectName	= effect.name	|| "effect-"+idx;
		var opts	= effect.opts	|| {};
		var keys	= Object.keys(opts).filter(function(key){
			if( opts[key] instanceof Fireworks.Vector )	return true;
			if( typeof(opts[key]) === 'object' )		return false;
			return true;
		});
		if( keys.length ){
			var folder	= gui.addFolder('Effect: '+effectName);
			keys.forEach(function(key){
				if( opts[key] instanceof Fireworks.Vector ){
					folder.add(opts[key], 'x').name(key+"X");
					folder.add(opts[key], 'y').name(key+"Y");
					folder.add(opts[key], 'z').name(key+"Z");
				}else{
					folder.add(opts, key);
				}
			});
		}
	});
	// return the built gui
	return gui;
};/**
 * Shortcut to create Fireworks.Shape.Box
*/
Fireworks.createSphere	= function(centerX, centerY, centerZ, radius){
	var center	= new Fireworks.Vector(centerX, centerY, centerZ);
	return new Fireworks.ShapeSphere(center, radius);
};


/**
 * Handle a Firework.Shape forming a sphere
 *
 * @param {Fireworks.Vector} center the center of the sphere
 * @param {Number} radius the radius of the sphere
*/
Fireworks.ShapeSphere	= function(center, radius)
{
	this.center	= center;
	this.radius	= radius;
	this._vector	= new Fireworks.Vector();
}

// inherit from Fireworks.Effect
Fireworks.ShapeSphere.prototype = new Fireworks.Shape();
Fireworks.ShapeSphere.prototype.constructor = Fireworks.ShapeSphere;

Fireworks.ShapeSphere.prototype.contains	= function(point){
	// compute distance between the point and the center
	var distance	= this._vector.sub(point, this.center).length();
	// return true if this distance is <= than sphere radius
	return distance <= this.radius;
}

Fireworks.ShapeSphere.prototype.randomPoint	= function(){
	var point	= this._vector;
	// get a random point
	point.x	= Math.random()-0.5;
	point.y	= Math.random()-0.5;
	point.z	= Math.random()-0.5;
	// compute the length between the point 
	var length	= Math.random()*this.radius;
	// set the point at the proper distance;
	point.setLength( length );
	// add the center
	point.addSelf(this.center);
	// return the point
	return point;
}
Fireworks.SpawnerOneShot	= function(nParticles){
	this._nParticles	= nParticles	|| 1;
	this._completed		= false;
}

// inherit from Fireworks.Spawner
Fireworks.SpawnerOneShot.prototype = new Fireworks.Spawner();
Fireworks.SpawnerOneShot.prototype.constructor = Fireworks.SpawnerOneShot;

Fireworks.SpawnerOneShot.prototype.update	= function(emitter, deltaTime){
	// if already completed, do nothing
	if( this._completed )	return;
	// spawn each particle
	for(var i = 0; i < this._nParticles; i++){
		emitter.spawnParticle();
	}
	// mark it as completed
	this._completed	= true;
}

Fireworks.SpawnerRate	= function(rate){
	this._rate	= rate	|| 10;
	this._nToCreate	= 1;
}

// inherit from Fireworks.Spawner
Fireworks.SpawnerRate.prototype = new Fireworks.Spawner();
Fireworks.SpawnerRate.prototype.constructor = Fireworks.SpawnerRate;

Fireworks.SpawnerRate.prototype.update	= function(emitter, deltaTime){
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

