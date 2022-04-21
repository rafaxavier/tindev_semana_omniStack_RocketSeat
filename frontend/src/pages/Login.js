import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './Login.css';

import api from '../services/api';
import logo from '../assets/tindev.svg';

export default function Login(){
    const navigate = useNavigate();
    const [ username, setUsername ] = useState('');   

    async function handleSubmit(e){
        e.preventDefault();
        
        const response =  await api.post('/devs', {
            username: username
        });
        console.log(response);
        const id = response.data._id;
        if (id !== '') {
            // redirect
            navigate(`/devs/${id}`);
        }
    }

    return(
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input placeholder="Digite seu usuário do github"
                    value={ username } 
                    onChange={ e => setUsername(e.target.value) }
                />
                <button type='submit'>Enviar</button>
            </form>
        </div>
    );
}