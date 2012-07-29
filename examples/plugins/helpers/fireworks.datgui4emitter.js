Fireworks.DatGui4Emitter	= function(emitter){
	var gui		= new dat.GUI();
	var effects	= emitter.effects();
	effects.forEach(function(effect, idx){
		var effectName	= effect.name	|| "effect-"+idx;
		var opts	= effect.opts	|| {};
		var keys	= Object.keys(opts).filter(function(key){
			if( opts[key] instanceof Fireworks.Vector )	return true;
			if( typeof(opts[key]) === 'object' )		return false;
			return true;
		});
		if( keys.length ){
			var folder	= gui.addFolder('Effect: '+effectName);
			keys.forEach(function(key){
				if( opts[key] instanceof Fireworks.Vector ){
					folder.add(opts[key], 'x').name(key+"X");
					folder.add(opts[key], 'y').name(key+"Y");
					folder.add(opts[key], 'z').name(key+"Z");
				}else{
					folder.add(opts, key);
				}
			});
		}
	});
	// return the built gui
	return gui;
};