const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('./placesdb.js');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());
app.listen(PORT, () => {
  const serverUrl = `http://localhost:${PORT}/places`;
  console.log('\x1b[36m%s\x1b[0m', 'Server running on port 3000 ✨✨✨');
  console.log(`To access the application, open your browser and navigate to:`);
  console.log(`\x1b[4m\x1b[32m%s\x1b[0m`, serverUrl);
});
client.connect();
app.get('/places', (req, res) => {
  client.query('SELECT * FROM places', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result.rows);
    }
  });
});

app.get('/places/:id', (req, res) => {
  const placeId = req.params.id;
  client.query('SELECT * FROM places WHERE id = $1', [placeId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result.rows);
    }
  });
});

app.post('/places', (req, res) => {
  const place = req.body;
  client.query('SELECT MAX(id) FROM places', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const maxId = result.rows[0].max;
    const newId = maxId ? maxId + 1 : 1;

    const insertQuery = `INSERT INTO places (id, name, description, latitude, longitude)
  VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
      newId,
      place.name,
      place.description,
      place.latitude,
      place.longitude,
    ];

    client.query(insertQuery, values, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        const addedPlace = result.rows[0];
        res.send(addedPlace);
      }
    });
  });
});

app.put('/places/:id', (req, res) => {
  const place = req.body;
  const updateQuery = `UPDATE places
                       SET name = $1,
                       description = $2,
                       latitude = $3,
                       longitude = $4
                       WHERE id = $5`;
  const values = [
    place.name,
    place.description,
    place.latitude,
    place.longitude,
    place.id,
  ];

  client.query(updateQuery, values, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Update was successful');
    }
  });
});

app.delete('/places/:id', (req, res) => {
  const deleteQuery = `DELETE FROM places WHERE id = $1`;
  const placeId = req.params.id;

  client.query(deleteQuery, [placeId], (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Deletion was successful');
    }
  });
});