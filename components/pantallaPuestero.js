
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AppContext } from '../provider/AppProvider';
import API_URL from '../config/apiConfig';
import axios from 'axios';

import { PantallaCargarMiPuesto } from './pantallaCargarMiPuesto';
import { PantallaMiPuesto } from './pantallaMiPuesto';

 const fondoPantallaConfiguracion =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

 

export const PantallaPuestero = () => {
  const { usuario } = useContext(AppContext);

 const [puesto, setPuesto] = useState(null);
const [cargando, setCargando] = useState(true);

 
useEffect(()=>{
consumirMiPuesto();
},[])



 const consumirMiPuesto= async ()=>{

           try {
  const response = await axios.get(`${API_URL}/MiPuesto`, {
    params: {
      id_usuario: usuario.id_usuario,
    },
  });

  
    setPuesto(response.data.puesto);



  console.log(response.data);
  
  setCargando(false)

} catch (error) {
  console.log("Error al consumir mi puesto:", error);
}
 }







  return (
    <ImageBackground
      source={{ uri: fondoPantallaConfiguracion }}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover', opacity: 0.4 }}
    >
      <View style={styles.capaFondo}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >


     {cargando ? (
  <ActivityIndicator size="large" color="#33452D" />
) : puesto ? (
  <PantallaMiPuesto puesto={puesto}/>
) : (
  <PantallaCargarMiPuesto />
)}


        
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  capaFondo: {
    flex: 1,
    backgroundColor: 'rgba(244, 247, 238, 0.82)',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },

  encabezado: {
    marginBottom: 22,
  },

  indicadorSeccion: {
    width: 34,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#A5B878',
    marginBottom: 12,
  },

  etiqueta: {
    color: '#668044',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },

  titulo: {
    fontSize: 29,
    fontWeight: '800',
    color: '#263323',
  },

  subtitulo: {
    fontSize: 14,
    color: '#66715F',
    marginTop: 7,
    lineHeight: 21,
  },

  tarjetaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 25,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#E8EDD9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarTexto: {
    fontSize: 23,
  },

  datosUsuario: {
    flex: 1,
  },

  nombreUsuario: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263323',
  },

  textoUsuario: {
    fontSize: 12,
    color: '#7A8175',
    marginTop: 4,
  },

  estado: {
    backgroundColor: '#EEF1E5',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 8,
  },

  estadoTexto: {
    fontSize: 8,
    fontWeight: '800',
    color: '#627A42',
    letterSpacing: 0.5,
  },

  seccion: {
    backgroundColor: 'rgba(255,255,255,0.91)',
    borderRadius: 19,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 18,
  },

  encabezadoSeccion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 19,
  },

  numeroSeccion: {
    color: '#B79A4D',
    fontSize: 14,
    fontWeight: '900',
    marginRight: 12,
    marginTop: 2,
  },

  flex: {
    flex: 1,
  },

  tituloSeccion: {
    fontSize: 19,
    fontWeight: '800',
    color: '#293626',
  },

  descripcionSeccion: {
    fontSize: 12,
    color: '#7A8175',
    lineHeight: 18,
    marginTop: 5,
  },

  tarjetaImagen: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E7D9',
    borderRadius: 13,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#FAFBF7',
  },

  vistaImagen: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#E8EDD9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },

  vistaImagenPrincipal: {
    width: 92,
    height: 92,
  },

  imagen: {
    width: '100%',
    height: '100%',
  },

  iconoImagen: {
    fontSize: 29,
  },

  contenidoImagen: {
    flex: 1,
  },

  tituloImagen: {
    color: '#35462D',
    fontSize: 14,
    fontWeight: '800',
  },

  descripcionImagen: {
    color: '#7A8175',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
  },

  inputImagen: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 8,
    fontSize: 11,
    color: '#293626',
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#56664A',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  campo: {
    marginTop: 15,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
    color: '#293626',
  },

  inputMultilinea: {
    minHeight: 115,
    textAlignVertical: 'top',
  },

  listaTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },

  chipTipo: {
    borderWidth: 1,
    borderColor: '#DDE3D4',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  chipTipoActivo: {
    backgroundColor: '#33452D',
    borderColor: '#33452D',
  },

  textoChip: {
    color: '#58644F',
    fontSize: 12,
    fontWeight: '700',
  },

  textoChipActivo: {
    color: '#F0DDA7',
  },

  filaReferente: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  numeroReferente: {
    width: 31,
    height: 39,
    borderRadius: 9,
    backgroundColor: '#EEF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  numeroReferenteTexto: {
    color: '#627A42',
    fontWeight: '800',
    fontSize: 13,
  },

  inputReferente: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#293626',
    fontSize: 13,
  },

  botonEliminar: {
    width: 34,
    height: 39,
    marginLeft: 7,
    borderRadius: 9,
    backgroundColor: '#F7E9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoEliminar: {
    color: '#9C4239',
    fontSize: 23,
  },

  botonAgregar: {
    alignSelf: 'flex-start',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: '#EEF1E5',
    marginTop: 3,
  },

  textoAgregar: {
    color: '#526A3B',
    fontSize: 12,
    fontWeight: '800',
  },

  contador: {
    textAlign: 'right',
    color: '#8A9181',
    fontSize: 10,
    marginTop: 6,
  },

  filaRed: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },

  iconoRed: {
    width: 30,
    fontSize: 22,
    fontWeight: '800',
    color: '#627A42',
  },

  inputRed: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 13,
    color: '#293626',
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF1E5',
    padding: 13,
    borderRadius: 11,
    marginTop: 2,
  },

  avisoIcono: {
    fontSize: 16,
    color: '#788A51',
    marginRight: 9,
  },

  avisoTexto: {
    flex: 1,
    color: '#56664A',
    fontSize: 12,
    lineHeight: 18,
  },

  botonGuardar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#33452D',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 13,
    marginTop: 20,
    minHeight: 53,
  },

  botonDeshabilitado: {
    opacity: 0.65,
  },

  textoGuardar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  flechaGuardar: {
    color: '#E7D39A',
    fontSize: 22,
    marginLeft: 12,
  },

  pie: {
    textAlign: 'center',
    color: '#89917F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 22,
  },
});
