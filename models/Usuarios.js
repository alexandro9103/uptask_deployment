const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const db = require('../config/db');

const Proyectos = require('./Proyectos');
const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true


    },
    email: {
        type: Sequelize.STRING(80),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo Valido'
            },
            notEmpty: {
                msg: 'El correo no puede ser vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya Registrado'

        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ser vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            const password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
            usuario.password = password;
        },
    }
});
//Metodos Personalizados

Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}


Usuarios.hasMany(Proyectos);

module.exports = Usuarios;