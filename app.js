const exp = require("express");
const app = exp();
const parser = require('body-parser');
app.use(parser.json());
const mysql = require('mysql');
app.use(exp.static('public'));
app.set('view engine', 'pug');
let trashs = {};
let amm = 0;
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'restoran',
});

app.get("/", (req, res) => {
    if (amm === 0) amm = '';
    amm = 0;
    goods = {};
    connection.query('select * from products', function(error, results) {
        for (var i = 0; i < results.length; i++) { goods[results[i]['id']] = results[i]; }
        res.render('main', {
            'goods': JSON.parse(JSON.stringify(goods)),
            'amm': amm,
        });
    })
});
app.post('/', (req, res) => {
    if (amm === 0) amm = 1;
    else amm++;
    connection.query('select * from products where id in (' + req.body.key.join(',') + ')', function(error, result) {
        let trash = {};
        for (let i = 0; i < result.length; i++) {
            trash[result[i]['id']] = result[i];
            trashs[result[i]['id']] = result[i];
        }
        var c = trash[req.body.id].Count + req.body.value[req.body.id];
        connection.query('update products set Count=(' + c + ') where id=(' + req.body.id + ')');
        res.json(trash);

    });
});
app.get('/trash', (req, res) => {
    if (Object.keys(trashs).length != 0) {
        connection.query('select * from products where id in (' + Object.keys(trashs).join(',') + ')', function(error, result) {
            let trash = {};
            let Price = 0;
            for (var i = 0; i < result.length; i++) {
                trash[result[i]['id']] = result[i];
                if (result[i]['Count'] != 0) Price += result[i]['Cost'] * result[i]['Count'];
            }
            res.render('trash', {
                'goodss': JSON.parse(JSON.stringify(trash)),
                'Price': Price,
            });
        })
    } else {
        res.render('error');
    }
});
app.post('/trash', (req, res) => {
    if (amm === 0) amm = '';
    else amm--;
    let trash = {};
    connection.query('select * from products where id in (' + Object.keys(trashs).join(',') + ')', function(error, result) {
        let Price = 0;
        for (var i = 0; i < result.length; i++) {
            trash[result[i]['id']] = result[i];
            if (result[i]['Count'] != 0) Price += result[i]['Cost'] * result[i]['Count'];
        }
        if (req.body.key1 == undefined) {
            var c = trash[req.body.key].Count - 1;
            if (c == 0) delete trashs[req.body.key];
            connection.query('update products set Count=? where id=' + parseInt(req.body.key), parseInt(c));
        }
        if (req.body.key == undefined) {
            var c = trash[req.body.key1].Count + 1;
            connection.query('update products set Count=? where id=' + parseInt(req.body.key1), parseInt(c));
        }
        res.render('trash', {
            'goodss': JSON.parse(JSON.stringify(trash)),
            'Price': Price,
        });
    });
})
app.get('/zakaz', (req, res) => {
    connection.query('select * from products where id in (' + Object.keys(trashs).join(',') + ')', function(error, result) {
        let Price = 0;
        for (var i = 0; i < result.length; i++) {
            if (result[i]['Count'] != 0) Price += result[i]['Cost'] * result[i]['Count'];
        }
        res.render('zakaz', {
            'Prices': Price
        });
    })
})
app.listen(3000, function() {
    console.log("good");
    connection.query('update products set Count=0')
});