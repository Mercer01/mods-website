var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:password@localhost:5432/puppies';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllMods: getAllMods,
  getSingleMod: getSingleMod,
  createMod: createMod,
  updateMod: updateMod,
  removeMod: removeMod
};

function getAllMods(req, res, next) {
	  db.any('select * from mods')
	    .then(function (data) {
	      res.status(200)
	        .json({
	          status: 'success',
	          data: data,
	          message: 'Retrieved ALL mods'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

function getSingleMod(req, res, next) {
	  var modID = parseInt(req.params.id);
	  db.one('select * from mods where id = $1', modID)
	    .then(function (data) {
	      res.status(200)
	        .json({
	          status: 'success',
	          data: data,
	          message: 'Retrieved ONE Mod'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

function createMod(req, res, next) {
	  req.body.age = parseInt(req.body.age);
	  db.none('insert into mod(name, breed, age, sex)' + //TODO Update
	      'values(${name}, ${breed}, ${age}, ${sex})',
	    req.body)
	    .then(function () {
	      res.status(200)
	        .json({
	          status: 'success',
	          message: 'Inserted one Mod'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

function updateMod(req, res, next) {
	  db.none('update mod set name=$1, breed=$2, age=$3, sex=$4 where id=$5', //TODO update
	    [req.body.name, req.body.breed, parseInt(req.body.age),
	      req.body.sex, parseInt(req.params.id)])
	    .then(function () {
	      res.status(200)
	        .json({
	          status: 'success',
	          message: 'Updated Mod'
	        });
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}

function removeMod(req, res, next) {
	  var modID = parseInt(req.params.id);
	  db.result('delete from mod where id = $1', modID)
	    .then(function (result) {
	      /* jshint ignore:start */
	      res.status(200)
	        .json({
	          status: 'success',
	          message: `Removed ${result.rowCount} Mod`
	        });
	      /* jshint ignore:end */
	    })
	    .catch(function (err) {
	      return next(err);
	    });
	}