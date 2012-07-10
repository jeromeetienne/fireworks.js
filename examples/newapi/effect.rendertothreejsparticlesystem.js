/**
 * render to three.js to THREE.ParticleSystem
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreejsParticleSystem	= function(opts)
{
	opts			= opts		|| {};
	var effectId		= opts.effectId	|| 'renderToThreejsParticleSystem';
	var particleSystem	= opts.particleSystem;
	// create a mesh if needed
	if( !particleSystem ){
		var geometry	= new THREE.Geometry();
		for( var i = 0; i < this._emitter.nParticles(); i ++ ){
			var vertex	= new THREE.Vector3();
			// make vertex invisible
			vertex.x	= vertex.y = vertex.z = Infinity;
			geometry.vertices.push( vertex );
			// set the THREE.VertexColors,
			var color	= new THREE.Color( 0xFFFFFF*Math.random() );
			geometry.colors.push( color );
		}
		var material	= new THREE.ParticleBasicMaterial({
			color		: 0xFFFFFF,
			vertexColors	: THREE.VertexColors,
			size		: 3,
			sizeAttenuation	: false
		});
		var particleSystem		= new THREE.ParticleSystem(geometry, material);
		particleSystem.dynamic		= true;
		particleSystem.sortParticles	= true;
	}

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
