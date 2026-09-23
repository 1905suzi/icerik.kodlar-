const https = require('https');
const fs = require('fs');

const url = 'https://media1.tenor.com/m/f_u3H8hNMBcAAAAd/milk-and-mocha-hug.gif';
const dest = 'C:\\Users\\11\\OneDrive\\Desktop\\İçerik kodları\\17-Galaksi-Kalp\\ayi.gif';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, options, (res2) => {
      const file = fs.createWriteStream(dest);
      res2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded redirected!');
      });
    });
  } else {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded directly!');
    });
  }
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
