var express= require("express");

var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use('/public',express.static('public'))

app.get('/', function(req,res){
	res.render('recortarimgs.html');
});

app.listen(8080);