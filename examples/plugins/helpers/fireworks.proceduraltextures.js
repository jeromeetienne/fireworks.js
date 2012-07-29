Fireworks.ProceduralTextures	= {};

Fireworks.ProceduralTextures.buildTexture	= function(size)
{
	size		= size || 150;
	var canvas	= document.createElement( 'canvas' );
	var context	= canvas.getContext( '2d' );
	canvas.width	= canvas.height	= size;

	var gradient	= context.createRadialGradient( canvas.width/2, canvas.height /2, 0, canvas.width /2, canvas.height /2, canvas.width /2 );		
	gradient.addColorStop( 0  , 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.5, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.7, 'rgba(128,128,128,1)' );
	gradient.addColorStop( 1  , 'rgba(0,0,0,1)' );

	context.beginPath();
	context.arc(size/2, size/2, size/2, 0, Math.PI*2, false);
	context.closePath();

	context.fillStyle	= gradient;
	//context.fillStyle	= 'rgba(128,128,128,1)';
	context.fill();

	var texture	= new THREE.Texture( canvas );
	texture.needsUpdate = true;

	return texture;
}

