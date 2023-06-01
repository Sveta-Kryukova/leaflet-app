//api.js
const client = require('./placesdb.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
  const placeId = req.params.id
  client.query('SELECT * FROM places WHERE id = $1', [placeId], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.send(result.rows)
    }
  })
})

app.post('/places', (req, res) => {
  const place = req.body
  const insertQuery = `INSERT INTO places (id, name, description, latitude, longitude)
  VALUES ($1, $2, $3, $4, $5)`
  const values = [place.id, place.name, place.description, place.latitude, place.longitude]

  client.query(insertQuery, values, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.send('Place added successfully')
    }
  })
})

app.put('/places/:id', (req, res)=> {
  let place = req.body;
  let updateQuery = `update places
                     set name = '${place.name}',
                     description = '${place.description}',
                     latitude = '${place.latitude}',
                     longitude = '${place.longitude}'
                     where id = ${place.id}`

  client.query(updateQuery, (err, result)=>{
      if(!err){
          res.send('Update was successful')
      }
      else{ console.log(err.message) }
  })
  client.end;
})

app.delete('/places/:id', (req, res)=> {
  let insertQuery = `delete from places where id=${req.params.id}`

  client.query(insertQuery, (err, result)=>{
      if(!err){
          res.send('Deletion was successful')
      }
      else{ console.log(err.message) }
  })
  client.end;
})