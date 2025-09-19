// seed-planets.js
// Idempotent seeding: if planets collection already has documents, do nothing.
db = db.getSiblingDB("superData");

const existing = db.planets.countDocuments();
if (existing > 0) {
  print(`seed-planets: collection already has ${existing} documents - skipping insert`);
  quit();
}

const docs = [
  { id: 0, name: "Mercury" },
  { id: 1, name: "Venus" },
  { id: 2, name: "Earth" },
  { id: 3, name: "Mars" },
  { id: 4, name: "Jupiter" },
  { id: 5, name: "Saturn" },
  { id: 6, name: "Uranus" },
  { id: 7, name: "Neptune" },
  { id: 8, name: "Pluto" },
  { id: 9, name: "Ceres" }
];

const res = db.planets.insertMany(docs);
print(`seed-planets: inserted ${res.insertedCount} documents`);
quit();

