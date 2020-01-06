const passport = require('passport');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handler/email')
exports.autenticarUsuarios = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true,
	badRequestMessage: 'Ambos campos son obligatorios'
});

//Funcion para saber si el usuario esta logeado o no?
exports.usuarioAutenticado = (req, res, next) => {
	//Si el usuario esta autenticado seguir adelante
	if (req.isAuthenticated()) {
		return next();
	}

	//si no esta autenticado, redirigir al formulario
	return res.redirect('/iniciar-sesion');
};

//Cerrar la sesion
exports.cerrarSesion = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/iniciar-sesion');
	});
};

exports.formReestablecerPassword = (req, res) => {
	res.render('reestablecer', {
		nombrePagina: 'Reestablecer tu contraseña'
	});
};

exports.enviarToken = async (req, res) => {
	const {
		email
	} = req.body;

	const usuario = await Usuarios.findOne({
		where: {
			email
		}
	});

	if (!usuario) {
		req.flash('error', 'No existe esa cuenta');
		res.redirect('/reestablecer');
	}

	usuario.token = crypto.randomBytes(20).toString('hex');
	usuario.expiracion = Date.now() + 3600000;
	await usuario.save();

	const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
	//Envia el correo con el toquen
	await enviarEmail.enviar({
		usuario,
		subject: 'Password Reset',
		resetUrl,
		archivo: 'reestablecerPassword'
	});

	req.flash('correcto', 'Se envio un mensaje a tu correo');
	res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
	const {
		token
	} = req.params;
	const usuario = await Usuarios.findOne({
		where: {
			token
		}
	});

	if (!usuario) {
		req.flash('error', 'No Valido');
		res.redirect('/reestablecer');
	}

	res.render('resetPassword', {
		nombrePagina: 'Reestablecer Contraseña'
	});
};

exports.actualizarPassword = async (req, res) => {
	const {
		token
	} = req.params;
	const {
		password
	} = req.body;
	//Verificar token valido y tambien la fecha de expiracion
	const usuario = await Usuarios.findOne({
		where: {
			token,
			expiracion: {
				[Op.gte]: Date.now()
			}
		}
	});

	//Verificar que el usuario existe
	if (!usuario) {
		req.flash('error', 'No Valido');
		res.redirect('/reestablecer');
	}

	//Hacer Hash al nuevo Password
	const nuevoPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	usuario.password = nuevoPassword;
	usuario.token = null;
	usuario.expiracion = null;
	await usuario.save();

	req.flash('correcto', 'Tu password se ha modificado correctmente');
	res.redirect('/iniciar-sesion');
};