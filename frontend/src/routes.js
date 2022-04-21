import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

export default function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Login/> } />
                <Route path="/devs/:id" element={ <Main/> } />
            </Routes>
        </BrowserRouter>
    );
}