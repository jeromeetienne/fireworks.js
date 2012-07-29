Fireworks.Emitter.prototype.bindTriggerDomEvents	= function(domElement){
	var tmp	= new Fireworks.BindTriggerDomEvents(this, domElement);
	return this;	// for chained API
}

Fireworks.BindTriggerDomEvents	= function(emitter, domElement){
	this._domElement= domElement	|| document.body;

	// bind mouse event
	this._onMouseDown	= function(){ emitter.effect('spawner').opts.start();	};
	this._onMouseUp		= function(){ emitter.effect('spawner').opts.stop();	};
	this._domElement.addEventListener('mousedown'	, this._onMouseDown	);
	this._domElement.addEventListener('mouseup'	, this._onMouseUp	);

	// change emitter intensity on mousewheel		
	this._onMouseWheel	= function(event){
		var intensity	= emitter.intensity();
		intensity	+= event.wheelDelta < 0 ? -0.05 : 0.05;
		intensity	= Math.max(intensity, 0);
		intensity	= Math.min(intensity, 1);
		emitter.intensity(intensity);
	};
	this._domElement.addEventListener('mousewheel'	, this._onMouseWheel	);
}


Fireworks.BindTriggerDomEvents.prototype.destroy	= function(){
	this._domElement.removeEventListener('mousedown'	, this._onMouseDown	);
	this._domElement.removeEventListener('mouseup'		, this._onMouseUp	);
	this._domElement.removeEventListener('mousewheel'	, this._onMouseWheel	);
};
