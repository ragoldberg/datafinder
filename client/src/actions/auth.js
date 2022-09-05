import axios from "axios";
import  {setAlert}  from "./alert";
import { LGPD,REGISTER_SUCCESS , REGISTER_FAIL, REGISTER_TRIAL_SUCCESS , REGISTER_TRIAL_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, DETALHE_OUT, DADOS_OUT, DADOS_SOCIOS_OUT } from "./types";
//import setAuthToken from "../utils/setAuthToken";


// Carregar usuário
export const loadUser = () => async dispatch => {

    // if (localStorage.token)
    // {
    //     setAuthToken(localStorage.token);
    // }

    try
    {
        const res = await axios.get('/auth');
        //console.log(res);

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    }
    catch(err)
    {
        dispatch({
            type: AUTH_ERROR
        })
    }

}


// Async pelo Banco
export const register = ({nome, email, senha, status, expirydate,empresa,telefone}) => async dispatch => {

    const config = {
                    headers : {
                                "Content-Type" : "application/json"
                            }
                    }

    const body = JSON.stringify({ nome, email, senha, status,expirydate,empresa,telefone });

    try{
        const res = await axios.post('/auth/registrar',body,config);


        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

       dispatch(setAlert("Cadastro Efetuado com sucesso", 'danger'));

        //dispatch(loadUser());

    }
    catch(err)
    {

        const errors  = err.response.data.err;

        if (errors)
        {
            errors.forEach(error => dispatch (
                setAlert(error.msg, 'danger')
            ));

            errors.forEach(erro =>
                {
                    console.log(erro.msg);
                })
        }

        

        dispatch({
            type: REGISTER_FAIL
        })



    }

}
export const REGISTER_LGPD = ({nome, email, senha, telefone,cnpj}) => async dispatch => {

    const config = {
                    headers : {
                                "Content-Type" : "application/json"
                            }
                    }

    const body = JSON.stringify({ nome, email, senha, telefone,cnpj });

    try{
        const res = await axios.post('/auth/lgpd',body,config);


        dispatch({
            type: LGPD,
            payload: res.data
        })

       dispatch(setAlert("Cadastro Efetuado com sucesso", 'danger'));

        //dispatch(loadUser());

    }
    catch(err)
    {

        const errors  = err.response.data.err;

        if (errors)
        {
            errors.forEach(error => dispatch (
                setAlert(error.msg, 'danger')
            ));

            errors.forEach(erro =>
                {
                    console.log(erro.msg);
                })
        }

        

        dispatch({
            type: LGPD
        })



    }

}






// Async pelo Banco
export const REGISTER_TRIAL = ({nome, email, senha, status, expirydate,empresa,telefone,cnpj}) => async dispatch => {

    const config = {
                    headers : {
                                "Content-Type" : "application/json"
                            }
                    }

    const body = JSON.stringify({ nome, email, senha, status,expirydate,empresa,telefone,cnpj });

    try{
        const res = await axios.post('/auth/trial',body,config);


        dispatch({
            type: REGISTER_TRIAL_SUCCESS,
            payload: res.data
        })

       dispatch(setAlert("Cadastro Efetuado com sucesso", 'danger'));

        //dispatch(loadUser());

    }
    catch(err)
    {

        const errors  = err.response.data.err;

        if (errors)
        {
            errors.forEach(error => dispatch (
                setAlert(error.msg, 'danger')
            ));

            errors.forEach(erro =>
                {
                    console.log(erro.msg);
                })
        }

        

        dispatch({
            type: REGISTER_TRIAL_FAIL
        })



    }

}

// Login

export const login = (email, senha) => async dispatch => {

    const config = {
                    headers : {
                                "Content-Type" : "application/json"
                            }
                    }

    const body = JSON.stringify({ email, senha });

    try{
        const res = await axios.post('/auth/login',body,config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        
        dispatch(loadUser());
        
    }
    catch(err)
    {

        console.log(err);
        const errors  = err.response.data.err;
        

        if (errors)
        {
            errors.forEach(error => dispatch (
                setAlert(error.msg, 'danger')
            ));

            errors.forEach(erro =>
                {
                    console.log(erro.msg);
                })
        }

        
       
        dispatch({
            type: LOGIN_FAIL
        })



    }

}


// LOGOUT

export const logout = () => dispatch => {

        dispatch({
            type: LOGOUT
        })

        dispatch({
            type: DETALHE_OUT
        })

        dispatch({
            type: DADOS_OUT
        })

        dispatch({
            type: DADOS_SOCIOS_OUT
        })


}