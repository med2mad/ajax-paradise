const User = require('../../models/js/Mysql');

module.exports.getAll = (req, res)=>{
    let q ="SELECT * FROM "+User.table+" WHERE name LIKE '%"+ req.query._name +"%'";
        if (req.query._age) {q += " AND age = '"+ req.query._age +"'";}
        q += " ORDER BY _id ASC LIMIT "+ req.query._limit +" OFFSET " + req.query._skip;

    let q2 ="SELECT count(_id) as total FROM "+User.table+" WHERE name LIKE '%"+ req.query._name +"%'";
        if (req.query._age) {q += " AND age = '"+ req.query._age +"'";}

    User.findAll(q, q2).then((response)=>{
        res.json(response);
    });
};

module.exports.add = (req, res)=>{
    const user = new User({"name":req.body.name, "age":req.body.age, "photo":req.PHOTO_PARSED});

    user.create().then((response)=>{
        res.json(response);
    });
};

module.exports.edit = (req, res)=>{
    const id = req.params.id;
    const body = {"name":req.body.name, "age":req.body.age};
    const photo = req.PHOTO_PARSED; //by the time con.query finishes there will be no more req (no "body")
    
    User.update(id, body, photo).then((response)=>{
        res.json(response); 
    });
};

module.exports.remove = (req, res)=>{
    let replacement = "SELECT * FROM "+User.table+" WHERE _id=";
        replacement += "(SELECT Max(_id) from "+User.table+" where _id < '"+ req.query.lasttableid +"' AND name LIKE '%"+ req.query._name +"%'";
        if (req.query._age) {replacement += " AND age = '"+ req.query._age +"'";}
        replacement += ")";

    User.delete(req.params.id, replacement).then((response)=>{
        res.json(response); 
    });
};

module.exports.notFound = (req, res)=>{
    res.status(404).json("404 , no routes !");
};

module.exports.subscribe = (req, res, next)=>{
    console.log(req.file);
    res.send(req.body);
};

module.exports.getsub = (req, res, next)=>{   };