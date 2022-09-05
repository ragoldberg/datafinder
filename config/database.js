const Sequelize  = require("sequelize");

module.exports = new Sequelize('datafinder', 'root', '', {
    host: 'mysqlvip.datafinder.com.br',
    dialect: 'mysql',
  
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});