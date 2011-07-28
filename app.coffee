express   = require("express")
mongoose  = require("mongoose")
db        = mongoose.connect('mongodb://localhost/nodepad')
#Document = mongoose.model 'Document'
Document  = require("./models.js").Document
sys       = require "sys"

app = module.exports = express.createServer()

app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", ->
  app.use express.logger()
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "test", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )
  #db = mongoose.connect 'mongodb://localhost/nodepad-test'
  #Document = require("./models").Document(db)

app.configure "production", ->
  app.use express.logger()
  app.use express.errorHandler()

app.get "/", (req, res) ->
  res.render "index"

app.get "/documents.:format?", (req,res) ->
  console.log "/documents list page"
  sys.debug "Inside listing documents"
  Document.find {},(err,documents) ->
    sys.debug "find successfull" + sys.inspect documents
    switch req.params.format
      when 'json' then res.send documents.map((d)->d.__doc)
      # Render the default jade based template. This will send the html output
      # passing the documents variable
      # not sure about the locals here..
      else 
        sys.debug "Before rendering page..."
        res.render 'documents/index.jade', {locals: {documents: documents}}

app.post "/documents.:format?", (req,res) ->
  console.log "new document needs to be created"
  document = new Document req.body['document']
  document.save ()->
    switch req.params.format
      when 'json' then res.send document.__doc
      else res.redirect '/documents'

###
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
###
app.get "/documents/new", (req,res) ->
  res.render "documents/new.jade", {locals: {d: new Document()}}
  #res.render "documents/new"

process.on "uncaughtException", (err) ->
  console.log err

app.error (err,req,res,next) ->
  sys.puts "APP.ERROR:" + sys.inspect(err)
  next(err)

app.listen 4002
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
