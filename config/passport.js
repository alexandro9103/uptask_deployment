const passport = require('passport');
const LocalStrategy = require('passport-local');

//Referencia al modelo que vamos a Autenticar
const Usuarios = require('../models/Usuarios');

//Local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y password pero se puede reescribir
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                })

                //El usuario existe, password Incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }

                //El email existe y el password es correcto
                return done(null, usuario);
            } catch (err) {
                //Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }

        }
    )
);

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

module.exports = passport;