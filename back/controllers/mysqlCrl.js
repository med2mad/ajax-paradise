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
    con.query("INSERT INTO users (name, age, photo) VALUES ('"+ req.body.name +"', '"+ req.body.age +"', '"+ req.body.photo +"')", (err, data)=>{
        res.json(data.insertId);
    });
};

module.exports.edit = (req, res) => {
    con.query("UPDATE users SET name = '"+ req.body.name +"', age = '"+ req.body.age +"', photo = '"+ req.body.photo +"' WHERE id='"+ req.params.id +"'", (err, data)=>{
        res.json(data);
    });
};

module.exports.remove = (req, res) => {
    con.query("DELETE FROM users WHERE id='"+ req.params.id +"'", (err, data)=>{
        //GET Row to add instead
        con.query("SELECT * FROM users WHERE id=(SELECT Max(id) from users where id < '"+ req.query.lasttableid +"')", (err, rows)=>{
            res.json(rows)
        });
    });
};

module.exports.notFound = (req, res) => {
    res.status(404).json("404 , no routes !");
};

module.exports.addUser = (req, res, next) => {
    const body = req.body;
    const file = req.files.photo;
    console.log(body);
    res.send(file);

    file.mv( file.name, (err, result)=>{if (err) {console.log(err)}} );
};