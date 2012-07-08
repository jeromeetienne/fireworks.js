/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.position	= function(shape)
{
	var emitter	= this._emitter;
	console.assert( shape instanceof Fireworks.Shape );
	
	Fireworks.createEffect('Position', {
		shape	: shape
	}).onCreate(function(particle){
		particle.set('position', {
			vector	: new Fireworks.Vector()
		});
	}).onBirth(function(particle){
		var position	= particle.get('position').vector;
		this.opts.shape.randomPoint(position)
	}).pushTo(this);

	return this;	// for chained API
};
