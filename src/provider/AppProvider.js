import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();



export const AppProvider = ({ children }) => {


const [usuario, setUsuario] = useState('');
const [loading, setLoading] = useState(true);
const [logueado, setLogueado] = useState(false);

useEffect(() => {
  const recuperarSesion = async () => {
    try {
      const sesion = await AsyncStorage.getItem('sesionUsuario');

      if (sesion !== null) {
        const datosUsuario = JSON.parse(sesion);

        setUsuario(datosUsuario);
        setLogueado(true);
      } else {
        setLogueado(false);
      }
    } catch (error) {
      console.log('Error al recuperar la sesión:', error);
      setLogueado(false);
    } finally {
      setLoading(false);
    }
  };

  recuperarSesion();
}, []);




const cerrarSesion = async () => {
try {
await AsyncStorage.removeItem('sesionUsuario');
setUsuario('');
setLogueado(false);
} catch (error) {
console.log('Error al cerrar sesión:', error);
}
};

    return (
            <AppContext.Provider value={{ 
                usuario, 
                setUsuario, 
                loading, 
                setLoading, 
                logueado,
                setLogueado,  
                cerrarSesion,            
                }}>

            {children}

            </AppContext.Provider>
    )

};