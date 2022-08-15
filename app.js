const express = require('express'),
bodyParser    = require('body-parser'),
mongoose      = require('mongoose'),
app           = express();

require('dotenv').config();

function connectDB() {
    try {
        // process.env.db_URI = mongodb_URI
        mongoose.connect(process.env.db_URI);
        console.log('connected to DB');
    } catch { 
        err => console.log(err, 'DB connection went wrong');
    }
}

// mongoose.connect('mongodb://localhost/crazy_xp_db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const postSchema = new mongoose.Schema({
    body: String,
    created: {type: Date, default: Date.now},
});

const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
    res.redirect('/posts');
});

app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            console.log('error');
        } else {
            res.render('index', {posts: posts});
        }
    })
});

app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.post('/posts', (req, res) => {
    Post.create(req.body.post, (err, newPost) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/posts');
        }
    })
});

app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err) {
            res.redirect('/posts');
        } else {
            res.render('report', {post: foundPost});
        }
    })
});

app.listen(process.env.PORT || 3500, process.env.IP, () => {
    connectDB();
    console.log('server started || 3500');
});