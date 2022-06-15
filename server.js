const express = require('express');
server = express();
const http = require('http').createServer(server);
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const expressThymeleaf = require('express-thymeleaf')
const {TemplateEngine} = require('thymeleaf')

const TempEng = new TemplateEngine()

const io = require("socket.io")(http, {
    cors: {
        origin: "localhost:8080",
        methods: ["GET", "POST"]
    }
});

const urlencodedParser = express.urlencoded({extended: false});

server.engine('html', expressThymeleaf(TempEng))
server.set('view engine', 'html')
server.set('views', path.join(__dirname, '/public'));
server.use(cors());
server.use(express.json())
server.use(express.static(__dirname + '/public'))
server.use(serveStatic(__dirname + "/public/dist"));

server.post('/game', (req, res) => {
    if(!req.body.login_input_sign_in ||
        req.body.login_input_sign_in === '') {
            res.render('index', {error: 'login is required'})
        }
    else if(!req.body.password_input_sign_in ||
        req.body.password_input_sign_in === '') {
            res.render('index', {error: 'password is required'})
        } else {
            return res.render('/index.html');
        }
})


server.get('/', (req, res) => {
        res.render('index', {error: ''})
})

server.get('/registr', (req, res) => {
        res.render('registr', {error: ''})
})

server.post('/', urlencodedParser, (req, res) => {
    if(!req.body.login_input_sign_in ||
        req.body.login_input_sign_in === '') {
            res.render('index', {error: 'login is required'})
        }
    else if(!req.body.password_input_sign_in ||
        req.body.password_input_sign_in === '') {
            res.render('index', {error: 'password is required'})
        } else {
            return res.render('/dist/index.html');
        }
    }) 

server.post('/registr', urlencodedParser, (req, res) => {
        if(!req.body.login_input_sign_up ||
            req.body.login_input_sign_up === '') {
                res.render('registr', {error: 'login is required'})
            } else if(!req.body.password_input_sign_up ||
                        req.body.password_input_sign_up === '') {
                            res.render('registr', {error: 'password is required'})
                } else if(!req.body.confirm_input_sign_up ||
                        req.body.confirm_input_sign_up ==='' ||
                        req.body.confirm_input_sign_up !== req.body.password_input_sign_up) {
                            res.render('registr', {error: 'password does not match'}) 
                        } else if(req.body.login_input_sign_up.length <= 5 ||
                                    req.body.login_input_sign_up.length >= 31) {
                                        res.render('registr', {error: 'your login must contain from 6 to 30 symbols'})
                            } else if(req.body.password_input_sign_up.length <= 7 ||
                                req.body.password_input_sign_up.length >= 31) {
                                    res.render('registr', {error: 'your password must contain from 8 to 30 symbols'})
                                 } else {
                                    res.render('index', {error: 'dorova'}) 
                                    }
        }) 

const port = process.env.PORT || 8080;

http.listen(port, function () {
    console.log('Server started!');
});