const express     = require('express'),
bodyParser        = require('body-parser'),
mongoose          = require('mongoose'),
dotenv            = require('dotenv'),
app = express();
dotenv.config();

const 
username = process.env.db_user,
password = process.env.password;

// mongoose.connect('mongodb://localhost/crazy_xp_db');
const mongoDBClusterURI = `mongodb+srv://${username}:${password}@cluster0.4iyweli.mongodb.net/crazy_xb_db?retryWrites=true&w=majority`;
async function connectMongo() {
    try {
        await mongoose.connect(mongoDBClusterURI);
        console.log('Successfully connected to mongoDB');
    } catch { 
        err => console.log(err, 'Something went wrong');
    }
}
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const postSchema = new mongoose.Schema({
    body: String,
    created: {type: Date, default: Date.now()},
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

app.get('/contact', (req, res) => {
    res.render('contact');
});

// app.listen(3500, () => {
//     console.log('server started on port 3500');
// });

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server started');
});