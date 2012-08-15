var assert = require('assert')
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
  , url = 'mongodb://localhost:27017/test'
  , connect_mongodb = require('..')
  , db = new Db('test', server_config, {});

db.open(function () {
  store = new connect_mongodb({db: db})

  store.set('123', {cookie: {maxAge: 3000}, name: 'nathan'}, function (err, ok) {
    assert.ok(!err, 'error on set');

    store.get('123', function (err, data) {
      assert.ok(!err, 'error on get');
      assert.deepEqual({ cookie: { maxAge: 3000 }, name: 'nathan' }, data);
      store.destroy('123', function(){
        store.get('123', function (err, data) {
          assert.ok(!data, 'should not have this record')
          console.log('Done!')
          db.close()
        });
      });
    });
  });
});
