(function() {
  var ObjectId, Schema, documentSchema, mongoose;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
  documentSchema = new Schema({
    'user_id': ObjectId,
    'title': {
      type: String,
      index: true
    },
    'data': String,
    'tags': [String]
  });
  exports.Document = mongoose.model('Document', documentSchema);
  /*
  mongoose.model('Document', {
    properties: ['title','data','tags'],
  
    indexes: [ 'title']
  })
  exports.Document = (db)->
    db.model('Document')
  */
}).call(this);
