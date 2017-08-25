
module.exports = function(app,db,passport,mongojs){

	app.get('/categoria', function (req, res) {
		db.categorias.find(function(err,docs) {
			//console.log(docs);
			if (err) {
				console.log(err);
			}
			res.json(docs);
		});
	});

	app.delete('/categoria/:id', function (req, res) {
		var id = req.params.id;
		console.log('id: ' + id);
		db.categorias.remove({ _id : mongojs.ObjectId(id)}, function(err,doc){
			res.json(doc);
		});
	});

	var crearcategoria = function(reqbody){
		var start = new Date(reqbody.fechaDesde + '-01-01T03:00:00.000Z');
		var end = new Date(reqbody.fechaHasta + '-12-31T23:59:59.000Z');
		console.log(reqbody.fechaDesde +' - '+start);
		console.log(reqbody.fechaHasta +' - '+end);
		var uncategoria = {
			nombre			: reqbody.nombre,
			fechaDesde : start,
			fechaHasta : end
		};
		return uncategoria;
	}
	app.post('/categoria', function (req, res) {
		var categoria = crearcategoria(req.body);
		console.log(categoria);
		db.categorias.insert(categoria, function(err, doc){
			res.json(doc);
		});
	});

	app.put('/categoria/:id', function (req, res) {
		var id = req.params.id;
		//console.log(req.body);//Para que esto funcione es necesario tener el body-parser!!!
		var categoria = crearcategoria(req.body);
		console.log(categoria);
		db.categorias.findAndModify({
	    	query: {_id: mongojs.ObjectId(id)},
	    	update: {$set: categoria},
	    	new: true}, function (err, doc) {
			res.json(doc);
	    });
	});

	app.delete('/categoria/:id', function (req, res) {
		var id = req.params.id;
		console.log('catId: ' + id);
		db.categorias.remove({ _id : mongojs.ObjectId(id)}, function(err,doc){
			res.json(doc);
		});
	});

}