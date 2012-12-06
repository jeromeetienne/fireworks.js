/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.position = function(shape)
{
	console.assert( shape instanceof Fireworks.Shape );
	Fireworks.createEffect('position', {
		shape: shape
	}).onCreate(function(particle){
		particle.position = {
			vector: new Fireworks.Vector()
		};
	}).onBirth(function(particle){
		var position = particle.position.vector;
		this.opts.shape.randomPoint(position)
	}).pushTo(this._emitter);
	return this; // for chained API
};
