const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//Conexion con la Base de Datos
const db = require('./config/db');
require('dotenv').config({
    path: 'variables.env'
});
//Importar Modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync().then(() => {
    console.log('Conexion exitosa')
}).catch(error => {
    console.log('No se ha podido conectar: ' + error);
})

//Crear una app de express
const app = express();

//Cargar archivos estaticos
app.use(express.static('public'))

//Habilitar PUG
app.set('view engine', 'pug');

//Habilita BodyParser para leer datos de Formularios en JSON
app.use(bodyParser.urlencoded({
    extended: true
}));

//Agregamos express validato a toda la APP
//app.use(expressValidator());

//Agregar flash message
app.use(flash());

app.use(cookieParser());

//Sesiones permiten navegar entre varias paginas sin tener que volver a autenticar
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Pasar var_dumb a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {
        ...req.user
    } || null
    next();
});


//Rutas del proyecto
app.use(routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

//Escuchar en el puerto
app.listen(port, () => {
    console.log(`The server is running at: http://${host}:${port}`);
})