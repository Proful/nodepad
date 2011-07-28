(function() {
  var Document, app, db, express, mongoose, sys;
  express = require("express");
  mongoose = require("mongoose");
  db = mongoose.connect('mongodb://localhost/nodepad');
  Document = require("./models.js").Document;
  sys = require("sys");
  app = module.exports = express.createServer();
  app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
  });
  app.configure("development", function() {
    app.use(express.logger());
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure("test", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure("production", function() {
    app.use(express.logger());
    return app.use(express.errorHandler());
  });
  app.get("/", function(req, res) {
    return res.render("index");
  });
  app.get("/documents.:format?", function(req, res) {
    console.log("/documents list page");
    sys.debug("Inside listing documents");
    return Document.find({}, function(err, documents) {
      sys.debug("find successfull" + sys.inspect(documents));
      switch (req.params.format) {
        case 'json':
          return res.send(documents.map(function(d) {
            return d.__doc;
          }));
        default:
          sys.debug("Before rendering page...");
          return res.render('documents/index.jade', {
            locals: {
              documents: documents
            }
          });
      }
    });
  });
  app.post("/documents.:format?", function(req, res) {
    var document;
    console.log("new document needs to be created");
    document = new Document(req.body['document']);
    return document.save(function() {
      switch (req.params.format) {
        case 'json':
          return res.send(document.__doc);
        default:
          return res.redirect('/documents');
      }
    });
  });
  /*
  app.get "/documents/:id.:format?", (req,res) ->
    console.log "show one document"
  
  app.put "/documents/:id.:format?", (req,res) ->
    console.log "updating one document"
  
  app.del "/documents/:id.:format?", (req,res) ->
    console.log "deleting a particular document"
  
  app.get "/documents/:id.:format?/edit", (req,res) ->
    console.log "Editing the post"
    Document.findById req.params.id, (d)->
      res.render 'documents/edit.jade',{locals:{d:d}}
  */
  app.get("/documents/new", function(req, res) {
    return res.render("documents/new.jade", {
      locals: {
        d: new Document()
      }
    });
  });
  process.on("uncaughtException", function(err) {
    return console.log(err);
  });
  app.error(function(err, req, res, next) {
    sys.puts("APP.ERROR:" + sys.inspect(err));
    return next(err);
  });
  app.listen(4002);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}).call(this);
