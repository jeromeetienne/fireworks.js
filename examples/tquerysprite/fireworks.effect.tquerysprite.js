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
	opts			= opts			|| {};
	opts.container		= opts.container	|| tQuery.world;
	opts.createObject3d	= opts.createObject3d	|| console.assert(false);
	this.opts		= opts;
	
	this.onCreate	= function(particle, particleIdx){
		particle.xTquery	= {
			object3d	: opts.createObject3d()
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

	this.onRender	= function(particle){
		var xBase	= particle.xBase;
		var xTquery	= particle.xTquery;
		var position	= xBase.position;
		var tObject3d	= xTquery.object3d.get(0);
		tObject3d.position.set(position.x, position.y, position.z);
	}
}

// inherit from Fireworks.Effect
Fireworks.Effect.Tquery.prototype = new Fireworks.Effect();
Fireworks.Effect.Tquery.prototype.constructor = Fireworks.Effect.Tquery;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

