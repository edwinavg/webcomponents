
var customTable = (function(){
	var component = Object.create(HTMLTableElement.prototype),
			items = {};
	 /**
   * @memberof customTable#
   * @name getHeader
   * @description Genera la cebecera de la tabla
   **/
	function getHeader(template){
		var thead = document.createElement('thead'),
				len   = template.length,
				i 	  = 0,
				tr    = document.createElement('tr'),
				th    = {};


		for(;len > i; i++){
			th = document.createElement('th');
			th.textContent = template[i].value;
			tr.appendChild(th);
		}

		thead.appendChild(tr);

		return thead;
	};
		/**
   * @memberof customTable#
   * @name getRow
   * @description Genera la fila con los datos
   **/
	function getRow(properties,rowData){
		var propertiesLen = properties.length,
				i 						= 0,
				cell 					= {},
				row 					= document.createElement('tr');

		for(; propertiesLen > i; i++){
			if(rowData[properties[i]] !== undefined){
				cell = document.createElement('td');
				cell.textContent = rowData[properties[i]];
				row.setAttribute('data-row',JSON.stringify(rowData));
				row.appendChild(cell);
			}
		}

		return row;
	};

	 /**
   * @memberof customTable#
   * @name getBody
   * @description Genera la el cuerpo de la tabla
   **/
	function getBody(properties, data){
		var tbody 				= document.createElement('tbody'),
				dataLen  			= data.length,
				i 						= 0,
				emptyRow      = document.createElement('tr');

		for(; dataLen > i; i++){
			tbody.appendChild(getRow(properties ,data[i]));
		}

		if(dataLen === 0){
			emptyRow.setAttribute('colspan', properties.length);
			emptyRow.textContent = 'No data found';
			tbody.appendChild(emptyRow);
		}

		return tbody;
	};

	 /**
   * @memberof customTable#
   * @name getProperties
   * @description Obtiene el listado de propiedades que se van a obtener del JSON
   **/
	function getProperties(template){
		var properties = [],
				i			 		 = 0,
				len 			 = template.length;

		for(;len > i;i++){
			properties.push(template[i].key);
		}

		return properties;
	};

		 /**
   * @memberof customTable#
   * @name selectable
   * @description Selecciona visualmente la fila de la tabla
   **/
	function selectable(event){
		var rows = this.parentNode.getElementsByTagName('tr'),
				len = rows.length,
				i=0;

		if(this.classList.contains('selected-row')){
			this.classList.remove('selected-row');
		}else{

			for(; len > i; i++){
				rows[i].classList.remove('selected-row');
			}

			this.classList.add('selected-row');
		}
	};

	 /**
   * @memberof customTable#
   * @name addListeners
   * @description Añade los eventos a la tabla
   **/
	function addListeners(idTable){
		var rows = document.getElementById(idTable).getElementsByTagName('tbody')[0].getElementsByTagName('tr'),
				len = rows.length,
				i=0;

		if(items[idTable].selectable){
			document.getElementById(idTable).classList.add('selectable');

			for(; len > i; i++){
				rows[i].addEventListener('click',selectable);
			}
		}

	};

	/**
   * @memberof customTable#
   * @name updateTable
   * @description Actualiza los datos de la tabla
   **/
	component.updateTable = function(idTable, data){
		var table 		= document.getElementById(idTable),
				tempTbody = getBody(items[idTable].properties ,data),
				tbody 		= table.getElementsByTagName('tbody')[0];


		items[idTable].data = JSON.parse(JSON.stringify(data));
		table.setAttribute('data',JSON.stringify(data));
		tbody.parentNode.removeChild(tbody); //IE FIX
		table.appendChild(tempTbody);

		addListeners(idTable);
	};

	/**
   * @memberof customTable#
   * @name getSelectedRow
   * @description Devuelve la fila seleccionada
   **/
	component.getSelectedRow = function(idTable){
		var selected = document.getElementById(idTable).getElementsByClassName('selected-row')[0],
				datos = false;

		if(selected){
			datos = JSON.parse(selected.getAttribute('data-row'));
		}

		return datos;
	};

	/**
   * @memberof customTable#
   * @name getTable
   * @description Devuelve los datos de la tabla
   **/
	component.getTable = function(idTable){
		var data = false;

		if(items[idTable] !== undefined){
			data = items[idTable];
		}

		return data;
	};

	/**
   * @memberof customTable#
   * @name getContext
   * @description Devuelve todas las tablas creadas
   **/
	component.getContext = function(){
		return items;
	}

	/**
   * @memberof customTable#
   * @name createdCallback
   * @description Genera la tabla
   **/
	component.createdCallback = function(){
		var _self      = this,
				data 	     = JSON.parse(_self.getAttribute('data').replace(new RegExp("'", 'g'), '"')),
				header     = JSON.parse(_self.getAttribute('header').replace(new RegExp("'", 'g'), '"')),
				properties = getProperties(header.template),
				thead      = getHeader(header.template),
				tbody      = getBody(properties,data);

		this.id= this.id ? this.id : "custom-table-" + new Date().getTime();

		items[this.id] = {
			data:data,
			properties: properties,
			selectable: header.selectable ? header.selectable : false
		};

		_self.appendChild(thead);
		_self.appendChild(tbody);

		addListeners(this.id);
	};

	/**
   * @memberof customTable#
   * @name createdCallback
   * @description Inicializa el componente
   **/
	component.init = function(config) {
		document.registerElement('custom-table',{
			prototype:component,
			extends:'table'
		});
	}

	return {
		getTable:component.getTable,
		getContext:component.getContext,
		updateTable:component.updateTable,
		getSelectedRow:component.getSelectedRow,
		init:component.init
	}

})();
