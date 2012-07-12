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
	
	
	if( opts.type === 'arc' ){
		effect.onCreate(function(particle, particleIdx){
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
		})
	}else{
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
};
