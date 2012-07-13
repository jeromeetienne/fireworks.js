//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

var Ezgui	= function(){
	// create the container
	this._domElement= document.createElement('div');
	this._domElement.classList.add('ezgui')
	this._domElement.classList.add('ezgui')
	document.body.appendChild(this._domElement)
}


Ezgui.prototype.addFolder	= function(label){
	var folder	= new Ezgui.Folder(label)
	this._domElement.appendChild(folder.container());
	return folder;
}

Ezgui.prototype.container	= function(){
	return this._domElement;
}

//////////////////////////////////////////////////////////////////////////////////
//		Ezgui.Folder							//
//////////////////////////////////////////////////////////////////////////////////

Ezgui.Folder	= function(label){
	// sanity check
	console.assert( typeof(label) === 'string' );
	// create <table>
	this._tableEl	= document.createElement('table')

	// add <tbody> to this._tableEl
	this._tbodyEl	= document.createElement('tbody');
	this._tableEl.appendChild(this._tbodyEl);


	///////////////////////////////////////
	// Add the label
	
	// add <thead> with the label
	var theadEl	= document.createElement('thead');
	this._tableEl.appendChild(theadEl);
	// create <tr>
	var trEl	= document.createElement('tr');
	theadEl.appendChild(trEl);
	// create <td>
	var tdEl	= document.createElement('td');
	trEl.appendChild(tdEl);
	tdEl.innerText	= label;
	tdEl.colSpan	= '2';

	theadEl.addEventListener('click', function(){
		// get all <tr>
		var elements	= this._tableEl.querySelectorAll('tbody tr')
		// if there is no child, return now
		if( elements.length === 0 )	return;
		// toggle .style.display value
		var displayVal	= elements[0].style.display === 'none' ? '' : 'none';
		for(var i = 0; i < elements.length; i++ ){
			elements[i].style.display	= displayVal;
		}
	}.bind(this))


}

Ezgui.Folder.prototype.container	= function(){
	return this._tableEl;
}

/**
 * 
*/
Ezgui.Folder.prototype.add	= function(obj, property, opts){
	opts	= opts	|| {};
	// sanity check
	console.assert( typeof(obj) === 'object' );
	console.assert( typeof(property) === 'string' );

	// create <tr>
	var trEl	= document.createElement('tr');
	this._tbodyEl.appendChild(trEl);

	// create <td> for label
	var tdEl	= document.createElement('td');
	trEl.appendChild(tdEl);
	tdEl.innerText	= opts.label	|| property;

	// create <td> for input
	var tdEl	= document.createElement('td');
	trEl.appendChild(tdEl);
	
	for(var i = 0; i < Ezgui.Handlers.length; i++){
		var handler	= Ezgui.Handlers[i];
		if( !handler.canBuild(obj, property) )	continue;
		var inputEl	= handler.doBuild(tdEl, obj, property, opts)
		break;
	}
	console.assert( i !== Ezgui.Handlers.length );
	
	return inputEl;
}


//////////////////////////////////////////////////////////////////////////////////
//		Ezgui.Handlers							//
//////////////////////////////////////////////////////////////////////////////////

Ezgui.Handlers	= [];


Ezgui.Handlers.push({
	name	: "handlerNumber",
	canBuild: function(obj, property, opts){
		return typeof(obj[property]) === 'number' ? true : false;
	},
	doBuild	: function(tdEl, obj, property, opts){
		var inputEl	= document.createElement('input');
		tdEl.appendChild(inputEl);
		inputEl.type	= 'range';	
		inputEl.value	= obj[property];
		return inputEl;
	}
});

Ezgui.Handlers.push({
	name	: "handlerString",
	canBuild: function(obj, property, opts){
		return typeof(obj[property]) === 'string' ? true : false;
	},
	doBuild	: function(tdEl, obj, property, opts){
		var inputEl	= document.createElement('input');
		tdEl.appendChild(inputEl);
		inputEl.type	= 'text';	
		inputEl.value	= obj[property];
		return inputEl;
	}
});

