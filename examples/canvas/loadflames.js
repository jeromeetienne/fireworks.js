function loadFlames(urls, callback){
	var images	= [];

	// load all the images and convert them
	var flow	= Flow();
	urls.forEach(function(url){
		flow.seq(function(next){
			var image	= new Image;
			image.onload	= function(){
				var luminanceMult	= 4;
				convertTremulousImage(image, luminanceMult, function(resultImage, originalImage){
					console.log("image converted", resultImage);
					images.push(resultImage);
					next();
				});
			};
			image.src	= url;
		});
	});

	// build the function which is run once all is loaded
	flow.seq(function(){
		console.log("all flow completed")
		// notify the caller
		callback(images, urls);
	})

	/**
	 * Convert images from tremulous. 
	 * They are originally in .tga without alpha channel.
	 * The alpha channel is created based on the luminance of each pixel.
	 * alpha === luminance*4
	*/
	function convertTremulousImage(image, luminanceMult, callback){
		// create a canvas
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
				var luminance	= (0.2126*p[i+0]) + (0.7152*p[i+1]) + (0.0722*p[i+2]);
				p[i+3]		= luminance*luminanceMult;
			}
		}
		// put the generated image in the canvas
		ctx.putImageData(imgData, 0, 0);
		// produce a Image object based on canvas.toDataURL
		var newImage	= new Image;
		newImage.onload	= function(){
			// notify the caller
			callback(newImage, image);
		};
		newImage.src	= ctx.canvas.toDataURL();
	}

}