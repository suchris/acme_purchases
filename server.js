const express = require("express");
const html = require("html-template-tag");
const {
  db,
  syncAndSeed,
  models: { Person, Place, Thing, Purchase },
} = require("./db");

const app = express();

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
    // res.send(html`
    //   <html>
    //     <head>
    //       <title>Purchases Abroad</title>
    //     </head>
    //     <body>
    //       <h1>Acme Purchases Abroad</h1>
    //       <form method="POST">
    //         <select name="personId">
    //           <option></option>
    //           ${people.map((person) => {
    //             html` <option value="${person.id}"></option> `;
    //           })}
    //         </select>
    //       </form>
    //       <div>
    //         <h2>What They Bought</h2>
    //         <ul>
    //           ${purchases.map((purchase) => html` <li></li>`)}
    //         </ul>
    //       </div>
    //     </body>
    //   </html>
    // `);
      res.send({ people, places, things, purchases });
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
