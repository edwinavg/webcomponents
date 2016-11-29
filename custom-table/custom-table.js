
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
				i 						= 0;

		for(; dataLen > i; i++){
			tbody.appendChild(getRow(properties ,data[i]));
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
			properties: properties
		};

		_self.appendChild(thead);
		_self.appendChild(tbody);
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
		init:component.init
	}

})();
