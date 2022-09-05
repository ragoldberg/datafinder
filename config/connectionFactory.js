function connectionFactory()
{
    const mysql   = require("mysql2");

    const conexao = mysql.createPool({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });
    
    return conexao;
}

module.exports = ()=> connectionFactory;