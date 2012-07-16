/**
 * Handle the friction - aka a value between 0 and 1 which multiply the velocity
 *
 * @param {Number} value the friction number between 0 and 1
*/
Fireworks.EffectsStackBuilder.prototype.friction	= function(value)
{
	// handle parameter polymorphism
	value	= value !== undefined ? value	: 1;
	// sanity check
	console.assert( value >= 0 && value <= 1.0 );
	// create the effect itself
	Fireworks.createEffect('friction')
	.onCreate(function(particle, particleIdx){
		particle.set('friction', {
			value	: value,
		});
	})
	.onBirth(function(particle){
		var data	= particle.get('friction');
		data.value	= value
	})
	.onUpdate(function(particle){
		var friction	= particle.get('friction').value;
		var velocity	= particle.get('velocity').vector;
		velocity.multiplyScalar(friction);
	})
	.pushTo(this._emitter);
	// return this for chained API
	return this;
};
