const fs = require('fs');
const pg = require('pg');

const client = new pg.Client({
  user: 'thiago082882',
  host: 'https://ufit-backend-green.vercel.app/',
  database: 'neondb',
  password: 'postgres://thiago082882:zh6ZKJinoxE3@ep-empty-lake-811644.us-east-2.aws.neon.tech/neondbpostgres://thiago082882:zh6ZKJinoxE3@ep-empty-lake-811644.us-east-2.aws.neon.tech/neondb',
  port: 5432,
});

client.connect();

fs.readFile('./db/create-table.sql', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  client.query(data, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Table created successfully!');
    client.end();
  });
});