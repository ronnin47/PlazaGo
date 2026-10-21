
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
} from 'react-native';
import { AppContext } from '../provider/AppProvider';

export const PantallaMisPuestos = () => {

  const { usuario } = useContext(AppContext);


  const fondoPantallaConfiguracion =
    "https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png";


 


  return (

    <ImageBackground
      source={{ uri: fondoPantallaConfiguracion }}
      style={styles.background}
      imageStyle={{
        resizeMode: 'cover',
        opacity: 0.4
      }}
    >

      <View style={styles.container}> 

        <Text style={styles.titulo}>Mis Puestos</Text>
      </View>





    </ImageBackground>

  );
};


const styles = StyleSheet.create({

  background:{
    flex:1,
  },


  container:{
    flex:1,
    padding:20,
    backgroundColor:'rgba(255,255,255,0.35)',
  },


  titulo:{
    fontSize:30,
    fontWeight:'bold',
    color:'#222',
    marginBottom:25,
    textAlign:'center',
  },


  opcion:{
    backgroundColor:'rgba(255,255,255,0.92)',
    borderRadius:14,
    paddingVertical:18,
    paddingHorizontal:18,
    marginBottom:15,

    elevation:4,

    shadowColor:'#000',
    shadowOpacity:0.15,
    shadowRadius:5,
    shadowOffset:{
      width:0,
      height:2,
    },
  },


  textoOpcion:{
    fontSize:18,
    color:'#333',
    fontWeight:'500',
  },


  info:{
    marginTop:'auto',
    marginBottom:20,
    alignItems:'center',
  },


  version:{
    fontSize:15,
    color:'#555',
    backgroundColor:'rgba(255,255,255,0.8)',
    paddingHorizontal:15,
    paddingVertical:8,
    borderRadius:20,
  },


  modalFondo:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },


  modalCaja:{
    width:'85%',
    backgroundColor:'white',
    borderRadius:15,
    padding:20,
  },


  modalTitulo:{
    fontSize:22,
    fontWeight:'bold',
    marginBottom:20,
  },


  input:{
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:10,
    padding:12,
    fontSize:16,
  },


  botones:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginTop:20,
  },


  botonCancelar:{
    padding:12,
    marginRight:10,
  },


  botonGuardar:{
    backgroundColor:'#333',
    padding:12,
    borderRadius:10,
  },

});


