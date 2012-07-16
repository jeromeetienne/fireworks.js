Fireworks.Emitter.prototype.bindTriggerDomEvents	= function(domElement){
	var tmp	= new Fireworks.BindTriggerDomEvents(this, domElement);
	return this;	// for chained API
}

Fireworks.BindTriggerDomEvents	= function(emitter, domElement){
	this._domElement= domElement	|| document.body;

	// bind mouse event
	this._onMouseDown	= function(){
		emitter.spawner().start();
	};
	this._domElement.addEventListener('mousedown'	, this._onMouseDown	);
	this._onMouseUp	= function(){
		emitter.spawner().stop();
	};
	this._domElement.addEventListener('mouseup'	, this._onMouseUp	);
}


Fireworks.BindTriggerDomEvents.prototype.destroy	= function() {
	this._domElement.removeEventListener('mousedown', this._onMouseDown	);
	this._domElement.removeEventListener('mouseup'	, this._onMouseUp	);
};
