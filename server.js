const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');

admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
 });
 
 
 const upload = multer({
     storage: multer.memoryStorage()
 });

/*
*ROTAS USERS
*/

const users = require('./routes/usersRoutes');


/* FIM DA ROUTA USERS */

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
     extended:true

}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port',port);

/*
* CHAMANDO ROTAS USERS
*/
users(app, upload);

/* FIM DA CHAMADA  */

server.listen(3000,'192.168.0.106' || 'localhost',function(){

     console.log('Aplicação de NodeJS ' + port + 'Iniciada...')


});

//ERROR HANDLER

app.use((err,req,res,next) =>{
console.log(err);
res.status(err.status || 500).send(err.stack);
});

module.exports = {
     app:app,
     server : server
}

// 200 - RESPOSTA BEM SUCEDIDA
// 404 - NÃO EXISTE 
// 500 - ERROR INTERNO DO SERVIDOR