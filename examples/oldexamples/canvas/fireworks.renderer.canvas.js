/**
 * Shortcut to create Fireworks.Effect.Init2Shapes
*/
Fireworks.Emitter.prototype.pushRendererCanvas	= function(opts){
	var emitter	= this;
	emitter.effects().push(new Fireworks.Effect.RendererCanvas(emitter, opts));
	return this;	// for chained API
};


Fireworks.Effect.RendererCanvas	= function(emitter, opts)
{
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
	
	
	ctx.fillStyle	= 'rgba(0,0,0,1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.translate(window.innerWidth/2, window.innerHeight/2)


	this.onCreate	= function(particle, particleIdx){
		emitter.setParticleData(particle, 'xCanvas', {
			size	: 3
			// TODO it may contains color too
		});
	}.bind(this);

	this.onPreRender	= function(){
		// clear the screen
		ctx.save();
		ctx.globalAlpha = 0.025;
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
		ctx.restore();
		// set the fillStyle of the particles
		ctx.fillStyle	= 'rgba(127,0,255, 0.2)';
	}

	this.onRender	= function(particle){
		var position	= particle.xBase.position;
		var size	= particle.xCanvas.size;
		ctx.beginPath();
		ctx.arc(position.x, position.y, size, 0, Math.PI*2, true); 
		ctx.fill();			
	}
}

// inherit from Fireworks.Effect
Fireworks.Effect.RendererCanvas.prototype = new Fireworks.Effect();
Fireworks.Effect.RendererCanvas.prototype.constructor = Fireworks.Effect.RendererCanvas;
