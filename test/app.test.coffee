app = require '../app'
#assert = require 'assert'
#zombie = require 'zombie'
#events = require 'events'
#testHelper = require './helper'

process.env.NODE_ENV = 'test'

module.exports = {
  # name can be anything..
  'Test POST /documents.json': (assert)->
    assert.response app,{
      url     : '/documents.json',
      method  : 'POST',
      data    : JSON.stringify {document : {title              : 'Test'}},
        headers : {'Content-Type'         : 'application/json'}
    },{
      status: 200,
      headers: {'Content-Type': 'application/json'}
    },
    (res)->
      document = JSON.parse res.body
      assert.equal 'Test', document.title
  }

app.listen 4001
