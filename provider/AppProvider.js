import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();



export const AppProvider = ({ children }) => {


const [usuario, setUsuario] = useState('');
const [loading, setLoading] = useState(true);




    return (
            <AppContext.Provider value={{ 
                usuario, 
                setUsuario, 
                loading, 
                setLoading,               
                }}>

            {children}

            </AppContext.Provider>
    )

};