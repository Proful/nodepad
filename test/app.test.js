(function() {
  var app;
  app = require('../app');
  process.env.NODE_ENV = 'test';
  module.exports = {
    'Test POST /documents.json': function(assert) {
      return assert.response(app, {
        url: '/documents.json',
        method: 'POST',
        data: JSON.stringify({
          document: {
            title: 'Test'
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }, function(res) {
        var document;
        document = JSON.parse(res.body);
        return assert.equal('Test', document.title);
      });
    }
  };
  app.listen(4001);
}).call(this);
