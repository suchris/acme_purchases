const express = require('express');

const { db, syncAndSeed,
    models: {
        Person,
        Place,
        Purchase,
    }
} = require('./db');

const app = express();

app.get('/', async (req, res, next) => {
    try {
        const [people, places, purchases] = await Promise.all([
            Person.findAll(),
            Place.findAll(),
            Purchase.findAll({
                include: [ Person, Place ]
            })
        ]);
        res.send({ people, places, purchases });
    } catch (err) {
        next(err);
    }
});

const init = async () => {
    try {
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`));
    } catch (err) {
        console.log(err);
    }
};

init();
