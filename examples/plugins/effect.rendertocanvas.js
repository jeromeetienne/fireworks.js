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
			particle.set('renderToCanvas', {
				size	: 3
				// TODO it may contains color too
			});
		}).onRender(function(particle){
			var position	= particle.get('position').vector;
			var size	= particle.get('renderToCanvas').size;

			ctx.beginPath();
			ctx.arc(position.x, position.y, size, 0, Math.PI*2, true); 
			ctx.fill();					
		});
	};
	function ctorTypeDrawImage(){
		// handle parameter polymorphism
		if( typeof(opts.image) === 'string' ){
			var image	= new Image;
			image.src	= opts.image;
		}else if( opts.image instanceof Image ){
			var image	= opts.image;
		}else	console.assert('invalid .renderToCanvas() options')

		return effect.onCreate(function(particle, particleIdx){
			particle.set('renderToCanvas', {
				size	: 3
				// TODO it may contains color too
			});
		}).onRender(function(particle){
			var position	= particle.get('position').vector;
			var size	= particle.get('renderToCanvas').size;
			
			var width	= image.width	* size;
			var height	= image.height	* size;
			var positionX	= position.x - width /2;
			var positionY	= position.y - height/2; 
			
			
		
		ctx.save(); 
		
		// move to where the particle should be
		c.translate(this.posX, this.posY);
		
		// scale it dependent on the size of the particle
		c.scale(width, height);
		
		// and rotate
		c.rotate(this.rotation * TO_RADIANS);
						
		// move the draw position to the center of the image
		c.translate(img.width*-0.5, img.width*-0.5);
		
		// set the alpha to the particle's alpha
		c.globalAlpha = this.alpha; 
		
		// set the composition mode
		c.globalCompositeOperation = this.compositeOperation;
				
		// and draw it! 
		c.drawImage(img,0,0);
		
		// and restore the canvas state
		c.restore();
			ctx.drawImage(image, positionX, positionY, width, height);
		});
	};
	function ctorTypeDrawImage(){
		// handle parameter polymorphism
		if( typeof(opts.image) === 'string' ){
			var image	= new Image;
			image.src	= opts.image;
		}else if( opts.image instanceof Image ){
			var image	= opts.image;
		}else	console.assert('invalid .renderToCanvas() options')

		return effect.onCreate(function(particle, particleIdx){
			particle.set('renderToCanvas', {
				scale		: 3,	// should that be there ? or in its own effect ?
				opacity		: 1,
				rotation	: 0*Math.PI,
				globalComposite	: 'source-over'
			});
		}).onRender(function(particle){
			var position	= particle.get('position').vector;
			var data	= particle.get('renderToCanvas');
			// save the context
			ctx.save();
			// translate in canvas's center, and the particle position
			ctx.translate(position.x + canvas.width/2, position.y + canvas.height/2);
			// set the scale of this particles
			ctx.scale(data.scale, data.scale);
			// set the rotation
			ctx.rotate(data.rotation)
			// draw the image itself
			ctx.drawImage(image, -image.width/2, -image.height/2);
			// restore the context
			ctx.restore();
		});
	};
};
