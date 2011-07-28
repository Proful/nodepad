mongoose = require('mongoose')
#db       = mongoose.connect('mongodb://localhost/nodepad')
Schema   = mongoose.Schema
ObjectId = Schema.ObjectId

# Models are defined through the Schema interface
documentSchema = new Schema {
  'user_id' : ObjectId,
  'title'   : {type     : String,index : true},
  'data'    : String,
  'tags'    : [String]
}
exports.Document = mongoose.model 'Document',documentSchema
# defining Document as model
# not sure this is required or not
# not sure whether I need to use export or not
#mongoose.model 'Document',Document
#exports.Document = mongoose.model 'Document'
###
mongoose.model('Document', {
  properties: ['title','data','tags'],

  indexes: [ 'title']
})
exports.Document = (db)->
  db.model('Document')
###
