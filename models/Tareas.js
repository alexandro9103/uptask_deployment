const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const Proyectos = require('./Proyectos');



const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING,
    estado: Sequelize.INTEGER
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;