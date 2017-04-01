var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var NodeSession = require('node-session');



app = express();

var port = process.env.PORT || 8080;
var session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});


app.use(express.static(__dirname + '/assets'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

.get('/', function(req, res){
    res.render('index.ejs');
})
.get('/signin', function(req, res){
    session.startSession(req, res, function(callback) {
        res.render('sign_in.ejs');
    });
})
.get('/dashboard', function(req, res){
    session.startSession(req, res, function() {
        var lastname = req.session.get('user_lastname');
        var name = req.session.get('user_name');
        console.log(lastname + " - " + name);
        res.render('dashboard.ejs', {lastname : lastname, name : name} );
    });
})
.get('/dashboard/courses/:matiere', function(req, res) {
    session.startSession(req, res, function(callback) {

        var matiere = req.params.matiere;
        var matiereName;
        var courseContent = "";

        switch (matiere) {
            case "maths":
                matiereName = "Mathématiques";

                try {
                    var data = fs.readFileSync('assets/courses/maths_global.txt', 'utf8');
                    courseContent = data;
                } catch(e) {
                    console.log('Error:', e.stack);
                }

                break;
            case "french":
                matiereName = "Français";
                //On ajoute le cours de français

                try {
                    var data = fs.readFileSync('assets/courses/fr_5e.txt', 'utf8');
                    courseContent = data;
                } catch(e) {
                    console.log('Error:', e.stack);
                }
                break;
            case "history":
                matiereName = "Histoire";
                break;
            case "geography":
                matiereName = "Géographie";
                break;
            case "biology":
                matiereName = "SVT";
                break;
            case "chemestry":
                matiereName = "Physique - Chimie";
                break;
            case "memotechnique":
                matiereName = "Mémotechniques";
                try {
                    var data = fs.readFileSync('assets/courses/memotechniques.txt', 'utf8');
                    courseContent = data;
                } catch(e) {
                    console.log('Error:', e.stack);
                }
                break;
            default:
                matiereName = "Erreur..."

        }
        var lastname = req.session.get('user_lastname');
        var name = req.session.get('user_name');
        res.render('course.ejs', {matiere_name : matiereName, course_content : courseContent, name : name, lastname : lastname});
    });
})

.post('/signin', function(req, res) {

    session.startSession(req, res, function(callback) {

        var fileName = __dirname + '/assets/user_data/db.json';
        var file = require(fileName);
        var arrayLength = file.length;
        file[arrayLength] = req.body;

        fs.writeFile(__dirname + "/assets/user_data/db.json", JSON.stringify(file, null, 2), function(err) {
            if(err) {
                return console.log(err);
            } else {
                //No errors while saving !
                //Save as cookies
                req.session.put('user_lastname', req.body.lastname);
                req.session.put('user_name', req.body.name);
                req.session.put('user_id', arrayLength);

                res.end('{"success" : "Updated Successfully", "status" : 200}');
            }
        });
    });


})
console.log("Server started on port "+ port +" !");
app.listen(port);
