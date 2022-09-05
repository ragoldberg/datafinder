const jwt = require("jsonwebtoken");


module.exports = function (request,response, next){

    // token do cabeçalho

    const token = request.header('x-auth-token');
    //console.log("TOKEN " + token);

    if (!token)
    {
        return response.status(401).json({ msg: "Autorização de acesso negada!" + request.originalUrl});
        //return response.redirect('/');
    }

    // validar

    try {

        const decoded = jwt.verify(token,"SECRETps$&&**956");
        if (! decoded )
        {
            return response.status(401).json({msg: "Token de acesso inválido!"});
        }
        request.user = decoded;
        next();

        
    } catch (error) {
        return response.status(401).json({msg: "Token de acesso inválido!"});
    }


}