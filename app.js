
var express = require("express"),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app");
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//mongoose config
var blogSchema = mongoose.Schema({
    
    title : String,
    image : String,
    body  : String,
    created : {type:Date , default:Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

//RESTful routes
//root route
app.get('/', function(req, res) {
    res.redirect('/blogs')
});
//index route
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
            console.log('Error');
        else
            res.render('index',{blogs:blogs});
    });
    
});

app.listen(3000,function(){
    console.log('Server Started')
});


