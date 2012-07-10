/**
 * render to three.js to THREE.ParticleSystem
*/
Fireworks.EffectsStackBuilder.prototype.renderToThreejsParticleSystem	= function(opts)
{
	var effectId	= opts.effectId	|| 'renderToThreejsParticleSystem';
	var mesh	= opts.mesh;
	// create a mesh if needed
	if( !mesh ){
		var geometry	= new THREE.Geometry();
		for( var i = 0; i < emitter.nParticles(); i ++ ){
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
		var mesh	= new THREE.mesh(geometry, material);
		mesh.dynamic		= true;
		mesh.sortParticles	= true;
	}

	// sanity check
	console.assert(mesh instanceof THREE.mesh, "mesh MUST be THREE.ParticleSystem");
	// some aliases
	var geometry	= mesh.geometry;
	var material	= mesh.material;
	// create the effect itself
	Fireworks.createEffect(effectId, {
		mesh	: mesh
	}).onCreate(function(particle, particleIdx){
		particle.set('threejsParticle', {
			particleIdx	: particleIdx
		});
	}).onDeath(function(){
		var particleIdx	= particle.get('threejsParticle').particleIdx;
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(Infinity, Infinity, Infinity);
	}).onRender(function(particle){
		var particleIdx	= particle.get('threejsParticle').particleIdx;
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(position.x, position.y, position.z);
	}).pushTo(this._emitter);
	return this;	// for chained API
};
