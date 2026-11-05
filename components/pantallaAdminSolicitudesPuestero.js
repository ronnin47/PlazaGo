import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../config/apiConfig';

export const PantallaAdminSolicitudesPuestero = () => {
  const navigation = useNavigation();

  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const fondo =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

  // OBTENER SOLICITUDES
  const obtenerSolicitudes = async () => {
    try {
      setCargando(true);

      const respuesta = await axios.get(
        `${API_URL}/obtenerSolicitudesPuestero`,
        { timeout: 15000 }
      );

      const datos = Array.isArray(respuesta.data)
        ? respuesta.data
        : respuesta.data.solicitudes || [];

      setSolicitudes(
        datos.filter(
          solicitud => solicitud.estado_solicitud === 'pendiente'
        )
      );

    } catch (error) {
      console.error(
        'Error al obtener solicitudes:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        'No se pudieron cargar las solicitudes de puesteros.'
      );
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerSolicitudes();
    }, [])
  );

  // ACTUALIZAR ESTADO DE SOLICITUD
  const actualizarSolicitud = async (estado) => {
    if (!solicitudSeleccionada || procesando) return;

    const solicitud = solicitudSeleccionada;

    try {
      setProcesando(true);

      await axios.put(
        `${API_URL}/actualizarEstadoSolicitudPuestero`,
        {
          id_solicitud: solicitud.id_solicitud,
          estado_solicitud: estado,
        },
        { timeout: 15000 }
      );

      setSolicitudes(prev =>
        prev.filter(
          item => item.id_solicitud !== solicitud.id_solicitud
        )
      );

      setSolicitudSeleccionada(null);

      Alert.alert(
        'Solicitud actualizada',
        estado === 'aprobado'
          ? 'El usuario fue aprobado como puestero.'
          : 'La solicitud fue rechazada.'
      );

    } catch (error) {
      console.error(
        'Error al actualizar solicitud:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.mensaje ||
          'No se pudo actualizar la solicitud.'
      );
    } finally {
      setProcesando(false);
    }
  };

  const confirmarDecision = (estado) => {
    Alert.alert(
      estado === 'aprobado' ? 'Aprobar solicitud' : 'Rechazar solicitud',
      estado === 'aprobado'
        ? '¿Confirmás que querés aprobar a este usuario como puestero?'
        : '¿Confirmás que querés rechazar esta solicitud?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: estado === 'aprobado' ? 'Aprobar' : 'Rechazar',
          style: estado === 'aprobado' ? 'default' : 'destructive',
          onPress: () => actualizarSolicitud(estado),
        },
      ]
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';

    const fechaObjeto = new Date(String(fecha).replace(' ', 'T'));

    if (isNaN(fechaObjeto.getTime())) return 'No disponible';

    return fechaObjeto.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ImageBackground
      source={{ uri: fondo }}
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
            <TouchableOpacity
              style={styles.botonVolver}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={23} color="#E7D39A" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.etiqueta}>PLAZA GO</Text>
              <Text style={styles.titulo}>Solicitudes</Text>
              <Text style={styles.subtitulo}>
                Administración de nuevos puesteros.
              </Text>
            </View>
          </View>

          {/* CONTADOR */}
          <View style={styles.encabezadoSeccion}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tituloSeccion}>
                Solicitudes pendientes
              </Text>
              <Text style={styles.subtituloSeccion}>
                Usuarios que quieren convertirse en puesteros.
              </Text>
            </View>

            <View style={styles.contador}>
              <Text style={styles.textoContador}>
                {solicitudes.length}
              </Text>
            </View>
          </View>

          {/* CARGANDO */}
          {cargando ? (
            <View style={styles.estadoVacio}>
              <ActivityIndicator size="large" color="#D9B95B" />
              <Text style={styles.textoVacio}>
                Cargando solicitudes...
              </Text>
            </View>

          ) : solicitudes.length === 0 ? (

            <View style={styles.estadoVacio}>
              <Ionicons
                name="checkmark-circle-outline"
                size={42}
                color="#D9B95B"
              />

              <Text style={styles.tituloVacio}>
                No hay solicitudes pendientes
              </Text>

              <Text style={styles.textoVacio}>
                Cuando un usuario solicite convertirse en puestero,
                aparecerá en esta sección.
              </Text>
            </View>

          ) : (

            solicitudes.map((solicitud) => (
              <TouchableOpacity
                key={solicitud.id_solicitud}
                style={styles.tarjetaSolicitud}
                activeOpacity={0.85}
                onPress={() => setSolicitudSeleccionada(solicitud)}
              >
                <View style={styles.avatar}>
                  <Ionicons
                    name="storefront-outline"
                    size={25}
                    color="#E7D39A"
                  />
                </View>

                <View style={styles.contenidoTarjeta}>
                  <Text style={styles.nombreEmprendimiento}>
                    {solicitud.nombre_emprendimiento}
                  </Text>

                  <Text style={styles.nombreUsuario}>
                    {solicitud.nombre || ''} {solicitud.apellido || ''}
                  </Text>

                  <Text style={styles.email}>
                    {solicitud.email || 'Sin correo disponible'}
                  </Text>

                  <Text style={styles.fecha}>
                    Solicitud: {formatearFecha(solicitud.fecha_solicitud)}
                  </Text>

                  <View style={styles.etiquetaPendiente}>
                    <Text style={styles.textoPendiente}>
                      PENDIENTE
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#D9B95B"
                />
              </TouchableOpacity>
            ))
          )}

          {/* DETALLE DE SOLICITUD */}
          {solicitudSeleccionada && (
            <View style={styles.detalle}>
              <View style={styles.encabezadoDetalle}>
                <Text style={styles.tituloDetalle}>
                  Detalle de solicitud
                </Text>

                <TouchableOpacity
                  onPress={() => setSolicitudSeleccionada(null)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={25}
                    color="#D9B95B"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.etiquetaCampo}>EMPRENDIMIENTO</Text>
              <Text style={styles.valorCampo}>
                {solicitudSeleccionada.nombre_emprendimiento || 'Sin nombre'}
              </Text>

              <Text style={styles.etiquetaCampo}>DESCRIPCIÓN</Text>
              <Text style={styles.valorCampo}>
                {solicitudSeleccionada.descripcion || 'Sin descripción'}
              </Text>

              <View style={styles.divisor} />

              <Text style={styles.etiquetaCampo}>NOMBRE DEL USUARIO</Text>
              <Text style={styles.valorCampo}>
                {solicitudSeleccionada.nombre || 'No disponible'}{' '}
                {solicitudSeleccionada.apellido || ''}
              </Text>

              <Text style={styles.etiquetaCampo}>CORREO ELECTRÓNICO</Text>
              <Text style={styles.valorCampo}>
                {solicitudSeleccionada.email || 'No disponible'}
              </Text>

              <Text style={styles.etiquetaCampo}>TELÉFONO</Text>
              <Text style={styles.valorCampo}>
                {solicitudSeleccionada.telefono || 'No informado'}
              </Text>

              <Text style={styles.etiquetaCampo}>FECHA DE SOLICITUD</Text>
              <Text style={styles.valorCampo}>
                {formatearFecha(solicitudSeleccionada.fecha_solicitud)}
              </Text>

              <View style={styles.acciones}>
                <TouchableOpacity
                  style={styles.botonRechazar}
                  disabled={procesando}
                  onPress={() => confirmarDecision('rechazado')}
                >
                  <Ionicons name="close" size={19} color="#FFFFFF" />
                  <Text style={styles.textoBoton}>
                    Rechazar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonAprobar}
                  disabled={procesando}
                  onPress={() => confirmarDecision('aprobado')}
                >
                  {procesando ? (
                    <ActivityIndicator color="#263323" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color="#263323"
                      />
                      <Text style={styles.textoBotonAprobar}>
                        Aprobar
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: 'rgba(244, 247, 238, 0.72)',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 14,
  },

  botonVolver: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#33452D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  etiqueta: {
    color: '#668044',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#263323',
  },

  subtitulo: {
    fontSize: 13,
    color: '#66715F',
    marginTop: 3,
  },

  encabezadoSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  tituloSeccion: {
    color: '#263323',
    fontSize: 19,
    fontWeight: '800',
  },

  subtituloSeccion: {
    color: '#66715F',
    fontSize: 12,
    marginTop: 4,
  },

  contador: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#33452D',
    borderWidth: 1,
    borderColor: '#D9B95B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoContador: {
    color: '#FFD54F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  estadoVacio: {
    backgroundColor: 'rgba(20, 29, 23, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.25)',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
  },

  tituloVacio: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },

  textoVacio: {
    color: '#D0D2C9',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  tarjetaSolicitud: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 29, 23, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.25)',
    borderRadius: 16,
    padding: 13,
    marginBottom: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#33452D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contenidoTarjeta: {
    flex: 1,
    marginLeft: 12,
  },

  nombreEmprendimiento: {
    color: '#FFD54F',
    fontSize: 15,
    fontWeight: 'bold',
  },

  nombreUsuario: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 4,
  },

  email: {
    color: '#BFC6B9',
    fontSize: 11,
    marginTop: 3,
  },

  fecha: {
    color: '#BFC6B9',
    fontSize: 11,
    marginTop: 5,
  },

  etiquetaPendiente: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 185, 91, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },

  textoPendiente: {
    color: '#FFD54F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  detalle: {
    backgroundColor: 'rgba(20, 29, 23, 0.97)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.4)',
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
  },

  encabezadoDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  tituloDetalle: {
    color: '#FFD54F',
    fontSize: 19,
    fontWeight: '800',
  },

  etiquetaCampo: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 13,
  },

  valorCampo: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },

  divisor: {
    height: 1,
    backgroundColor: 'rgba(217, 185, 91, 0.25)',
    marginTop: 18,
  },

  acciones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
  },

  botonRechazar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 11,
    backgroundColor: '#873F39',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  botonAprobar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 11,
    backgroundColor: '#D9B95B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  textoBotonAprobar: {
    color: '#263323',
    fontSize: 13,
    fontWeight: 'bold',
  },

});