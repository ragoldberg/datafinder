const mysql  = require("mysql2");
const jwt    = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


var db_config = {
host: process.env.users_host,
user: process.env.users_user,
password: process.env.users_password,
database: process.env.users_database
};

var db;

function handleDisconnect() {
  db = mysql.createPool(db_config);
}

handleDisconnect();

exports.login = async (request, response) =>{

    try {
        const { email, senha } = request.body;

        if (! email || ! senha)
        {
            return response.status(400).json({msg: "Dados de login incompletos!"});
        }

        db.query('select id, nome, email, senha from usuarios where ? and status <> 0', { email }, async ( error, results)=>{

            if (error)
            {
                return response.status(401).json({err:[{msg: "Dados de login incorretos, tente novamente!"}]});
             
            }
            else if (!results)
            {
                return response.status(401).json({err:[{msg: "Usuário não cadastrado ou ativado, Entre em contato com o suporte!"}]});
             
            }
            else if (results.length == 0)
            {
                return response.status(401).json({err:[{msg: "Usuário não cadastrado, tente novamente!"}]});
             
            }
            else if (!(await bcrypt.compare(senha, results[0].senha )))
            {
                return response.status(401).json({err:[{msg: "Dados de login incorretos, tente novamente!"}]});
            }
            else
            {
                let id   = results[0].id;
                let nome = results[0].nome;
                let email= results[0].email;
                let user = { id, nome, email};

                const token = jwt.sign( user, "SECRETps$&&**956", {
                    
                });
                return response.json({token, user:[{id,nome,email}]});
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}


exports.LGPD = (request, response) => {

    const { nome, email,telefone,cnpj } = request.body;

    db.query("select id,'LGPD',email from LGPD where ?  ",{email}, async (error,results)=>{ 

        if (results.length > 0)
        {
            return response.status(400).json({err:[{msg: "Email já cadastrado!"}]});
        }
        else
        {
           

            db.query('insert into LGPD set ?',{
                nome,
                email,
                telefone,
                cnpj
            }, (error, results) =>{
                if (error)
                {
                    return response.status(400).json({err:[{msg: "Erro na tentativa de registrar!"}]});
                }
                else
                {
                    let id  = results.insertId;
                    const token = jwt.sign( {id,nome,email}, "SECRETps$&&**956", {
                    
                    });
                    return response.json({"token": token});

                }
            })
        }

    });

}


exports.trial = (request, response) => {

    const { nome, email, senha,status,expirydate, empresa,telefone,cnpj, confirmar_senha } = request.body;

    db.query("select id,'TENTATIVA_TRIAL', nome, email from usuarios where ?  ",{email}, async (error,results)=>{ 

        if (results.length > 0)
        {
            return response.status(400).json({err:[{msg: "Email já cadastrado!"}]});
        }
        else
        {
            let hashedPassword = await bcrypt.hash(senha, 8);

            db.query('insert into usuarios set ?',{
                nome,
                email,
                senha: hashedPassword,
                status,
                expirydate,
                empresa,
                telefone,
                cnpj
            }, (error, results) =>{
                if (error)
                {
                    return response.status(400).json({err:[{msg: "Erro na tentativa de registrar!"}]});
                }
                else
                {
                    let id  = results.insertId;
                    const token = jwt.sign( {id,nome,email}, "SECRETps$&&**956", {
                    
                    });
                    return response.json({"token": token});

                }
            })
        }

    });

}


exports.registrar = (request, response) => {

    const { nome, email, senha,status,expirydate, empresa,telefone,cnpj, confirmar_senha } = request.body;

    db.query("select id,'TENTATIVA_Registrar_usuario', nome, email from usuarios where ?  ",{email}, async (error,results)=>{ 

        if (results.length > 0)
        {
            return response.status(400).json({err:[{msg: "Email já cadastrado!"}]});
        }
        else
        {
            let hashedPassword = await bcrypt.hash(senha, 8);

            db.query('insert into usuarios set ?',{
                nome,
                email,
                senha: hashedPassword,
                status,
                expirydate,
                empresa,
                cnpj,
                telefone
            }, (error, results) =>{
                if (error)
                {
                    return response.status(400).json({err:[{msg: "Erro na tentativa de registrar!"}]});
                }
                else
                {
                    let id  = results.insertId;
                    const token = jwt.sign( {id,nome,email}, "SECRETps$&&**956", {
                    
                    });
                    return response.json({"token": token});

                }
            })
        }

    });

}

exports.validar = async (request, response) =>{

    try {
        const { id, email } = request.user;

        db.query('select id,nome,email from usuarios where ?', { id }, async ( error, results)=>{

            if (error) 
            {
                return response.status(401).json({err:[{msg: "Dados de login incorretos, tente novamente!"}]});
             
            }
            else if (!results)
            {
                return response.status(401).json({err:[{msg: "Dados de login incorretos, tente novamente!"}]});
             
            }
            else if (results.length == 0)
            {
                return response.status(401).json({err:[{msg: "Dados de login incorretos, tente novamente!"}]});
             
            }
            else
            {
                db.query(`insert into usuarios_log set ? , tipo_login = 'sucesso' `, { email }), //insere uma linha toda vez que um usuario logar no sistema.
                db.query('update usuarios set lastlogin = CURRENT_TIMESTAMP() where ? ', { email }), //update lastlogin na tabela usuarios
                response.json(results);
                console.log('LOGIN:',email);
            }
        })

        

        
    } catch (error) {
        console.log(error);
        response.sendStatus(500).send('Erro no servidor de BD');
    }
}
