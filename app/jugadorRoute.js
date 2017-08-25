
module.exports = function(app,db,passport,mongojs){
	//Para utilizar el modelo

	/*app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});*/

	app.get('/jugador', function (req, res) {
		db.jugadores.find().sort({_id:-1},function(err,docs) {
			//console.log(docs);
			if (err) {
				console.log(err);
			}
			res.json(docs);
		});
	});

	app.delete('/jugador/:id', function (req, res) {
		var id = req.params.id;
		db.jugadores.remove({ _id : mongojs.ObjectId(id)}, function(err,doc){
			res.json(doc);
		});
	});

	app.get('/jugador/:id', function (req, res) {
		var id = req.params.id;
		db.jugadores.findOne({ _id : mongojs.ObjectId(id)}, function(err,doc){
			res.json(doc);
		});
	});


	app.get('/jugador/:fechaDesde/:fechaHasta', function (req, res) {
		var fechaDesde = new Date(req.params.fechaDesde);
		var fechaHasta = new Date(req.params.fechaHasta);
		console.log('Desde: ' + fechaDesde + ', Hasta: ' + fechaHasta);
		db.jugadores.find({ fechaNacimiento : {$gte: fechaDesde, $lt: fechaHasta} }, function(err,doc){
			if (err) {
				console.log(err);
			}
			res.json(doc);
		});
	});

	app.get('/jugadorByYear/:year', function (req, res) {
		var year = req.params.year;
		var yearEnd = parseInt(year) + 2;
		//new Date('1991-01-01 00:00:00.000Z')
		var start = new Date(year + '-01-01 00:00:00.000Z');
		var end = new Date(yearEnd + '-01-01 00:00:00.000Z');
		console.log('jugadorByYear - from: ' + year + ', to: ' + yearEnd); 
		db.jugadores.find({ fechaNacimiento : {$gte: start, $lt: end} }, function(err,doc){
			res.json(doc);
		});
	});

	app.get('/plantelSuperior/:year', function (req, res) {
		var year = req.params.year;
		var start = new Date(year + '-01-01 00:00:00.000Z');
		console.log('plantelSuperior - start: ' + start);
		db.jugadores.find({ fechaNacimiento : {$lt: start} }, function(err,doc){
			res.json(doc);
		});
	});


	var crearJugador = function(reqbody){
		var unJugador = {
			nombre			: reqbody.nombre,
			apellido		: reqbody.apellido,
			apodo			: reqbody.apodo,
			cedula			: reqbody.cedula,
			email			: reqbody.email,
			telefono		: reqbody.telefono,
			imagen				: 'photo_missing.png',
			fechaNacimiento		: new Date(reqbody.fechaNacimiento),
			fechaVencimientoFM	: new Date(reqbody.fechaVencimientoFM),
			fechaCreado			: new Date(),
			medidas : [],
			historiaMedica : [],
			posicion : reqbody.posicion,
			socio			: reqbody.socio
		};
		if(reqbody.direccion != undefined){
			unJugador.direccion = {
				ciudad : reqbody.direccion.ciudad,
				calle : reqbody.direccion.calle,
				numero : reqbody.direccion.numero,
				apto : reqbody.direccion.apto
			};
		}
		return unJugador;
	}

	var editJugador = function(reqbody){
		var unJugador = {
			nombre			: reqbody.nombre,
			apellido		: reqbody.apellido,
			apodo			: reqbody.apodo,
			cedula			: reqbody.cedula,
			email			: reqbody.email,
			telefono		: reqbody.telefono,
			imagen				: reqbody.imagen,
			fechaNacimiento		: new Date(reqbody.fechaNacimiento),
			fechaVencimientoFM	: new Date(reqbody.fechaVencimientoFM),
			fechaCreado			: reqbody.fechaCreado,
			medidas : reqbody.medidas,
			historiaMedica : reqbody.historiaMedica,
			posicion : reqbody.posicion,
			socio			: reqbody.socio
		};
		if(reqbody.direccion != undefined){
			unJugador.direccion = {
				ciudad : reqbody.direccion.ciudad,
				calle : reqbody.direccion.calle,
				numero : reqbody.direccion.numero,
				apto : reqbody.direccion.apto
			};
		}
		return unJugador;
	}
	app.post('/jugador', function (req, res) {
		var jugador = crearJugador(req.body);
		db.jugadores.insert(jugador, function(err, doc){
			res.json(doc);
		});
	});

	app.put('/jugador/:id', function (req, res) {
		var id = req.params.id;
		//console.log(req.body);//Para que esto funcione es necesario tener el body-parser!!!
		var jugador = editJugador(req.body);
		db.jugadores.findAndModify({
	    	query: {_id: mongojs.ObjectId(id)},
	    	update: {$set: jugador},
	    	new: true}, function (err, doc) {
			res.json(doc);
	    });
	});

	app.get('/jugadorSocios', function (req, res) {
		db.jugadores.find({ socio : true }, function(err,doc){
			if (err) {
				console.log(err);
			}
			res.json(doc);
		});
	});

}