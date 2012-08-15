var assert = require('assert')
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
  , url = 'mongodb://localhost:27017/test'
  , connect_mongodb = require('..')
  , db = new Db('test', server_config, {});

describe('mongodb connect', function () {
  store = undefined;

  it('should set the session in mongo', function (done) {
    store.set('123', {cookie: {maxAge: 3000}, name: 'Sidney Crosby'}, function (err, ok) {
      assert.ok(!err, 'error on set');
      db.collection('sessions', function (err, col) {
        col.find().toArray(function (err, data) {
          assert.equal(data.length, 1)
          assert.equal(data[0]._id, 123)
          assert.equal(data[0]._id, 123)
          assert.deepEqual(data[0].session, { cookie: { maxAge: 3000 }, name: 'Sidney Crosby' });
          done();
        });
      });
    });
  });

  it('should get the session', function (done) {
    store.set('123', {cookie: {maxAge: 3000}, name: 'Sidney Crosby'}, function (err, ok) {
      store.get('123', function (err, data) {
        assert.ok(!err, 'error on get');
        assert.deepEqual({ cookie: { maxAge: 3000 }, name: 'Sidney Crosby' }, data);
        done();
      });
    });
  });

  it('should destroy a session', function (done) {
    store.set('123', {cookie: {maxAge: 3000}, name: 'Sidney Crosby'}, function (err, ok) {
      store.destroy('123', function (err, data) {
        assert.ok(!data, 'should not have this record')
        done();
      });
    });
  });

  it('should clear expired sessions', function (done) {
    store.set('123', {cookie: {}, name: 'Sidney Crosby'}, function (err, ok) {
      setTimeout(function () {
        store.get('123', function (err, data) {
          assert.ok(!data);
          done();
        });
      }, 1000)
    });
  });

  beforeEach(function(done) {
    db.open(function () {
      store = new connect_mongodb({db: db, reapInterval: 500, ttl: 250});
      done();
    });
  });

  afterEach(function(done) {
    db.close(done);
  });
});
