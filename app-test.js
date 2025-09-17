// app-test.js (updated)
const mongoose = require('mongoose');
const appModule = require('./app'); // could be app or { app, connectDb, mongoose }
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

// determine exports from ./app
// support both: module.exports = app;
// and module.exports = { app, connectDb, mongoose }
const app = (appModule && appModule.app) ? appModule.app : appModule;
const connectDb = (appModule && typeof appModule.connectDb === 'function') ? appModule.connectDb : null;

let serverInstanceForClose = null; // if we need to start/close a real server

// debug helpers: show unhandled rejections / exceptions in CI logs
process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION at:', p, 'reason:', reason);
});
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION thrown:', err);
});

before(async function() {
  // give extra time to connect to DB
  this.timeout(20000);

  // If tests run in an environment where MONGO_URI is set and app provides connectDb(), use it.
  // Otherwise, if connectDb is missing but MONGO_URI exists, connect here with mongoose.
  if (connectDb) {
    try {
      await connectDb();
    } catch (err) {
      console.error('connectDb() failed:', err);
      throw err;
    }
  } else if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        // minimal options; driver 4+ does not need useNewUrlParser/useUnifiedTopology
      });
      console.log('mongoose connected from test bootstrap');
    } catch (err) {
      console.error('mongoose.connect() failed in tests:', err);
      throw err;
    }
  } else {
    // no DB configured — tests may still run against in-memory or mocked data
    console.warn('MONGO_URI not set and app.connectDb not available. Tests will run without DB connection.');
  }

  // If app is not an Express app instance but a server start is required, you could start it here.
  // However chai.request accepts an Express app directly, so we don't start a listener.
  // If your code requires a running server (not Express app), start it and assign to serverInstanceForClose.
  // Example:
  // if (typeof app.listen === 'function') {
  //   serverInstanceForClose = app.listen(3001);
  // }
});

after(async function() {
  this.timeout(10000);

  // Close HTTP server if we started one
  if (serverInstanceForClose && typeof serverInstanceForClose.close === 'function') {
    await new Promise((resolve) => serverInstanceForClose.close(resolve));
  }

  // Close mongoose connection if open
  try {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      // optional: don't drop DB in CI if you rely on persistent test DB; comment if undesired
      // await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('Mongoose connection closed after tests');
    }
  } catch (err) {
    console.error('Error while closing mongoose connection:', err);
  }
});

// --------------------
// Your existing tests (unchanged) — only changed top-level setup/teardown above
// --------------------

describe('Planets API Suite', () => {

    describe('Fetching Planet Details', () => {
        it('it should fetch a planet named Mercury', (done) => {
            let payload = { id: 1 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                done();
              });
        });

        it('it should fetch a planet named Venus', (done) => {
            let payload = { id: 2 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                done();
              });
        });

        it('it should fetch a planet named Earth', (done) => {
            let payload = { id: 3 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                done();
              });
        });
        it('it should fetch a planet named Mars', (done) => {
            let payload = { id: 4 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                done();
              });
        });

        it('it should fetch a planet named Jupiter', (done) => {
            let payload = { id: 5 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                done();
              });
        });

        it('it should fetch a planet named Satrun', (done) => {
            let payload = { id: 6 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn');
                done();
              });
        });

        it('it should fetch a planet named Uranus', (done) => {
            let payload = { id: 7 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                done();
              });
        });

        it('it should fetch a planet named Neptune', (done) => {
            let payload = { id: 8 };
            chai.request(app)
              .post('/planet')
              .send(payload)
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                done();
              });
        });

    });        
});

//Use below test case to achieve coverage
describe('Testing Other Endpoints', () => {

    describe('it should fetch OS Details', () => {
        it('it should fetch OS details', (done) => {
          chai.request(app)
              .get('/os')
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                done();
              });
        });
    });

    describe('it should fetch Live Status', () => {
        it('it checks Liveness endpoint', (done) => {
          chai.request(app)
              .get('/live')
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('live');
                done();
              });
        });
    });

    describe('it should fetch Ready Status', () => {
        it('it checks Readiness endpoint', (done) => {
          chai.request(app)
              .get('/ready')
              .end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.property('status').eql('ready');
                done();
              });
        });
    });

});

