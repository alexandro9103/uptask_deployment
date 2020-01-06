const express = require('express');
const {
	body
} = require('express-validator');
//Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const router = express.Router();

module.exports = function () {
	//Rutas para el home
	router.get('/',
		authController.usuarioAutenticado,
		proyectosController.proyectosHome);
	router.get('/nuevo-proyecto',
		authController.usuarioAutenticado,
		proyectosController.formularioProyecto);
	router.post('/nuevo-proyecto',
		authController.usuarioAutenticado,
		body('nombre').not().isEmpty().trim().escape(),
		proyectosController.nuevoProyecto);
	router.get('/proyectos/:url',
		authController.usuarioAutenticado,
		proyectosController.proyectoPorUrl);

	//Actualizar Proyecto
	router.get('/proyecto/editar/:id', proyectosController.formularioEditar);
	router.post(
		'/nuevo-proyecto/:id',
		authController.usuarioAutenticado,
		body('nombre').not().isEmpty().trim().escape(),
		proyectosController.actualizarProyecto
	);
	router.delete('/proyectos/:url',
		authController.usuarioAutenticado,
		proyectosController.eliminarProyecto);

	//Tareas
	router.post('/proyectos/:url',
		authController.usuarioAutenticado,
		tareasController.agregarTarea)
	router.patch('/tareas/:id',
		authController.usuarioAutenticado,
		tareasController.cambiarEstadoTarea)
	router.delete('/tareas/:id',
		authController.usuarioAutenticado,
		tareasController.eliminarTarea)

	//Crear Nueva Cuenta
	router.get('/crear-cuenta', usuariosController.formCrearCuenta);
	router.post('/crear-cuenta', usuariosController.crearCuenta);
	router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
	//Iniciar Sesion
	router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.autenticarUsuarios);

	//Cerrar Sesion
	router.get('/cerrar-sesion', authController.cerrarSesion);
	//Reestablecer la contraseña
	router.get('/reestablecer', authController.formReestablecerPassword);
	router.post('/reestablecer', authController.enviarToken);
	router.get('/reestablecer/:token', authController.validarToken);
	router.post('/reestablecer/:token', authController.actualizarPassword);


	return router;
};