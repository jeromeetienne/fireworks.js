Fireworks.EffectBase	= function(emitter, opts)
{
	this.onCreate	= function(particle){
		particle.xBase	= {
			x	: 0,
			y	: 0,
			z	: 0,
			velocityX	: 0,
			velocityY	: 0,
			velocityZ	: 0
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xBase;
		ctx.x	= 0;
		ctx.y	= 0;
		ctx.z	= 0;
		//ctx.x	= window.innerWidth/2;
		//ctx.y	= window.innerHeight/2;
		var mult	= 0.01; 
		ctx.velocityX	= 2*(Math.random()-0.5) * mult;
		ctx.velocityY	= 2*(Math.random()-0.5) * mult;
		ctx.velocityZ	= 2*(Math.random()-0.5) * mult;
	}.bind(this);
	
	this.onUpdate	= function(particle){
		var ctx	= particle.xBase;
		ctx.x	+= ctx.velocityX;
		ctx.y	+= ctx.velocityY;
		ctx.z	+= ctx.velocityZ;
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.EffectBase.prototype = new Fireworks.Effect();
Fireworks.EffectBase.prototype.constructor = Fireworks.EffectBase;


