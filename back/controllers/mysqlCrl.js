const con = require('../configurations/mysql');

module.exports.getAll = (req, res) => {
    let q ="SELECT * FROM users WHERE name LIKE '%"+ req.query._name +"%'";
    if (req.query._age) {q += " AND age = '"+ req.query._age +"'";}
    q += " ORDER BY id DESC LIMIT "+ req.query._limit;
    con.query(q, (err, rows)=>{
        res.json(rows);
    });
};

module.exports.add = (req, res) => {
    con.query("INSERT INTO users (name, age, photo) VALUES ('"+ req.body.name +"', '"+ req.body.age +"', '"+ req.PHOTO_PARSED +"')", (err, data)=>{
        res.json({"id":data.insertId, "photo":req.PHOTO_PARSED});
    });
};

module.exports.edit = (req, res) => {
    con.query("UPDATE users SET name = '"+ req.body.name +"', age = '"+ req.body.age +"', photo = '"+ req.PHOTO_PARSED +"' WHERE id='"+ req.params.id +"'", (err, data)=>{
        res.json({"photo":req.PHOTO_PARSED});
    });
};

module.exports.remove = (req, res) => {
    con.query("DELETE FROM users WHERE id='"+ req.params.id +"'", (err, data)=>{
        //GET replacement row
        con.query("SELECT * FROM users WHERE id=(SELECT Max(id) from users where id < '"+ req.query.lasttableid +"')", (err, rows)=>{
            res.json(rows)
        });
    });
};

module.exports.notFound = (req, res) => {
    res.status(404).json("404 , no routes !");
};

module.exports.subscribe = (req, res, next) => {
    console.log(req.file);
    res.send(req.body);
};