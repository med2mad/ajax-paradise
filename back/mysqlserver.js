// Import required packages
const express = require('express');
const cors = require('cors');
const multer = require('./configurations/multer');
const mysqlCon = require('./configurations/mysql');

// Create an Express application
const app = express();
app.use(cors());
app.use(express.json());
app.use(multer);
app.use(customParser); //parses the name of the photo in a new variable called "req.PHOTO_PARSED"

const port = process.env.mysqlPORT || process.argv[2] || 5010;
mysqlCon.connect((err) => {
  if (err){console.log("'Mysyql' initial connection error");}
  else{app.listen(port, ()=>{console.log("Mysyql: " + port);});}
});
//in MVC use: const conn = await mysqlCon.createConnection({database:test}); //OR send a function as parameter (recomended)

//API Routes (API endpoints)
const {getAll, add, edit, remove, notFound, subscribe, getsub} = require('./controllers/mysqlCrl');
//Get All
app.get('/sub',  getsub);
app.get('/',  getAll);
//Insert
app.post('/sub', subscribe);
app.post('/',add);
//Update
app.put('/:id', edit);
//Delete
app.delete('/:id', remove);
//404
app.use(notFound);

function customParser (req, res, next){
  if(req.file){req.PHOTO_PARSED = req.file.filename;}
  else{req.PHOTO_PARSED = req.body.selectedPhotoName;}
  next();
}