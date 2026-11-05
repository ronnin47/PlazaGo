
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AppContext } from '../provider/AppProvider';
import { useNavigation } from '@react-navigation/native';
import API_URL from '../config/apiConfig';

import { Ionicons } from '@expo/vector-icons';

export const PantallaAdministrador = () => {
  const { usuario, cerrarSesion } = useContext(AppContext);
  const navigation = useNavigation();

  const [ferias, setFerias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fondoPantallaConfiguracion =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

  const obtenerFerias = async () => {
    if (!usuario?.id_usuario) {
      setFerias([]);
      setCargando(false);
      return;
    }

    try {
      setCargando(true);

      const respuesta = await axios.get(
        `${API_URL}/obtenerFerias`,
        { timeout: 15000 }
      );

      const datos = respuesta.data;

      //console.log('¿Es un array?', Array.isArray(datos));
      //console.log('Contenido:', datos);






      if (Array.isArray(datos)) {
        setFerias(datos);
      }else {
        setFerias([]);
      }
      
    } catch (error) {
      console.error(
        'Error al obtener las ferias:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        'No se pudieron cargar las ferias registradas.'
      );
    } finally {
      setCargando(false);
    }
  };



/*
  useEffect(() => {
    obtenerFerias();
  }, []);
*/
useFocusEffect(
  useCallback(() => {
    obtenerFerias();
  }, [])
);
  

/*
  useEffect(() => {
    
    const mostrarFerias=()=>{
   
      ferias.map((feria)=>{
        console.log(`
          ${feria.nombre}
          ${feria.descripcion}
          ${feria.imagen_url}
          `)
      })

    }

      mostrarFerias();


  }, [ferias]);
*/
  const formatearFechaFeria = (fecha) => {
    if (!fecha) return 'Fecha no disponible';

    const fechaObjeto = new Date(
      String(fecha).replace(' ', 'T')
    );

    if (isNaN(fechaObjeto.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaObjeto.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const abrirCargaFeria = () => {
    navigation.navigate('PantallaCargarNuevaFeria');
  };







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
        >
          {/* ENCABEZADO */}
          <View style={styles.encabezado}>
            <View>
              <Text style={styles.etiqueta}>PLAZA GO</Text>
              <Text style={styles.titulo}>Administración</Text>
              <Text style={styles.subtitulo}>
                Gestioná las ferias de la comunidad.
              </Text>
            </View>

            <View style={styles.iconoAdmin}>
              <Text style={styles.iconoAdminTexto}>⚙</Text>
            </View>
          </View>

          {/* ADMINISTRADOR */}
          <View style={styles.tarjetaUsuario}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {usuario?.nombre
                  ? usuario.nombre.charAt(0).toUpperCase()
                  : 'A'}
              </Text>
            </View>

            <View style={styles.datosUsuario}>
              <Text style={styles.nombreUsuario}>
                {usuario?.nombre || 'Administrador'}
              </Text>

              <Text style={styles.emailUsuario}>
                {usuario?.email || 'Sin email'}
              </Text>

              <Text style={styles.rolUsuario}>
                ADMINISTRADOR
              </Text>
            </View>
          </View>

          {/* FERIAS REGISTRADAS */}
          <View style={styles.encabezadoFerias}>
            <View style={styles.encabezadoTextoFerias}>
              <Text style={styles.tituloSeccion}>
                Ferias registradas
              </Text>

              <Text style={styles.subtituloFerias}>
                Administrá las ferias que cargaste.
              </Text>
            </View>

            <View style={styles.contadorFerias}>
              <Text style={styles.textoContadorFerias}>
                {ferias.length}
              </Text>
            </View>
          </View>

          {cargando ? (
            <View style={styles.estadoFerias}>
              <ActivityIndicator
                size="large"
                color="#D9B95B"
              />
              <Text style={styles.textoEstadoFerias}>
                Cargando ferias...
              </Text>
            </View>
          ) : ferias.length === 0 ? (
            <View style={styles.estadoFerias}>
              <Text style={styles.iconoSinFerias}>▤</Text>

              <Text style={styles.tituloSinFerias}>
                Todavía no hay ferias
              </Text>

              <Text style={styles.textoEstadoFerias}>
                Cuando cargues una feria, aparecerá en esta sección.
              </Text>
            </View>
          ) : (
           ferias.map((feria, index) => (
                <TouchableOpacity
                  key={feria.id_feria || index}
                  style={styles.tarjetaFeria}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('PantallaRegistrarPuestos', {
                      feria: feria,
                    })
                  }
                >
                  {feria.imagen_url ? (
                    <Image
                      source={{ uri: feria.imagen_url }}
                      style={styles.imagenFeria}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagenFeriaVacia}>
                      <Text style={styles.iconoImagenFeria}>▤</Text>
                    </View>
                  )}

                  <View style={styles.contenidoFeria}>
                    <Text style={styles.nombreFeria}>
                      {feria.nombre || 'Feria sin nombre'}
                    </Text>

                    <Text style={styles.descripcionFeria}>
                      {feria.descripcion ||
                        'Sin descripción disponible.'}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons
                        name="location-sharp"
                        size={16}
                        color="#804d44"
                      />
                      <Text style={styles.datoFeria}>
                        {feria.ubicacion || 'Ubicación no disponible'}
                      </Text>
                    </View>

                    <Text style={styles.datoFeria}>
                      Inicio: {formatearFechaFeria(feria.fecha_inicio)}
                    </Text>

                    <Text style={styles.datoFeria}>
                      Fin: {formatearFechaFeria(feria.fecha_fin)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
          )}

          {/* CARGAR NUEVA FERIA */}
          <View style={styles.seccionNuevaFeria}>
            <Text style={styles.tituloSeccion}>
              ¿Querés organizar otra feria?
            </Text>

            <TouchableOpacity
              style={styles.tarjetaCrear}
              activeOpacity={0.85}
              onPress={abrirCargaFeria}
            >
              <View style={styles.iconoCrear}>
                <Text style={styles.iconoCrearTexto}>＋</Text>
              </View>

              <View style={styles.contenidoCrear}>
                <Text style={styles.tituloTarjeta}>
                  Cargar nueva feria
                </Text>

                <Text style={styles.descripcionTarjeta}>
                  Registrá una nueva feria con sus fechas y ubicación.
                </Text>

                <View style={styles.etiquetaAccion}>
                  <Text style={styles.textoAccion}>
                    NUEVA FERIA
                  </Text>

                  <Text style={styles.flecha}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>


          {/* SOLICITUDES DE PUESTEROS */}
<TouchableOpacity
  style={styles.tarjetaSolicitudes}
  activeOpacity={0.85}
  onPress={() => navigation.navigate('PantallaAdminSolicitudesPuestero')}
>
  <View style={styles.iconoSolicitudes}>
    <Ionicons
      name="people-outline"
      size={26}
      color="#E7D39A"
    />
  </View>

  <View style={styles.contenidoSolicitudes}>
    <Text style={styles.tituloSolicitudes}>
      Solicitudes de puesteros
    </Text>

    <Text style={styles.descripcionSolicitudes}>
      Revisá los datos de los usuarios que quieren incorporarse
      como puesteros a PlazaGo.
    </Text>

    <View style={styles.etiquetaSolicitudes}>
      <Text style={styles.textoEtiquetaSolicitudes}>
        REVISAR SOLICITUDES
      </Text>

      <Ionicons
        name="arrow-forward"
        size={15}
        color="#FFD54F"
      />
    </View>
  </View>
</TouchableOpacity>

     
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
    backgroundColor: 'rgba(244, 247, 238, 0.72)',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 35,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },

  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  etiqueta: {
    color: '#668044',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },

  titulo: {
    fontSize: 29,
    fontWeight: '800',
    color: '#263323',
  },

  subtitulo: {
    fontSize: 14,
    color: '#66715F',
    marginTop: 5,
  },

  iconoAdmin: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#33452D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconoAdminTexto: {
    fontSize: 25,
    color: '#E7D39A',
  },

  tarjetaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(102, 128, 68, 0.2)',
    borderRadius: 18,
    padding: 16,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#33452D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTexto: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#E7D39A',
  },

  datosUsuario: {
    flex: 1,
    marginLeft: 14,
  },

  nombreUsuario: {
    color: '#263323',
    fontSize: 17,
    fontWeight: 'bold',
  },

  emailUsuario: {
    color: '#66715F',
    fontSize: 13,
    marginTop: 3,
  },

  rolUsuario: {
    color: '#668044',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
  },

  encabezadoFerias: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14,
  },

  encabezadoTextoFerias: {
    flex: 1,
    marginRight: 12,
  },

  tituloSeccion: {
    color: '#263323',
    fontSize: 20,
    fontWeight: '800',
  },

  subtituloFerias: {
    color: '#66715F',
    fontSize: 13,
    marginTop: 4,
  },

  contadorFerias: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#33452D',
    borderWidth: 1,
    borderColor: '#D9B95B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoContadorFerias: {
    color: '#FFD54F',
    fontSize: 15,
    fontWeight: 'bold',
  },

  estadoFerias: {
    backgroundColor: 'rgba(20, 29, 23, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.25)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },

  textoEstadoFerias: {
    color: '#D0D2C9',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  iconoSinFerias: {
    color: '#D9B95B',
    fontSize: 30,
  },

  tituloSinFerias: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  tarjetaFeria: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 29, 23, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.25)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },

  imagenFeria: {
    width: 94,
    minHeight: 115,
    borderRadius: 10,
    backgroundColor: '#26352A',
  },

  imagenFeriaVacia: {
    width: 94,
    minHeight: 115,
    borderRadius: 10,
    backgroundColor: '#26352A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconoImagenFeria: {
    color: '#D9B95B',
    fontSize: 28,
  },

  contenidoFeria: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  nombreFeria: {
    color: '#FFD54F',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  descripcionFeria: {
    color: '#D0D2C9',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },

  datoFeria: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 18,
  },

  seccionNuevaFeria: {
    marginTop: 18,
  },

  tarjetaCrear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(102, 128, 68, 0.3)',
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },

  iconoCrear: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#33452D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconoCrearTexto: {
    fontSize: 30,
    color: '#E7D39A',
    lineHeight: 34,
  },

  contenidoCrear: {
    flex: 1,
    marginLeft: 14,
  },

  tituloTarjeta: {
    color: '#263323',
    fontSize: 16,
    fontWeight: '800',
  },

  descripcionTarjeta: {
    color: '#66715F',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  etiquetaAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 128, 68, 0.12)',
  },

  textoAccion: {
    color: '#526B37',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  flecha: {
    color: '#526B37',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  botonCerrarSesion: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 128, 68, 0.35)',
  },

  textoCerrarSesion: {
    color: '#526B37',
    fontSize: 14,
    fontWeight: '700',
  },
   tarjetaSolicitudes: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(20, 29, 23, 0.94)',
  borderWidth: 1,
  borderColor: 'rgba(217, 185, 91, 0.3)',
  borderRadius: 16,
  padding: 16,
  marginTop: 18,
},

iconoSolicitudes: {
  width: 50,
  height: 50,
  borderRadius: 15,
  backgroundColor: '#33452D',
  alignItems: 'center',
  justifyContent: 'center',
},

contenidoSolicitudes: {
  flex: 1,
  marginLeft: 14,
},

tituloSolicitudes: {
  color: '#FFD54F',
  fontSize: 16,
  fontWeight: 'bold',
},

descripcionSolicitudes: {
  color: '#D0D2C9',
  fontSize: 12,
  lineHeight: 18,
  marginTop: 5,
},

etiquetaSolicitudes: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: 7,
  marginTop: 10,
  paddingVertical: 6,
  paddingHorizontal: 9,
  borderRadius: 8,
  backgroundColor: 'rgba(217, 185, 91, 0.12)',
},

textoEtiquetaSolicitudes: {
  color: '#FFD54F',
  fontSize: 10,
  fontWeight: '800',
  letterSpacing: 0.7,
},
});
