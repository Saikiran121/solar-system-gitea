// seed-planets.js
db = db.getSiblingDB("superData");
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
db.planets.insertMany(docs);
print("Inserted", db.planets.countDocuments(), "documents.");

