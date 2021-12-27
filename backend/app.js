const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs');

app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
   res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH");
   next();
});

const auth = async (req, res, next) => {
   try {
      console.log(1);
   } catch (e) {
      res.status(401).send({ error: 'Please authenticate.' });
   }
}

app.get('/feed/:id', async (req, res) => {
   const dataBuffer = await fs.readFileSync('./data.json');
   const dataJSON = dataBuffer.toString();
   const tempData = (JSON.parse(dataJSON)).articles;

   const data = tempData.filter((data) => {
      return data.id == req.params.id
   })

   res.send(data);
});

app.get('/feeds', async (req, res) => {
   const dataBuffer = await fs.readFileSync('./data.json');
   const dataJSON = dataBuffer.toString();
   const tempData = (JSON.parse(dataJSON)).articles;

   const data = tempData;

   res.send(data);
});

app.post('/register', async (req, res) => {
   const userData = req.body;
   const userDataJSON = JSON.stringify(req.body);
   fs.writeFileSync('./userdata.json', userDataJSON);
   res.send(userData);
})

app.post('/signin', async (req, res) => {
   const dataBuffer = fs.readFileSync('./userdata.json')
   const dataJSON = dataBuffer.toString()
   const userData = JSON.parse(dataJSON);

   if (userData.username === req.body.username && userData.password === req.body.password) {
      return res.send({ loggedIn: true,username:req.body.username });
   }

   res.send({ loggedIn: false })
})

app.listen(3001, () => {
   console.log('app is listening in port 3001');
})