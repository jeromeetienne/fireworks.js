/**
 * render to canvas
*/
Fireworks.EffectsStackBuilder.prototype.renderToCanvas	= function(opts)
{
	opts	= opts		|| {};
	var ctx	= opts.ctx	|| buildDefaultContext();
	// create the effect itself
	var effect	= Fireworks.createEffect('renderToCanvas', {
		ctx	: ctx
	}).pushTo(this._emitter);


	if( opts.type === 'arc' )		ctorTypeArc(effect);
	else if( opts.type === 'drawImage' )	ctorTypeDrawImage(effect);
	else{
		console.assert(false, 'renderToCanvas opts.type is invalid: ');
	}

	return this;	// for chained API
	

	function buildDefaultContext(){
		// build canvas element
		var canvas	= document.createElement('canvas');
		canvas.width	= window.innerWidth;
		canvas.height	= window.innerHeight;
		document.body.appendChild(canvas);
		// canvas.style
		canvas.style.position	= "absolute";
		canvas.style.left	= 0;
		canvas.style.top	= 0;
		// setup ctx
		var ctx		= canvas.getContext('2d');
		// return ctx
		return ctx;
	}

	function ctorTypeArc(){
		return effect.onCreate(function(particle, particleIdx){
			particle.renderToCanvas = {
				size	: 3
			};
		}).onRender(function(particle){
			var position	= particle.position.vector;
			var size	= particle.renderToCanvas.size;

			ctx.beginPath();
			ctx.arc(position.x + canvas.width /2, 
				position.y + canvas.height/2, size, 0, Math.PI*2, true); 
			ctx.fill();					
		});
	};
	function ctorTypeDrawImage(){
		// handle parameter polymorphism
		if( typeof(opts.image) === 'string' ){
			var images	= [new Image];
			images[0].src	= opts.image;
		}else if( opts.image instanceof Image ){
			var images	= [opts.image];
		}else if( opts.image instanceof Array ){
			var images	= opts.image;
		}else	console.assert(false, 'invalid .renderToCanvas() options')

		return effect.onCreate(function(particle, particleIdx){
			particle.renderToCanvas = {
				scale		: 1,	// should that be there ? or in its own effect ?
				opacity		: 1,	// should that be there ? or in its own effect ?
				rotation	: 0*Math.PI
			};
		}).onRender(function(particle){
			var position	= particle.position.vector;
			var data	= particle.renderToCanvas;
			var canonAge	= particle.lifeTime.normalizedAge();
			var imageIdx	= Math.floor(canonAge * images.length);
			var image	= images[imageIdx];
			// save the context
			ctx.save();
			// translate in canvas's center, and the particle position
			ctx.translate(position.x + canvas.width/2, position.y + canvas.height/2);
			// set the scale of this particles
			ctx.scale(data.scale, data.scale);
			// set the rotation
			ctx.rotate(data.rotation);
			// set ctx.globalAlpha
			ctx.globalAlpha	= data.opacity; 
			// draw the image itself
			if( image instanceof Image ){
				ctx.drawImage(image, -image.width/2, -image.height/2);			
			}else if( typeof(image) === 'object' ){
				ctx.drawImage(image.image
				 	,  image.offsetX,  image.offsetY , image.width, image.height
					, -image.width/2, -image.height/2, image.width, image.height);
			}else	console.assert(false);
			// restore the context
			ctx.restore();
		});
	};
};
