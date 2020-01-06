const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env'});
// Option 1: Passing parameters separately
const sequelize = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER,process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    //operatorsAliases: false,
    define: {
        timestamps: false
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;