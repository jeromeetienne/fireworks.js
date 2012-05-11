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
	
	this.onCreate	= function(particle){
		particle.xTquery	= {
			object3d	: tQuery.createCube().scaleBy(1/10)
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

