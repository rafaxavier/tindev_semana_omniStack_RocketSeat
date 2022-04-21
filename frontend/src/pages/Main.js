import React, { useEffect , useState} from 'react';
import io from 'socket.io-client';
import { useParams, Link} from 'react-router-dom';
import './Main.css';

import api from '../services/api'; 
import logo from '../assets/tindev.svg';
import itsamatch from '../assets/itsamatch.png';

export  default function Main(){
    const [users, setUsers] = useState([]);
    const [match, setMatch] = useState(null);
    //pega o id do usuario logado passado como parametro na uri
    const {id} =  useParams();

    /* useEffect, sempre que o val de id for alterado será 
    chamado a func loadUser para carregar os devs*/
    //fazendo a chama para api
    useEffect(()=> {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers:{
                    user: id
                }
            })
            setUsers(response.data);
        }
        //chamada da func
        loadUsers();
    }, [id]);

    // se conecta ao websocket
    useEffect(()=> {
        // conecta ao ip do back-end 
        const socket = io('http://localhost:3333',{
            query:{ user: id }
        });

        socket.on('match', dev =>{
            setMatch(dev);
            console.log(dev);
        });

        /**TESTES */
        // socket.on('msg', message=>{console.log(message); });

        // setTimeout(()=>{
        //     socket.emit('hello',{
        //         message: 'Hello World',
        //     })
        // },3000);

    }, [id]);

    async function handleDislike(userID){
        api.post(`/devs/${userID}/dislikes`, null, {
            headers: { user: id }
        });
        //altera o estado da var users atraves do setUsers
        setUsers(users.filter(user=> user._id !== userID));
        console.log('dislike',userID);
    }

    async function handleLike(userID){
        api.post(`/devs/${userID}/likes`, null, {
            headers: { user: id }
        });
        setUsers(users.filter(user=> user._id !== userID));
        console.log('like',userID);
    }

    return(
        <div className='main-container'>
            <Link to={'/'}>
                <img src={logo} alt='tindev' /> 
            </Link>

            {/* caso tenha devs q não ganhou deslike e like lista-los */}
            {users.length > 0 ? 
            (
                <ul>
                    {users.map(user => (
                    // qundo usar o map passar a ref única p/ 1° elemento usando prop chamada "key=ID"  
                    <li key={user._id}> 
                    <img src={user.avatar} alt={user.name} />
                        <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                        </footer>

                        <div className='buttons'>
                            <button type='button' onClick={ ()=>handleDislike(user._id)}>
                                <img src="https://img.icons8.com/fluency/48/000000/multiply.png" alt='deslike' /> 
                            </button>
                            <button type='button' onClick={ ()=>handleLike(user._id)}>
                                <img src="https://img.icons8.com/color/48/000000/filled-like.png" alt='like' /> 
                            </button>
                        </div>
                    </li>
                    ))}
                </ul> 
            ) : (

            // caso não aparece mais devs
            <div className='empty'> Acabou !</div>
                    
            )}

            { match && (
                <div className='match-container'>
                    <img className='itsamatch' src={itsamatch} alt="It's a Match!" />
                    
                    <img className='avatar' src={match.avatar} alt="It's a Match!" />
                    <strong>{match.name}</strong>
                    <p>{match.bio}</p>
                    
                    <button onClick={()=>setMatch(null)} type='button'>Fechar</button>
                </div>
            )}
            
        </div>
       
    );
}