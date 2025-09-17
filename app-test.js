// app-test.js (seeded + robust)
const mongoose = require('mongoose');
const appModule = require('./app'); // could be app or { app, connectDb, mongoose }
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

// determine exports from ./app
const app = (appModule && appModule.app) ? appModule.app : appModule;
const connectDb = (appModule && typeof appModule.connectDb === 'function') ? appModule.connectDb : null;

// set up a schema/model locally using the same collection name 'planets'
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});
let PlanetsModel; // will be initialized after connection

// seed data (IDs and names must match tests)
const seedPlanets = [
  { id: 1, name: 'Mercury', description: 'Mercury desc' },
  { id: 2, name: 'Venus', description: 'Venus desc' },
  { id: 3, name: 'Earth', description: 'Earth desc' },
  { id: 4, name: 'Mars', description: 'Mars desc' },
  { id: 5, name: 'Jupiter', description: 'Jupiter desc' },
  { id: 6, name: 'Saturn', description: 'Saturn desc' },
  { id: 7, name: 'Uranus', description: 'Uranus desc' },
  { id: 8, name: 'Neptune', description: 'Neptune desc' }
];

process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION at:', p, 'reason:', reason);
});
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION thrown:', err);
});

before(async function() {
  this.timeout(20000);

  // 1) Connect DB
  if (connectDb) {
    // app provides connectDb() helper
    await connectDb();
  } else if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
  } else {
    // No DB - tests will likely fail; warn and continue
    console.warn('MONGO_URI not provided and app.connectDb not available. Tests may fail.');
    return;
  }

  // 2) Initialize model on the active mongoose connection
  // if model already registered reuse it to avoid OverwriteModelError
  PlanetsModel = mongoose.models.planets || mongoose.model('planets', dataSchema);

  // 3) Clean + seed data
  try {
    await PlanetsModel.deleteMany({});
    await PlanetsModel.insertMany(seedPlanets);
    console.log('Seeded planets collection with', seedPlanets.length, 'documents');
  } catch (err) {
    console.error('Error seeding planets collection:', err);
    throw err;
  }
});

after(async function() {
  this.timeout(10000);

  // cleanup DB and close connection (so mocha exits cleanly)
  try {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      // drop test DB so next run starts clean
      try { await mongoose.connection.dropDatabase(); } catch (e) { /* ignore */ }
      await mongoose.connection.close();
      console.log('Mongoose connection closed after tests');
    }
  } catch (err) {
    console.error('Error during after() cleanup:', err);
  }
});

// ---------- Tests (unchanged, only small defensive change to handle err) ----------
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

    describe('it should fetch Live Status', (done) => {
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

    describe('it should fetch Ready Status', (done) => {
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

