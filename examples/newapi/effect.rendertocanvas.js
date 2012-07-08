/**
 * render to canvas
*/
Fireworks.EffectsStackBuilder.prototype.renderToCanvas	= function(opts)
{	
	var emitter	= this._emitter;

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

	// clear canvas and center it
	ctx.fillStyle	= 'rgba(0,0,0,1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.translate(window.innerWidth/2, window.innerHeight/2)

	// create the effect itself
	Fireworks.createEffect('renderToCanvas')
	.onCreate(function(particle, particleIdx){
		particle.set('xCanvas', {
			size	: 3
			// TODO it may contains color too
		});
	}).onPreRender(function(){
		// clear the screen
		ctx.save();
		ctx.globalAlpha = 0.025;
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
		ctx.restore();
		// set the fillStyle of the particles
		ctx.fillStyle	= 'rgba(127,0,255, 0.2)';
	}).onRender(function(particle){
		var position	= particle.xBase.position;
		var size	= particle.get('xCanvas').size;

		ctx.beginPath();
		ctx.arc(position.x, position.y, size, 0, Math.PI*2, true); 
		ctx.fill();					
	}).pushTo(emitter);

	return this;	// for chained API
};
