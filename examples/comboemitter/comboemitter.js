/**
 * base class for combo emitters. aka emitter composed of multiple
 * Fireworks.Emitter, sound etc...
*/
Fireworks.ComboEmitter	= function(){
};


//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * @return {boolean} true if it is ready, false otherwise
*/
Fireworks.ComboEmitter.prototype.isReady	= function(){
	// if all previous tests passed, it is ready
	return true;
};

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Start the emitter
*/
Fireworks.ComboEmitter.prototype.start	= function(){
	throw "not implemented";
};

/**
 * Ask to Stop the emitter. It is a gracefull stop, so the emitter may
 * keep emit for a while, the time 
*/
Fireworks.ComboEmitter.prototype.stop	= function(){
	throw "not implemented";
};

/**
 * Stop immediatly the emitter
*/
Fireworks.ComboEmitter.prototype.ungracefullStop	= function(){
	throw "not implemented";
};
