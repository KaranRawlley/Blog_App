
var express = require("express"),
mongoose = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app");
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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

// NEW route 
app.get('/blogs/new',function(req,res){
    res.render('new')
});

// Create Route
app.post('/blogs',function(req,res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
            console.log('Error');
        else
            res.redirect('/blogs');    
    });

});

//Show route
app.get('/blogs/:id',function(req,res){
    Blog.findOne({_id:req.params.id},function(err,blog){
        if(err)
            console.log("error");
        else
            res.render('show',{dblog:blog}); 
    });
});

// EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res){
    Blog.findOne({_id:req.params.id},function(err,blog){
        if(err)
            res.redirect('/blogs');
        else
            res.render('edit',{blog:blog});   
    });
});

//UPDATE ROUTE
app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
            res.redirect('/blogs');
        else
            res.redirect('/blogs/'+ req.params.id);    
    });
});
//DESTROY ROUTE
app.delete('/blogs/:id',function(req,res){
    Blog.findOneAndRemove(req.params.id,function(err){
            if(err)
                res.redirect('/blogs');
            else
                res.redirect('/blogs');
        
    })
});


app.listen(3000,function(){
    console.log('Server Started')
});


