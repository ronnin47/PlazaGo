import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../config/apiConfig';
import { AppContext } from '../provider/AppProvider';

export const GaleriaFeriasProximas = () => {
  const { usuario } = useContext(AppContext);
  const [ferias, setFerias] = useState([]);

  useEffect(() => {
    obtenerFerias();
  }, []);

  const obtenerFerias = async () => {
    try {
      const respuesta = await axios.get(
        `${API_URL}/obtenerFeriasDisponibles`,
        {
          params: {
            id_usuario: usuario.id_usuario,
          },
        }
      );

      setFerias(respuesta.data);
    } catch (error) {
      console.log('Error al obtener las ferias:', error);
      setFerias([]);
    }
  };
const solicitarInscripcion = async (feria) => {
  try {
    const respuesta = await axios.post(
      `${API_URL}/solicitarInscripcion`,
      {
        id_feria: feria.id_feria,
        id_puesto: feria.id_puesto,
      }
    );

    console.log('Solicitud enviada:', respuesta.data);

    await obtenerFerias();
  } catch (error) {
    console.log(
      'Error al solicitar inscripción:',
      error.response?.data || error.message
    );
  }
};
  return (
  <View style={styles.contenedor}>
    <Text style={styles.titulo}>Próximas ferias</Text>

    <Text style={styles.subtitulo}>
      Explorá las próximas ferias y solicitá participar.
    </Text>

    {ferias.length === 0 ? (
      <View style={styles.vacio}>
        <Text style={styles.textoVacio}>
          No hay ferias próximas disponibles.
        </Text>
      </View>
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaFerias}
      >
        {ferias.map((feria) => (
          <View
            key={`${feria.id_feria}-${feria.id_puesto}`}
            style={styles.card}
          >
            {feria.imagen_url ? (
              <Image
                source={{ uri: feria.imagen_url }}
                style={styles.imagen}
              />
            ) : (
              <View style={styles.imagenVacia}>
                <Ionicons
                  name="storefront-outline"
                  size={42}
                  color="#87968A"
                />
              </View>
            )}

            <ScrollView
              style={styles.scrollContenido}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contenidoCard}>
                <Text style={styles.nombreFeria}>
                  {feria.nombre}
                </Text>

                <Text style={styles.descripcion}>
                  {feria.descripcion || 'Sin descripción disponible.'}
                </Text>

                <View style={styles.filaDato}>
                  <Ionicons
                    name="location-sharp"
                    size={16}
                    color="#804d44"
                  />
                  <Text style={styles.datoFeria}>
                    {feria.ubicacion || 'Ubicación no disponible'}
                  </Text>
                </View>

                <View style={styles.filaDato}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#286344"
                  />
                  <Text style={styles.datoFeria}>
                    Inicio: {new Date(feria.fecha_inicio).toLocaleDateString('es-AR')}
                  </Text>
                </View>

                <View style={styles.filaDato}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#286344"
                  />
                  <Text style={styles.datoFeria}>
                    Fin: {new Date(feria.fecha_fin).toLocaleDateString('es-AR')}
                  </Text>
                </View>

                {feria.situacion_puesto === 'sin_inscripcion' ? (
                  <TouchableOpacity
                    style={styles.boton}
                    onPress={() => solicitarInscripcion(feria)}
                  >
                    <Text style={styles.textoBoton}>
                      Solicitar inscripción
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.textoInscripcion}>
                    {feria.estado === 'pendiente'
                      ? 'Solicitud pendiente'
                      : feria.estado === 'aprobada'
                      ? 'Inscripción aprobada'
                      : feria.estado === 'rechazada'
                      ? 'Solicitud rechazada'
                      : 'Inscripción registrada'}
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    )}
  </View>
);
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F4F6F1',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#234B35',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#667568',
    marginBottom: 20,
  },
  listaFerias: {
    paddingBottom: 16,
    paddingRight: 4,
  },
  card: {
    width: 290,
    height: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCE5DC',
    elevation: 3,
  },
  imagen: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  imagenVacia: {
    width: '100%',
    height: 170,
    backgroundColor: '#E8EEE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContenido: {
    flex: 1,
  },
  contenidoCard: {
    padding: 16,
  },
  nombreFeria: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#234B35',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#526157',
    marginBottom: 12,
    lineHeight: 20,
  },
  filaDato: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 7,
  },
  datoFeria: {
    flex: 1,
    fontSize: 14,
    color: '#445449',
  },
  boton: {
    backgroundColor: '#286344',
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
textoInscripcion: {
  backgroundColor: '#FFF3D6',
  color: '#0e0d0c',
  fontWeight: '700',
  fontSize: 14,
  marginTop: 14,
  textAlign: 'center',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: 8,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#E8CC8A',
},
vacio: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
},
textoVacio: {
  color: '#667568',
  fontSize: 14,
  textAlign: 'center',
},
});