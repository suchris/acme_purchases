const { Sequelize, STRING, DATE } = require('sequelize');

const db = new Sequelize('postgres://localhost:5432/acme_purchases');

const Person = db.define('person', {
    name: {
        type: STRING,
        allowNull: false
    }
});

const Place = db.define('place', {
    name: {
        type: STRING,
        allowNull: false
    }
});

const Purchase = db.define('purchase', {
    name: {
        type: STRING,
        allowNull: false
    },
    date: {
        type: DATE,
        allowNull: false
    }
});

