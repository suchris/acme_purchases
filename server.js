const express = require("express");
const html = require("html-template-tag");
const {
  db,
  syncAndSeed,
  models: { Person, Place, Thing, Purchase },
} = require("./db");

const app = express();

app.use(require("method-override")("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.delete("/purchases/:id", async (req, res, next) => {
    try {
        const purchase = await Purchase.findByPk(req.params.id);
        await purchase.destroy();
        res.redirect("/");
    } catch (err) {
        next(err);
    }
});

app.post("/", async (req, res, next) => {
    try {
        const purchase = await Purchase.create(req.body);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
});

app.get("/", async (req, res, next) => {
  try {
    const [people, places, things, purchases] = await Promise.all([
      Person.findAll(),
      Place.findAll(),
      Thing.findAll(),
      Purchase.findAll({
        include: [Person, Place, Thing],
      }),
    ]);
    res.send(html`
      <html>
        <head>
          <title>Purchases Abroad</title>
          <link rel="stylesheet" href="./style.css"/>
        </head>
        <body>
          <h1>Acme Purchases Abroad</h1>
          <h3>Add a purchase!</h3>
          <form method="POST" id='purchase-form'>
            <select name="personId" action="/people/${people.id}">
              <option>Person</option>
                ${people.map(
                  (person) =>
                    html` <option value="${person.id}">${person.name}</option> `
                )}
              </option>
            </select>
            <select name="placeId" action="/places/${places.id}">
              <option>Place</option>
                ${places.map(
                  (place) =>
                    html` <option value="${place.id}">${place.name}</option> `
                )}
              </option>
            </select>
            <select name="thingId" action="/things/${things.id}">
              <option>Thing</option>
                ${things.map(
                  (thing) =>
                    html` <option value="${thing.id}">${thing.name}</option> `
                )}
              </option>
            </select>
            <input type="number" id="quantity" name="quantity" placeholder=0>
            <input type="date" id="date" name="date">
            <button>Save Purchase</button>
          </form>
          <div>
            <h2>What They Bought</h2>
            <ul>
              ${purchases.map(
                (purchase) => html` <li>
                  ${purchase.person.name} purchased ${purchase.quantity} ${purchase.thing.name} at ${purchase.place.name} on ${purchase.date.toDateString()}
                    <form method="POST" action="/purchases/${purchase.id}?_method=DELETE">
                      <button>x</button>
                    </form>
                </li>`
              )}
            </ul>
          </div>
        </body>
      </html>
    `);
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
