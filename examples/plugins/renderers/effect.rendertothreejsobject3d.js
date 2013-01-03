/**
 * render to three.js THREE.Object3D
 * If i play with object3D.visible true/false instead of Object3D.add/remove
 * i got a lot of artefacts
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreejsObject3D	= function(opts)
{
	var effectId	= opts.effectId	|| 'renderToThreeParticleSystem';
	var container	= opts.container;


	// create the effect itself
	Fireworks.createEffect(effectId)
	.onCreate(function(particle, particleIdx){
		particle.threejsObject3D = {
			object3d	: opts.create()
		};
		Fireworks.debug && console.assert(particle.threejsObject3D.object3d instanceof THREE.Object3D);
		
		var object3d	= particle.threejsObject3D.object3d;

//		object3d.visible= false;
	}).onBirth(function(particle){
		var object3d	= particle.threejsObject3D.object3d;
//		object3d.visible= true;
		container.add(object3d);
	}).onDeath(function(particle){
		var object3d	= particle.threejsObject3D.object3d;
//		object3d.visible= false;
		container.remove(object3d);
	}).onRender(function(particle){
		var object3d	= particle.threejsObject3D.object3d;
		var position	= particle.position.vector;
		object3d.position.set(position.x, position.y, position.z);
	}).pushTo(this._emitter);
	return this;	// for chained API
};
