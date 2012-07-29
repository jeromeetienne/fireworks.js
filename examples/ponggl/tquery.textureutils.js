tQuery.register('TextureUtils', {});

/**
 * set the alpha channel of a texture based on its luminance. 
 * very usefull to generate alpha channel from image which doesnt have one (like .jpg files)
 * TODO Find a better name. shorter one
 *
 * @param {THREE.texture} texture the texture to modify
 * @param {function} computeAlpha function(p, i) which returns the alpha
 * @param {number} power the value by which the luminance will be powered	 
*/
tQuery.TextureUtils.generateAlpha	= function(texture, computeAlpha){
	// sanity check
	console.assert( texture instanceof THREE.Texture );
	// create a canvas
	var image	= texture.image;
	var canvas	= document.createElement('canvas');
	canvas.width	= image.width;
	canvas.height	= image.height;	
	var ctx		= canvas.getContext('2d');
	// draw the image in it
	ctx.drawImage(image, 0, 0);
	
	// create an alpha channel based on color luminance
	var imgData	= ctx.getImageData(0, 0, canvas.width, canvas.height);
	var p		= imgData.data;
	for(var i = 0, y = 0; y < canvas.height; y++){
		for(var x = 0; x < canvas.width; x++, i += 4){
			// compute alpha pixel value
			var alpha	= computeAlpha(p, i);
			// set the alpha in the imageData 
			p[i+3]		= alpha;
		}
	}
	// put the generated image in the canvas
	ctx.putImageData(imgData, 0, 0);
	// update the texture object itself
	texture.image		= canvas;
	texture.needsUpdate	= true;		
}

/**
 * set the alpha channel of a texture based on its luminance. 
 * very usefull to generate alpha channel from image which doesnt have one (like .jpg files)
 * TODO Find a better name. shorter one
 *
 * @param {THREE.texture} texture the texture to modify
 * @param {number} multiplier the value by which the luminance will be multiplied
 * @param {number} power the value by which the luminance will be powered	 
*/
tQuery.TextureUtils.generateAlphaFromLuminance	= function(texture, multiplier, power){
	// handle parameters polymorphism
	multiplier	= multiplier !== undefined ? multiplier	: 1;
	power		= power !== undefined ? power : 1;
	// forward to tQuery.TextureUtils.setAlphaFromLuminance
	return tQuery.TextureUtils.setAlphaFromLuminance(texture, function(p, i){
		// compute luminance
		var luminance	= (0.2126*p[i+0]) + (0.7152*p[i+1]) + (0.0722*p[i+2]);
		// increase contrast of the luminance based on 'power'
		// TODO experiment with normal tween funciton
		var alpha	= Math.pow(luminance/255, power)*255;
		// set the luminance after mutiplying it
		alpha		*= multiplier;
		return alpha;
	});
}

