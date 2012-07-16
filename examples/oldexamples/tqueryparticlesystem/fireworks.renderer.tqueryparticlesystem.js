/**
 * Shortcut to create Fireworks.Effect.ParticleSystem
*/
Fireworks.Emitter.prototype.pushRendererParticleSystem	= function(opts){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.RendererParticleSystem(emitter, opts));
	return this;	// for chained API
};


Fireworks.Effect.RendererParticleSystem	= function(emitter, opts)
{
	opts		= opts			|| {};
	opts.container	= opts.container	|| tQuery.world;
	this.opts	= opts;

	opts.geometry	= opts.geometry	|| (function(){
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
		return geometry;
	})();
	opts.material	= opts.material	|| new THREE.ParticleBasicMaterial({
		color		: 0xFFFFFF,
		vertexColors	: THREE.VertexColors,
		size		: 3,
		sizeAttenuation	: false
	});

	var geometry	= opts.geometry;
	var material	= opts.material;
	var mesh	= new THREE.ParticleSystem(geometry, material);
	this.object3d	= mesh;
	mesh.dynamic		= true;
	mesh.sortParticles	= true;
	
	opts.container.add(mesh);
	
	//////////////////////////////////////////////////////////////////////////
	//		Add Callbacks						//
	//////////////////////////////////////////////////////////////////////////
	this.onCreate	= function(particle, particleIdx){
		particle.xParticleSystem	= {
			particleIdx	: particleIdx
		};
	}.bind(this);

	// not sure it is needed... the particles hold the values
	//this.onBirth	= function(particle){
	//	var ctx		= particle.xParticleSystem;
	//	var particleIdx	= ctx.particleIdx; 
	//	var vertex	= geometry.vertices[particleIdx];
	//	vertex.x	= Math.random() * 2 - 1;
	//	vertex.y	= Math.random() * 2 - 1;
	//	vertex.z	= Math.random() * 2 - 1;
	//	vertex.multiplyScalar( 0.5 );
	//}.bind(this);

	//this.onDeath	= function(particle){
	//	var ctx		= particle.xParticleSystem;
	//	var particleIdx	= ctx.particleIdx; 
	//	var vertex	= geometry.vertices[particleIdx];
	//	// make vertex invisible
	//	vertex.x	= vertex.y = vertex.z = Infinity;
	//}
	
	this.onRender	= function(particle){
		var xBase	= particle.xBase;
		var xParticleSystem	= particle.xParticleSystem;
		var position	= xBase.position;
		var particleIdx	= xParticleSystem.particleIdx; 
		var vertex	= geometry.vertices[particleIdx];
		vertex.set(position.x, position.y, position.z);
	}
}

// inherit from Fireworks.Effect
Fireworks.Effect.RendererParticleSystem.prototype = new Fireworks.Effect();
Fireworks.Effect.RendererParticleSystem.prototype.constructor = Fireworks.Effect.RendererParticleSystem;
