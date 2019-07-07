var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

var app = express();

//View Engine
app.set('views'), path.join(__dirname, 'views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '123'));
var session = driver.session();

var query1 = 'MATCH (n:Lema) RETURN n';
var query2 = 'MATCH (n)--(m:Definicion) WITH n, m, rand() AS r WHERE n.idLema IS NOT NULL RETURN n.palabra AS Palabra, m.enunciadoDef AS Definicion ORDER BY r LIMIT 1';
app.get('/', function(req, res) {
  var busqueda = "";
  session
    .run(query1)
    .then(function(result) {
      var arrayLemas = [];
      result.records.forEach(function(record) {
        arrayLemas.push({
          id: record._fields[0].identity.low,
          idLema: record._fields[0].properties.idLema,
          palabra: record._fields[0].properties.palabra
        });
      });


      session
        .run(query2)
        .then(function(result2) {
          var arrayDef = [];
          result2.records.forEach(function(record) {
            arrayDef.push({
              palabra: record._fields[0],
              definicion: record._fields[1]
            });
          });
          res.render('index', {
            lemas: arrayLemas,
            definiciones: arrayDef,
            busq: busqueda
          });
        })
        .catch(function(err) {
          console.log(err);
        });
      // res.render('index', {
      //   lemas: arrayLemas
      // });
    })
    .catch(function(err) {
      console.log(err);
    });
});

var query3 = 'MATCH (n:Lema) WITH count(n) AS newID MERGE (:Lema{idLema:newID,palabra:{palabraParam}})';
app.post('/lema/add', function(req, res) {
  var nuevoLema = req.body.nuevo_lema;

  session
    .run(query3, {
      palabraParam: nuevoLema
    })
    .then(function(result) {
      res.redirect('/');
      session.close();
    })
    .catch(function(err) {
      console.log(err);
    });
  res.redirect('/');
});

var query4 = 'MATCH (n)--(m:Definicion) WHERE n.palabra = {palabraParam} RETURN n.palabra AS Palabra, m.enunciadoDef AS Definicion';

app.get('/search', function(req, res) {
  var busqueda = req.query.buscar_def;

  session
    .run(query4, {
      palabraParam: busqueda
    })
    .then(function(result) {
      var arrayDef = [];
      //console.log(result.summary.profile);
      result.records.forEach(function(record) {
        arrayDef.push({
          palabra: record._fields[0],
          definicion: record._fields[1]
        });
      });

      //console.log(arrayDef);
      res.render('index', {
        definiciones: arrayDef,
        busq: busqueda
      });
    })
    .catch(function(err) {
      console.log(err);
    });

});

app.listen(3000);
console.log('Server started on port 3000');

module.export = app;
