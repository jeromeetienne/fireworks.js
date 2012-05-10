/**
 * The emitter of particles
*/
Fireworks.Effect	= function(){
}

//Firefly.Effect.prototype.onCreate	= function(){
//}
//
//Firefly.Effect.prototype.onBirth	= function(){
//}
//
//Firefly.Effect.prototype.onUpdate	= function(){
//}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Effect.Base	= function(emitter)
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
		ctx.velocityX	= 2*(Math.random()-0.5) * 6;
		ctx.velocityY	= 2*(Math.random()-0.5) * 6;
		ctx.velocityZ	= 2*(Math.random()-0.5) * 6;
	}.bind(this);
	
	this.onUpdate	= function(particle){
//		console.log("onUpdate", particle)
		var ctx	= particle.xBase;
		ctx.x	+= ctx.velocityX;
		ctx.y	+= ctx.velocityY;
		ctx.z	+= ctx.velocityZ;
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.Base.prototype = new Fireworks.Effect();
Fireworks.Effect.Base.prototype.constructor = Fireworks.Effect.Base;


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Fireworks.Effect.Age	= function(emitter)
{
	this.onCreate	= function(particle){
		particle.xAge	= {
			curAge	: 0,
			maxAge	: 0
		};
	}.bind(this);

	this.onBirth	= function(particle){
		var ctx	= particle.xAge;
		ctx.curAge	= 0;
		ctx.maxAge	= 3*1000;
	}.bind(this);
	
	this.onUpdate	= function(particle, deltaTime){
		var ctx	= particle.xAge;
		ctx.curAge	+= deltaTime;
		if( ctx.curAge > ctx.maxAge )	emitter.killParticle(particle);
	}.bind(this);
}

// inherit from Fireworks.Effect
Fireworks.Effect.Age.prototype = new Fireworks.Effect();
Fireworks.Effect.Age.prototype.constructor = Fireworks.Effect.Age;
