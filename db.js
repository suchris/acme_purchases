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

const Thing = db.define("thing", {
    name: {
      type: STRING,
      allowNull: false,
    },
  });
  
const Purchase = db.define("purchase", {
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

Thing.hasMany(Purchase);
Purchase.belongsTo(Thing);

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    const [larry, moe, curly] = await Promise.all(
      ["Larry", "Moe", "Curly"].map((name) => Person.create({ name }))
    );
    const [LA, NYC, Paris, London] = await Promise.all(
      ["LA", "NYC", "Paris", "London"].map((name) => Place.create({ name }))
    );
    const [book, map, bag] = await Promise.all(
        ["book", "map", "bag"].map((name) => Thing.create({ name }))
      );
    const larryPurchase = await Purchase.create({
      date: new Date(Date.UTC(2016, 1, 1)),
      quantity: 1,
      personId: larry.id,
      placeId: LA.id,
      thingId: book.id
    });
    const moePurchase = await Purchase.create({
      date: new Date(Date.UTC(2017, 2, 1)),
      quantity: 2,
      personId: moe.id,
      placeId: NYC.id,
      thingId: map.id,
    });
    const curlyPurchase = await Purchase.create({
      date: new Date(Date.UTC(2018, 5, 1)),
      quantity: 3,
      personId: curly.id,
      placeId: Paris.id,
      thingId: bag.id,
    });
    await Promise.all([larryPurchase.save(), moePurchase.save(), curlyPurchase.save()]);
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
    Thing,
    Purchase,
  },
};
