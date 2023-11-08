const port = process.env.mysqlPORT || process.argv[2] || 5010;
// Import required packages
const express = require('express');
const cors = require('cors');
const expressFileupload = require('express-fileupload');
const multer = require('./multer');
const mysqlCon = require('./configurations/mysql');

// Create an Express application
const app = express();
app.use(cors());
// app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(expressFileupload());
// app.use(multer);

mysqlCon.connect((err) => {
  if (err){console.log("'Mysyql' initial connection error");}
  else{app.listen(port, ()=>{console.log("'Mysyql' Port: " + port);});}
});
//in MVC use : const conn = await mysqlCon.createConnection({ database: test }); //OR send a function as parameter

//API Routes (API endpoints)
const {getAll, add, edit, remove, notFound, addUser} = require('./controllers/mysqlCrl');
//Get All
app.get('/sub/:rparam', (req, res)=>{console.log(req.body);res.send(req.body);});
app.get('/',  getAll);
//Insert
app.post('/sub/:rparam', multer, addUser);
app.post('/', multer, add);
//Update
app.put('/:id', edit);
//Delete
app.delete('/:id', remove);
//404
app.use(notFound);