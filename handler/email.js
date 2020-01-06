const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const utils = require('util');
const emailConfig = require('../config/email');

exports.enviar = async (opciones) => {
	const transporter = nodemailer.createTransport({
		host: emailConfig.host,
		port: emailConfig.port,
		auth: {
			user: emailConfig.user,
			pass: emailConfig.password
		}
	});

	const html = generarHtml(opciones.archivo, opciones);

	const info = await transporter.sendMail({
		from: '"UpTask" <noreplayfoo@uptask.com>', // sender address
		to: opciones.usuario.email, // list of receivers
		subject: opciones.subject, // Subject line
		text: htmlToText.fromString(html),
		html
	});
};

//Generar html
const generarHtml = (archivo, opciones = {}) => {
	const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
	return juice(html);
};
