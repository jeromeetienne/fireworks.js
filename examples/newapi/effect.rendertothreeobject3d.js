/**
 * render to three.js THREE.Object3D
 }
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreeObject3D	= function(opts)
{
	var effectId	= opts.effectId	|| 'renderToThreeParticleSystem';
	// create the effect itself
	Fireworks.createEffect(effectId, {
	.onCreate(function(particle, particleIdx){
		particle.set('threeObject3D', {
			object3d	: opts.createObject3d()
		});
		console.assert(particle.get('threeObject3D').object3d instanceof THREE.Object3D);
	}).onBirth(function(){
		var object3d	= particle.get('threeObject3D').object3d;
		object3d.visible= true;
	}).onDeath(function(){
		var object3d	= particle.get('threeObject3D').object3d;
		object3d.visible= false;		
	}).onRender(function(particle){
		var object3d	= particle.get('threeObject3D').object3d;
		var position	= particle.get('position').vector;
		object3d.position.set(position.x, position.y, position.z);
	}).pushTo(this._emitter);
	return this;	// for chained API
};
