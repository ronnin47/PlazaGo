
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';

import { AppContext } from '../provider/AppProvider';

export const PantallaConfiguracion = () => {

  const { usuario, cerrarSesion } = useContext(AppContext);

  const fondoPantallaConfiguracion =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

  return (
    <ImageBackground
      source={{ uri: fondoPantallaConfiguracion }}
      style={styles.background}
      imageStyle={styles.imagenFondo}
    >

      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.titulo}>Configuración</Text>
        <Text style={styles.subtitulo}>
          Administrá tu cuenta de PlazaGo
        </Text>

        {/* MI CUENTA */}
        <View style={styles.tarjeta}>

          <View style={styles.encabezadoTarjeta}>
            <View style={styles.iconoContenedor}>
              <Text style={styles.icono}>👤</Text>
            </View>

            <View style={styles.encabezadoTexto}>
              <Text style={styles.etiqueta}>MI CUENTA</Text>
              <Text style={styles.nombreUsuario}>
                {usuario ? usuario.nombre : 'Usuario'}
              </Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.dato}>
            <Text style={styles.datoEtiqueta}>Nombre</Text>
            <Text style={styles.datoValor}>
              {usuario?.nombre || '-'}
            </Text>
          </View>

          <View style={styles.dato}>
            <Text style={styles.datoEtiqueta}>Apellido</Text>
            <Text style={styles.datoValor}>
              {usuario?.apellido || '-'}
            </Text>
          </View>

          <View style={styles.dato}>
            <Text style={styles.datoEtiqueta}>Correo electrónico</Text>
            <Text style={styles.datoValor}>
              {usuario?.email || '-'}
            </Text>
          </View>

          <View style={styles.dato}>
            <Text style={styles.datoEtiqueta}>Tipo de cuenta</Text>
            <Text style={styles.rol}>
              {usuario?.rol || 'usuario'}
            </Text>
          </View>

        </View>

        {/* ACERCA DE PLAZAGO */}
        <View style={styles.tarjetaAplicacion}>

       <View style={styles.filaAplicacion}>

  <Image
    source={require('../Assets/leo1.png')}
    style={styles.imagenLeo}
    resizeMode="contain"
  />

  <View style={styles.infoAplicacion}>
    <Text style={styles.nombreAplicacion}>
      Acerca de PlazaGo
    </Text>

    <Text style={styles.descripcionAplicacion}>
      Un espacio para descubrir, compartir y disfrutar
      de nuestra comunidad.
    </Text>
  </View>

</View>

          <View style={styles.version}>
            <Text style={styles.textoVersion}>
              PlazaGo · Versión 1.0
            </Text>
          </View>

        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity
          style={styles.botonCerrarSesion}
          onPress={cerrarSesion}
          activeOpacity={0.8}
        >
          <Text style={styles.iconoCerrar}>↪</Text>

          <Text style={styles.textoCerrarSesion}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

        <Text style={styles.pie}>
          PlazaGo San Martín
        </Text>

      </ScrollView>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  imagenFondo: {
    resizeMode: 'cover',
    opacity: 0.75,
  },

  scroll: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#26382A',
  },

  subtitulo: {
    fontSize: 14,
    color: '#596653',
    marginTop: 5,
    marginBottom: 25,
  },

  tarjeta: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 17,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D9B95B',
    marginBottom: 16,

    elevation: 3,
    shadowColor: '#26382A',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  encabezadoTarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  iconoContenedor: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#E8EDDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  icono: {
    fontSize: 24,
  },

  encabezadoTexto: {
    flex: 1,
  },

  etiqueta: {
    color: '#8A7945',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },

  nombreUsuario: {
    color: '#26382A',
    fontSize: 19,
    fontWeight: 'bold',
  },

  divisor: {
    height: 1,
    backgroundColor: '#E6E4D9',
    marginBottom: 15,
  },

  dato: {
    marginBottom: 13,
  },

  datoEtiqueta: {
    color: '#858A7E',
    fontSize: 12,
    marginBottom: 3,
  },

  datoValor: {
    color: '#30382F',
    fontSize: 15,
    fontWeight: '500',
  },

  rol: {
    color: '#527044',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  tarjetaAplicacion: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 17,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D9B95B',
  },

  filaAplicacion: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconoAplicacion: {
    fontSize: 27,
    marginRight: 13,
  },

  infoAplicacion: {
    flex: 1,
  },

  nombreAplicacion: {
    color: '#26382A',
    fontSize: 16,
    fontWeight: 'bold',
  },

  descripcionAplicacion: {
    color: '#74796F',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  version: {
    borderTopWidth: 1,
    borderTopColor: '#E6E4D9',
    marginTop: 15,
    paddingTop: 12,
  },

  textoVersion: {
    color: '#8A7945',
    fontSize: 12,
    fontWeight: '600',
  },

  botonCerrarSesion: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9E9E5',
    borderWidth: 1,
    borderColor: '#D99A8F',
    borderRadius: 13,
    paddingVertical: 14,
    marginTop: 22,
  },

  iconoCerrar: {
    color: '#B64C3F',
    fontSize: 20,
    marginRight: 9,
  },

  textoCerrarSesion: {
    color: '#B64C3F',
    fontSize: 15,
    fontWeight: 'bold',
  },

  pie: {
    textAlign: 'center',
    color: '#596653',
    fontSize: 12,
    marginTop: 25,
    marginBottom: 20,
    fontWeight: '600',
  },
  imagenLeo: {
  width: 85,
  height: 85,
  marginRight: 14,
},

});
