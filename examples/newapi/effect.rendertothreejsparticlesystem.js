/**
 * render to three.js to THREE.ParticleSystem
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreejsParticleSystem	= function(opts)
{
	opts		= opts		|| {};
	var effectId	= opts.effectId	|| 'renderToThreejsParticleSystem';
	var create	= opts.create	|| function(){
		var geometry	= new THREE.Geometry();
		for( var i = 0; i < this._emitter.nParticles(); i ++ ){
			geometry.vertices.push( new THREE.Vector3() );
		}
		var material	= new THREE.ParticleBasicMaterial({
			size		: 0.01,
			sizeAttenuation	: true
		});
		var particleSystem		= new THREE.ParticleSystem(geometry, material);
		particleSystem.dynamic		= true;
		particleSystem.sortParticles	= true;
		return particleSystem;
	};

	// create the particle system
	var particleSystem	= create(this._emitter);
	// sanity check
	console.assert(particleSystem instanceof THREE.ParticleSystem, "mesh MUST be THREE.ParticleSystem");
	// some aliases
	var geometry	= particleSystem.geometry;
	var material	= particleSystem.material;
	// create the effect itself
	Fireworks.createEffect(effectId, {
		particleSystem	: particleSystem
	}).onCreate(function(particle, particleIdx){
		particle.set('threejsParticle', {
			particleIdx	: particleIdx
		});
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(Infinity, Infinity, Infinity);
	}).onDeath(function(particle){
		var particleIdx	= particle.get('threejsParticle').particleIdx;
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(Infinity, Infinity, Infinity);
	}).onRender(function(particle){
		var particleIdx	= particle.get('threejsParticle').particleIdx;
		var vertex	= geometry.vertices[particleIdx];
		var position	= particle.get('position').vector;
		vertex.set(position.x, position.y, position.z);
	}).pushTo(this._emitter);
	return this;	// for chained API
};
