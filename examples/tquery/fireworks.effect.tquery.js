Fireworks.Emitter.prototype.addEffectTquery	= function(opts){
	var emitter	= this;
	var effect	= new Fireworks.EffectTquery(emitter, opts);
	this._effects.push( effect );
	return this;	// for chained API
}


Fireworks.EffectTquery	= function(emitter, opts)
{
	opts		= opts		|| {};
	var world	= opts.world	|| tQuery.world;
	this.onCreate	= function(particle){
		particle.xTquery	= {
			object3d	: tQuery.createSphere().geometry().scaleBy(1/10).back()
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xTquery;
		world.add( ctx.object3d );
	}.bind(this);

	this.onDeath	= function(particle){
		var ctx	= particle.xTquery;
		world.remove( ctx.object3d );
	}
}

// inherit from Fireworks.Effect
Fireworks.EffectTquery.prototype = new Fireworks.Effect();
Fireworks.EffectTquery.prototype.constructor = Fireworks.EffectTquery;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

