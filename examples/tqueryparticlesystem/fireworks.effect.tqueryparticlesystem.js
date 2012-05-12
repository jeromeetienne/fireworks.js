/**
 * Shortcut to create Fireworks.Effect.Init2Shapes
*/
Fireworks.Emitter.prototype.pushTquery	= function(opts){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.Tquery(emitter, opts));
	return this;	// for chained API
};


Fireworks.Effect.Tquery	= function(emitter, opts)
{
	opts		= opts			|| {};
	opts.container	= opts.container	|| tQuery.world;
	this.opts	= opts;

	var geometry	= new THREE.Geometry();
	for( var i = 0; i < 500; i ++ ){
		var vertex	= new THREE.Vector3();
		vertex.x	= Infinity;
		vertex.y	= Infinity;
		vertex.z	= Infinity;
		geometry.vertices.push( vertex );
		geometry.colors.push( new THREE.Color( 0xFFFFFF*Math.random() ) );
	}
	
	
	var texture	= THREE.ImageUtils.loadTexture( "../assets/images/sprites/ball.png" );
	var material	= new THREE.ParticleBasicMaterial({
		size		: 64,
		map		: texture,
		vertexColors	: THREE.VertexColors,
		sizeAttenuation	: false
	});

	
	//var material	= new THREE.ParticleBasicMaterial({
	//	color		: 0xFFFFFF,
	//	size		: 2,
	//	sizeAttenuation	: false
	//});
	var mesh	= new THREE.ParticleSystem(geometry, material);
	this.object3d	= mesh;
	mesh.dynamic		= true;
	mesh.sortParticles	= true;
	
	opts.container.add(mesh);
	
(function(){
	var particleIdx	= 0;
	this.onCreate	= function(particle){
		particle.xTquery	= {
			particleIdx	: particleIdx++
		};
	}.bind(this);
}.bind(this))();

	this.onBirth	= function(particle){
		var ctx		= particle.xTquery;
		var particleIdx	= ctx.particleIdx; 
		var vertex	= geometry.vertices[particleIdx];
		vertex.x	= Math.random() * 2 - 1;
		vertex.y	= Math.random() * 2 - 1;
		vertex.z	= Math.random() * 2 - 1;
		vertex.multiplyScalar( 0.5 );
	}.bind(this);

	this.onDeath	= function(particle){
		var ctx		= particle.xTquery;
		var particleIdx	= ctx.particleIdx; 
		var vertex	= geometry.vertices[particleIdx];
		vertex.x	= Infinity;
		vertex.y	= Infinity;
		vertex.z	= Infinity;
	}
}

// inherit from Fireworks.Effect
Fireworks.Effect.Tquery.prototype = new Fireworks.Effect();
Fireworks.Effect.Tquery.prototype.constructor = Fireworks.Effect.Tquery;

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

