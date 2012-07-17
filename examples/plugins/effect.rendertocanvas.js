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
			ctx.drawImage(image, positionX, positionY, width, height);
		});
	};
};
