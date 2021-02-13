const { Sequelize, STRING, DATE, INTEGER } = require("sequelize");

const db = new Sequelize("postgres://localhost:5432/acme_purchases");

const Person = db.define("person", {
  name: {
    type: STRING,
    allowNull: false,
  },
});

const Place = db.define("place", {
  name: {
    type: STRING,
    allowNull: false,
  },
});

const Purchase = db.define("purchase", {
  name: {
    type: STRING,
    allowNull: false,
  },
  date: {
    type: DATE,
    allowNull: false,
  },
  quantity: {
    type: INTEGER,
  },
});

Person.hasMany(Purchase);
Purchase.belongsTo(Person);

Place.hasMany(Purchase);
Purchase.belongsTo(Place);

const syncAndSeed = async () => {
  try {
    await db.sync();
    const [larry, moe, curly] = await Promise.all(
      ["larry", "moe", "curly"].map((person) => Person.create({ person }))
    );
    const [LA, NYC, Paris, London] = await Promise.all(
      ["LA", "NYC", "Paris", "London"].map((place) => Place.create({ place }))
    );
    const book = await Purchase.create({
      name: "book",
      date: new Date(Date.UTC(2016, 1, 1)),
      quantity: 1,
      personId: larry.id,
      placeId: LA.id,
    });
    const map = await Purchase.create({
      name: "map",
      date: new Date(Date.UTC(2017, 2, 1)),
      quantity: 2,
      personId: moe.id,
      placeId: NYC.id,
    });
    const bag = await Purchase.create({
      name: "bag",
      date: new Date(Date.UTC(2018, 5, 1)),
      quantity: 3,
      personId: curly.id,
      placeId: Paris.id,
    });
    await Promise.all([book.save(), map.save(), bag.save()]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  db,
  syncAndSeed,
  models: {
    Person,
    Place,
    Purchase,
  },
};
