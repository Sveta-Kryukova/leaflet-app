//placedb.js
const { Client } = require('pg')
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '666sv666',
  database: 'postgres'
})
 module.exports = client