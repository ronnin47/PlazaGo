import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { AppContext } from '../provider/AppProvider';
import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

const fondoPantallaHome2="https://res.cloudinary.com/dzul1hatw/image/upload/v1783265518/7973bffd122cde7508ca6ff036f2d361_ngytjz.jpg"
const fondoPantallaHome3="https://res.cloudinary.com/dzul1hatw/image/upload/v1783266417/94d1773e907d13b8eefabbc9f6d3886b_sttwfp.jpg"
const fondoPantallaHome="https://res.cloudinary.com/dzul1hatw/image/upload/v1783265576/a22a86261522a0eba143da53278e5075_nnyygl.jpg";










export const PantallaHome = () => {
  const { usuario } = useContext(AppContext);

  const navigation = useNavigation();

// vamos a asumir que cuando entra a una receta en ese momento se guarda en el historial de busquedas, y si ya estaba no se repite, y solo se mantiene un maximo de 5 ultimas busquedas
// y eso lo guardamos en el contexto, y lo mostramos en la pantalla de inicio, y si no hay ultimas busquedas mostramos un mensaje que diga "Todavía no realizaste ninguna búsqueda."



  return (


  <ImageBackground
  source={{ uri: fondoPantallaHome2 }}
  style={styles.background}
  imageStyle={{ resizeMode: 'cover', opacity: 0.7  }}
  
>
  {/**/}
  
         <ScrollView
       style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
  
    >
    <Text style={styles.nombreUsuario}>
       {usuario ? `Bienvenido, ${usuario.nombre}` : 'Bienvenido'}
      </Text>
      
      

     

    




      
     

         </ScrollView>

        
  </ImageBackground>
   
  );
};











const styles = StyleSheet.create({

  container: {
    flex: 1,
    //backgroundColor: '#F5F5F5',
    paddingTop: 50,
  },

 background: {
  flex: 1,
},

overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.35)',
},

  nombreUsuario: {
    fontSize: 28,
    fontWeight: 'bold',
    //color: '#222',
    color: '#FFF',
    marginHorizontal: 20,
  },

  input: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    //color: '#222',
    color: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  listaHorizontal: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  textoVacio: {
    marginHorizontal: 20,
    marginBottom: 25,
    color: '#eb9f14',
    fontSize: 15,
  },

  card: {
    width: 220,
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 16,
    elevation: 5,
  },

  cardImage: {
    width: '100%',
    height: 140,
  },

  cardInfo: {
    padding: 12,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  cardDescripcion: {
    marginTop: 6,
    fontSize: 14,
    color: '#777',
  },

  cardBoton: {
    marginTop: 10,
    color: '#FF6B35',
    fontWeight: 'bold',
    fontSize: 14,
  },

});