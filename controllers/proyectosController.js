const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
	const { id } = res.locals.usuario;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId: id
		}
	});

	res.render('index', {
		nombrePagina: 'Proyectos',
		proyectos
	});
};

exports.formularioProyecto = async (req, res) => {
	const { id } = res.locals.usuario;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId: id
		}
	});
	res.render('nuevoProyecto', {
		nombrePagina: 'Nuevo Proyecto',
		proyectos
	});
};

exports.nuevoProyecto = async (req, res) => {
	const { nombre } = req.body;

	const { id } = res.locals.usuario;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId: id
		}
	});
	let errores = [];

	if (!nombre) {
		errores.push({
			texto: 'Agrega un bombre al Proyecto'
		});
	}

	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos
		});
	} else {
		const { id } = res.locals.usuario;
		const proyecto = await Proyectos.create({
			nombre,
			usuarioId: id
		});
		res.redirect('/');
	}
};

exports.proyectoPorUrl = async (req, res, next) => {
	const { url } = req.params;

	const { id } = res.locals.usuario;
	const proyectosPromise = Proyectos.findAll({ where: { usuarioId: id } });
	const proyectoPromise = await Proyectos.findOne({
		where: {
			url,
			usuarioId: id
		}
	});

	const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]);

	if (!proyecto) {
		return next();
	}

	const tareas = await Tareas.findAll({
		where: {
			proyectoId: proyecto.id
		}
	});

	res.render('tareas', {
		nombrePagina: 'Tareas del Proyecto',
		proyecto,
		proyectos,
		tareas
	});
};

exports.formularioEditar = async (req, res) => {
	const { id } = req.params;
	const { usuarioId } = res.locals.usuario.id;
	const proyectosPromise = Proyectos.findAll({
		where: {
			usuarioId
		}
	});
	const proyectoPromise = Proyectos.findOne({
		where: {
			id,
			usuarioId
		}
	});

	const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]);

	res.render('nuevoProyecto', {
		nombrePagina: 'Editar Proyecto',
		proyectos,
		proyecto
	});
};

exports.actualizarProyecto = async (req, res) => {
	const { nombre } = req.body;
	const { id } = req.params;

	const { usuarioId } = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId
		}
	});

	let errores = [];

	if (!nombre) {
		errores.push({
			texto: 'Agrega un bombre al Proyecto'
		});
	}

	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Editar Proyecto',
			errores,
			proyectos
		});
	} else {
		const proyecto = await Proyectos.update(
			{
				nombre
			},
			{
				where: {
					id
				}
			}
		);
		res.redirect('/');
	}
};

exports.eliminarProyecto = async (req, res, next) => {
	try {
		const urlProyecto = req.query[0];
		console.log(urlProyecto);
		const resultado = await Proyectos.destroy({
			where: {
				url: urlProyecto
			}
		});

		if (!resultado) {
			return next();
		}

		res.send('Proyecto Eliminado correctamente');
	} catch (e) {
		console.log(e);
	}
};

exports.nosotros = (req, res) => {
	res.render('nosotros');
};
