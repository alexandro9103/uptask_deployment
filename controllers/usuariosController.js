const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handler/email')
exports.formCrearCuenta = (req, res) => {
	res.render('crearCuenta', {
		nombrePagina: 'Crear Cuenta en UpTask'
	});
};

exports.formIniciarSesion = (req, res) => {
	const {
		error
	} = res.locals.mensajes;
	res.render('iniciarSesion', {
		nombrePagina: 'Iniciar Sesion en UpTask',
		error
	});
};

exports.crearCuenta = async (req, res) => {
	const {
		email,
		password
	} = req.body;

	try {
		const resultado = await Usuarios.create({
			email,
			password
		});

		//crear URL de confirmar
		const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
		//Crear el objeto Usuario

		const usuario = {
			email
		};
		//Enviar E-mail
		await enviarEmail.enviar({
			usuario,
			subject: 'Confirmar tu cuenta de Uptask',
			confirmarUrl,
			archivo: 'confirmarCuenta'
		});

		//Redirigir al usuario
		req.flash('correcto', 'Enviamos un correo, confirmar cuenta');
		return res.redirect('/iniciar-sesion');



	} catch (err) {
		req.flash('error', err.errors.map((error) => error.message));
		console.log(err.errors)
		res.render('crearCuenta', {
			nombrePagina: 'Crear Cuenta en UpTask',
			mensajes: req.flash(),
			email,
			password
		});
	}
};

exports.confirmarCuenta = async (req, res) => {
	//Cambiar el estado de una Cuenta
	const {
		correo
	} = req.params;

	const usuario = await Usuarios.findOne({
		where: {
			email: correo
		}
	});

	if (!usuario) {
		req.flash('error', 'No valido');
		res.redirect('/crear-cuenta');
	}

	usuario.activo = 1;
	await usuario.save();
	req.flash('correcto', 'Cuenta Activada correctamente');
	res.redirect('/iniciar-sesion');

}