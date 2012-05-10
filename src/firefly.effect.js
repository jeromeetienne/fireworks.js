/**
 * The emitter of particles
*/
FireFly.Effect	= function(){
}

//Firefly.Effect.prototype.onCreate	= function(){
//}
//
//Firefly.Effect.prototype.onBirth	= function(){
//}
//
//Firefly.Effect.prototype.onUpdate	= function(){
//}


FireFly.Effect.Base	= function()
{
	this.onCreate	= function(particle){
		console.log("onCreate", particle)
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
		console.log("onBirth", particle)
		var ctx	= particle.xBase;
		ctx.x	= 0;
		ctx.y	= 0;
		ctx.z	= 0;
		ctx.x	= window.innerWidth/2;
		ctx.y	= window.innerHeight/2;
		ctx.velocityX	= 2*(Math.random()-0.5) * 2;
		ctx.velocityY	= 2*(Math.random()-0.5) * 2;
		ctx.velocityZ	= 2*(Math.random()-0.5) * 2;
	}.bind(this);
	
	this.onUpdate	= function(particle){
		console.log("onUpdate", particle)
		var ctx	= particle.xBase;
		ctx.x	+= ctx.velocityX;
		ctx.y	+= ctx.velocityY;
		ctx.z	+= ctx.velocityZ;
	}.bind(this);
}

// inherit from FireFly.Effect
FireFly.Effect.Base.prototype = new FireFly.Effect();
FireFly.Effect.Base.prototype.constructor = FireFly.Effect.Base;
