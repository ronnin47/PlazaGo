
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../config/apiConfig';

export const PantallaRegistrarPuestos = ({ route, navigation }) => {
  const { feria } = route.params || {};
  const [puestos, setPuestos] = useState([]);
  const [actualizando, setActualizando] = useState(null);

  const fondo =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

  const obtenerSolicitudes = async () => {
    if (!feria?.id_feria) return;

    try {
      const respuesta = await axios.get(
        `${API_URL}/obtenerSolicitudesFeria`,
        {
          params: {
            id_feria: feria.id_feria,
          },
        }
      );

      setPuestos(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.log(
        'Error al obtener solicitudes:',
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    obtenerSolicitudes();
  }, [feria?.id_feria]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';

    const fechaObjeto = new Date(String(fecha).replace(' ', 'T'));

    if (isNaN(fechaObjeto.getTime())) return 'No disponible';

    return fechaObjeto.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cambiarEstadoSolicitud = async (solicitud, estado) => {
    if (!solicitud.id_inscripcion) {
      Alert.alert('Error', 'La solicitud no tiene un ID válido.');
      return;
    }

    if (actualizando !== null) return;

    setActualizando(solicitud.id_inscripcion);

    try {
      await axios.put(`${API_URL}/actualizarEstadoInscripcion`, {
        id_inscripcion: solicitud.id_inscripcion,
        estado,
      });

      await obtenerSolicitudes();

      Alert.alert(
        'Solicitud actualizada',
        `La solicitud fue ${estado}.`
      );
    } catch (error) {
      console.log(
        'Error al actualizar la solicitud:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.mensaje ||
          'No se pudo actualizar el estado de la solicitud.'
      );
    } finally {
      setActualizando(null);
    }
  };

  const obtenerColorEstado = (estado) => {
    switch ((estado || 'pendiente').toLowerCase()) {
      case 'aprobado':
        return '#91B56C';
      case 'rechazado':
        return '#E47777';
      default:
        return '#FFD54F';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch ((estado || 'pendiente').toLowerCase()) {
      case 'aprobado':
        return 'checkmark-circle';
      case 'rechazado':
        return 'close-circle';
      default:
        return 'time-outline';
    }
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
          <View style={styles.encabezado}>
            <TouchableOpacity
              style={styles.botonVolver}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#E7D39A"
              />
            </TouchableOpacity>

            <View style={styles.encabezadoTexto}>
              <Text style={styles.etiqueta}>PLAZA GO</Text>
              <Text style={styles.titulo}>Solicitudes de puestos</Text>
              <Text style={styles.subtitulo}>
                Revisá y administrá las inscripciones de esta feria.
              </Text>
            </View>
          </View>

          <View style={styles.tarjetaFeria}>
            {feria?.imagen_url ? (
              <Image
                source={{ uri: feria.imagen_url }}
                style={styles.imagenFeria}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagenVacia}>
                <Ionicons
                  name="storefront-outline"
                  size={36}
                  color="#D9B95B"
                />
              </View>
            )}

            <View style={styles.contenidoFeria}>
              <Text style={styles.etiquetaTarjeta}>
                FERIA SELECCIONADA
              </Text>

              <Text style={styles.nombreFeria}>
                {feria?.nombre || 'Feria sin nombre'}
              </Text>

              <Text style={styles.descripcion}>
                {feria?.descripcion || 'Sin descripción disponible.'}
              </Text>

              <View style={styles.filaDato}>
                <Ionicons
                  name="location-sharp"
                  size={16}
                  color="#D9B95B"
                />
                <Text style={styles.datoFeria}>
                  {feria?.ubicacion || 'Ubicación no disponible'}
                </Text>
              </View>

              <View style={styles.filaDato}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#D9B95B"
                />
                <Text style={styles.datoFeria}>
                  Inicio: {formatearFecha(feria?.fecha_inicio)}
                </Text>
              </View>

              <View style={styles.filaDato}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#D9B95B"
                />
                <Text style={styles.datoFeria}>
                  Fin: {formatearFecha(feria?.fecha_fin)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.resumen}>
            <View style={styles.iconoResumen}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#D9B95B"
              />
            </View>

            <View style={styles.datosResumen}>
              <Text style={styles.tituloResumen}>
                Solicitudes recibidas
              </Text>
              <Text style={styles.subtituloResumen}>
                Inscripciones para esta feria
              </Text>
            </View>

            <View style={styles.contador}>
              <Text style={styles.textoContador}>
                {puestos.length}
              </Text>
            </View>
          </View>

          {puestos.length === 0 ? (
            <View style={styles.estadoVacio}>
              <Ionicons
                name="document-text-outline"
                size={42}
                color="#D9B95B"
              />

              <Text style={styles.tituloVacio}>
                No hay solicitudes
              </Text>

              <Text style={styles.textoVacio}>
                Las solicitudes de inscripción de esta feria
                aparecerán en esta sección.
              </Text>
            </View>
          ) : (
            puestos.map((solicitud) => {
              const estado = (
                solicitud.estado || 'pendiente'
              ).toLowerCase();

              const estaPendiente = estado === 'pendiente';

              return (
                <View
                  key={solicitud.id_inscripcion}
                  style={styles.tarjetaPuesto}
                >
                  <View style={styles.iconoPuesto}>
                    <Ionicons
                      name="storefront-outline"
                      size={24}
                      color="#D9B95B"
                    />
                  </View>

                  <View style={styles.contenidoPuesto}>
                    <Text style={styles.nombrePuesto}>
                      {solicitud.nombre_puesto || 'Puesto sin nombre'}
                    </Text>

                    <Text style={styles.datoPuesto}>
                      {solicitud.descripcion_puesto ||
                        'Sin descripción'}
                    </Text>

                    <Text style={styles.datoPuesto}>
                      Puestero:{' '}
                      {[
                        solicitud.nombre_puestero,
                        solicitud.apellido_puestero,
                      ]
                        .filter(Boolean)
                        .join(' ') || 'No disponible'}
                    </Text>

                    <Text style={styles.datoPuesto}>
                      Solicitud:{' '}
                      {formatearFecha(solicitud.fecha_solicitud)}
                    </Text>

                    <View style={styles.filaEstado}>
                      <Ionicons
                        name={obtenerIconoEstado(estado)}
                        size={17}
                        color={obtenerColorEstado(estado)}
                      />
                      <Text
                        style={[
                          styles.etiquetaEstado,
                          { color: obtenerColorEstado(estado) },
                        ]}
                      >
                        Estado: {estado}
                      </Text>
                    </View>

                    {estaPendiente && (
                      <View style={styles.botonesEstado}>
                        <TouchableOpacity
                          style={[
                            styles.botonAprobar,
                            actualizando === solicitud.id_inscripcion &&
                              styles.botonDeshabilitado,
                          ]}
                          disabled={actualizando !== null}
                          onPress={() =>
                            cambiarEstadoSolicitud(
                              solicitud,
                              'aprobado'
                            )
                          }
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={17}
                            color="#FFFFFF"
                          />
                          <Text style={styles.textoBotonEstado}>
                            Aprobar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.botonRechazar,
                            actualizando === solicitud.id_inscripcion &&
                              styles.botonDeshabilitado,
                          ]}
                          disabled={actualizando !== null}
                          onPress={() =>
                            cambiarEstadoSolicitud(
                              solicitud,
                              'rechazado'
                            )
                          }
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={17}
                            color="#FFFFFF"
                          />
                          <Text style={styles.textoBotonEstado}>
                            Rechazar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {!estaPendiente && (
                      <Text style={styles.textoRespuesta}>
                        {solicitud.fecha_respuesta
                          ? `Respondida: ${formatearFecha(
                              solicitud.fecha_respuesta
                            )}`
                          : 'Esta solicitud ya tiene una respuesta.'}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}

          <TouchableOpacity
            style={styles.botonActualizar}
            onPress={obtenerSolicitudes}
            activeOpacity={0.85}
          >
            <Ionicons
              name="refresh-outline"
              size={20}
              color="#263323"
            />
            <Text style={styles.textoBotonAsignar}>
              Actualizar solicitudes
            </Text>
          </TouchableOpacity>

          <Text style={styles.nota}>
            Solo las solicitudes pendientes pueden aprobarse o rechazarse.
          </Text>
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
    paddingTop: 25,
    paddingBottom: 35,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },

  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  botonVolver: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#33452D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.4)',
  },

  encabezadoTexto: {
    flex: 1,
  },

  etiqueta: {
    color: '#668044',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },

  titulo: {
    color: '#263323',
    fontSize: 25,
    fontWeight: '800',
  },

  subtitulo: {
    color: '#66715F',
    fontSize: 13,
    marginTop: 4,
  },

  tarjetaFeria: {
    backgroundColor: 'rgba(20, 29, 23, 0.95)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.3)',
    padding: 14,
    marginBottom: 25,
  },

  imagenFeria: {
    width: '100%',
    height: 175,
    borderRadius: 12,
    backgroundColor: '#26352A',
    marginBottom: 15,
  },

  imagenVacia: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#26352A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  contenidoFeria: {
    paddingHorizontal: 2,
  },

  etiquetaTarjeta: {
    color: '#91B56C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  nombreFeria: {
    color: '#FFD54F',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 8,
  },

  descripcion: {
    color: '#D0D2C9',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },

  filaDato: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  datoFeria: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
  },

  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconoResumen: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#33452D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  datosResumen: {
    flex: 1,
    marginLeft: 12,
  },

  tituloResumen: {
    color: '#263323',
    fontSize: 18,
    fontWeight: '800',
  },

  subtituloResumen: {
    color: '#66715F',
    fontSize: 12,
    marginTop: 3,
  },

  contador: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#33452D',
    borderWidth: 1,
    borderColor: '#D9B95B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoContador: {
    color: '#FFD54F',
    fontSize: 16,
    fontWeight: '800',
  },

  estadoVacio: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 29, 23, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.25)',
    borderRadius: 16,
    padding: 28,
  },

  tituloVacio: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },

  textoVacio: {
    color: '#D0D2C9',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 7,
  },

  tarjetaPuesto: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(20, 29, 23, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.25)',
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
  },

  iconoPuesto: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#26352A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contenidoPuesto: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  nombrePuesto: {
    color: '#FFD54F',
    fontSize: 14,
    fontWeight: '800',
  },

  datoPuesto: {
    color: '#D0D2C9',
    fontSize: 12,
    marginTop: 4,
  },

  filaEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  etiquetaEstado: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
    textTransform: 'capitalize',
  },

  botonesEstado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },

  botonAprobar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#527A43',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
  },

  botonRechazar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#963F3F',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
  },

  botonDeshabilitado: {
    opacity: 0.5,
  },

  textoBotonEstado: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  textoRespuesta: {
    color: '#AEB7A6',
    fontSize: 11,
    marginTop: 9,
  },

  botonActualizar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9B95B',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginTop: 22,
  },

  textoBotonAsignar: {
    color: '#263323',
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 10,
  },

  nota: {
    color: '#66715F',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
  },
});
