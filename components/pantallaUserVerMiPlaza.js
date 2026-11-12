
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import API_URL from '../config/apiConfig';
import { AppContext } from '../provider/AppProvider';

export const PantallaUserVerMiPlaza = ({ navigation }) => {

  const { usuario } = useContext(AppContext);

  const [puestos, setPuestos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  const [cargando, setCargando] = useState(true);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);
  const [error, setError] = useState(null);

  // CARGAR PUESTOS ACTIVOS
  useEffect(() => {
    obtenerPuestos();
  }, []);

  const obtenerPuestos = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await axios.get(
        `${API_URL}/obtenerPuestosActivos`,
        { timeout: 10000 }
      );

      setPuestos(Array.isArray(respuesta.data) ? respuesta.data : []);

    } catch (error) {
      console.error('Error al obtener puestos:', error);
      setError('No se pudieron cargar los puestos.');
    } finally {
      setCargando(false);
    }
  };

  // CARGAR FAVORITOS DEL USUARIO
  useEffect(() => {
    if (usuario?.id_usuario) {
      obtenerFavoritos();
    } else {
      setFavoritos([]);
      setCargandoFavoritos(false);
    }
  }, [usuario?.id_usuario]);


  // ACTUALIZAR FAVORITOS CADA VEZ QUE VOLVEMOS A ESTA PANTALLA
useFocusEffect(
  useCallback(() => {
    obtenerFavoritos();
  }, [obtenerFavoritos])
);

 // CARGAR FAVORITOS DEL USUARIO
const obtenerFavoritos = useCallback(async () => {
  if (!usuario?.id_usuario) {
    setFavoritos([]);
    setCargandoFavoritos(false);
    return;
  }

  try {
    setCargandoFavoritos(true);

    const respuesta = await axios.get(
      `${API_URL}/obtenerFavoritos/${usuario.id_usuario}`,
      { timeout: 10000 }
    );

    setFavoritos(
      Array.isArray(respuesta.data) ? respuesta.data : []
    );

  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    setFavoritos([]);
  } finally {
    setCargandoFavoritos(false);
  }
}, [usuario?.id_usuario]);

  // CATEGORÍAS DISPONIBLES
  const categorias = [
    'Todos',
    ...new Set(
      puestos
        .map(puesto => puesto.categoria)
        .filter(Boolean)
    ),
  ];

  // FILTRAR PUESTOS
  const puestosFiltrados = puestos.filter(puesto => {

    const coincideNombre = puesto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === 'Todos' ||
      puesto.categoria === categoriaSeleccionada;

    return coincideNombre && coincideCategoria;
  });

  // ABRIR PANTALLA DEL PUESTO
  const abrirPuesto = (puesto) => {
    navigation.navigate('PantallaUserVerPuesto', {
      id_puesto: puesto.id_puesto,
    });
  };

  return (
    <ScrollView
      style={styles.contenedor}
      showsVerticalScrollIndicator={false}
    >

      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <Text style={styles.etiqueta}>
          DESCUBRÍ LA FERIA
        </Text>

        <Text style={styles.titulo}>
          Conocé los puestos
        </Text>

        <Text style={styles.subtitulo}>
          Descubrí a las personas y emprendimientos que forman parte de nuestra comunidad.
        </Text>
      </View>

      {/* BUSCADOR */}
      <View style={styles.contenedorBuscador}>
        <Text style={styles.iconoBuscar}>⌕</Text>

        <TextInput
          style={styles.inputBuscador}
          placeholder="Buscar un puesto..."
          placeholderTextColor="#85877F"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Text style={styles.limpiarBusqueda}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORÍAS */}
      <View style={styles.seccionCategorias}>
        <Text style={styles.tituloCategorias}>
          CATEGORÍAS
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaCategorias}
        >
          {categorias.map((categoria, index) => {

            const activa = categoriaSeleccionada === categoria;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chipCategoria,
                  activa && styles.chipCategoriaActivo,
                ]}
                onPress={() => setCategoriaSeleccionada(categoria)}
              >
                <Text
                  style={[
                    styles.textoChip,
                    activa && styles.textoChipActivo,
                  ]}
                >
                  {categoria}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* GALERÍA DE PUESTOS */}
      <View style={styles.seccionPuestos}>

        <View style={styles.encabezadoPuestos}>
          <View>
            <Text style={styles.etiqueta}>
              NUESTRA COMUNIDAD
            </Text>

            <Text style={styles.tituloPuestos}>
              Puestos de la feria
            </Text>
          </View>

          <Text style={styles.cantidadPuestos}>
            {puestosFiltrados.length} puestos
          </Text>
        </View>

        {cargando ? (

          <ActivityIndicator
            size="large"
            color="#D9B95B"
            style={styles.cargando}
          />

        ) : error ? (

          <View style={styles.estadoVacio}>
            <Text style={styles.textoEstado}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.botonReintentar}
              onPress={obtenerPuestos}
            >
              <Text style={styles.textoReintentar}>
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>

        ) : puestosFiltrados.length === 0 ? (

          <View style={styles.estadoVacio}>
            <Text style={styles.textoEstado}>
              No encontramos puestos con esos filtros.
            </Text>
          </View>

        ) : (

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaPuestos}
          >
            {puestosFiltrados.map(puesto => (

              <TouchableOpacity
                key={puesto.id_puesto}
                style={styles.cardPuesto}
                activeOpacity={0.85}
                onPress={() => abrirPuesto(puesto)}
              >

                <View style={styles.contenedorImagen}>
                  {puesto.imagen_url ? (
                    <Image
                      source={{ uri: puesto.imagen_url }}
                      style={styles.imagenPuesto}
                      resizeMode="cover"
                    />
                  ) : null}

                  {puesto.imagen_marca ? (
                    <Image
                      source={{ uri: puesto.imagen_marca }}
                      style={styles.imagenMarca}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>

                <View style={styles.informacionPuesto}>

                  <Text style={styles.categoriaPuesto}>
                    {puesto.categoria}
                  </Text>

                  <Text
                    style={styles.nombrePuesto}
                    numberOfLines={2}
                  >
                    {puesto.nombre}
                  </Text>

                  <Text
                    style={styles.descripcionPuesto}
                    numberOfLines={3}
                  >
                    {puesto.descripcion}
                  </Text>

                  <Text style={styles.verPuesto}>
                    CONOCER PUESTO →
                  </Text>

                </View>

              </TouchableOpacity>

            ))}
          </ScrollView>

        )}

      </View>

      {/* MIS FAVORITOS */}
      <View style={styles.seccionFavoritos}>

        <View style={styles.encabezadoFavoritos}>
          <View>
            <Text style={styles.etiqueta}>
              TU SELECCIÓN
            </Text>

            <Text style={styles.tituloPuestos}>
              Mis favoritos
            </Text>
          </View>

          <Text style={styles.cantidadPuestos}>
            {favoritos.length} puestos
          </Text>
        </View>

        {cargandoFavoritos ? (

          <ActivityIndicator
            size="small"
            color="#D9B95B"
            style={styles.cargandoFavoritos}
          />

        ) : favoritos.length === 0 ? (

          <View style={styles.favoritosVacios}>
            <Text style={styles.textoFavoritosVacios}>
              Todavía no tenés puestos favoritos.
            </Text>

            <Text style={styles.subtextoFavoritosVacios}>
              Explorá la feria y guardá los emprendimientos que te gusten.
            </Text>
          </View>

        ) : (

          <View style={styles.listaFavoritos}>

            {favoritos.map(puesto => (

              <TouchableOpacity
                key={puesto.id_puesto}
                style={styles.cardFavorito}
                activeOpacity={0.85}
                onPress={() => abrirPuesto(puesto)}
              >

                {puesto.imagen_url ? (
                  <Image
                    source={{ uri: puesto.imagen_url }}
                    style={styles.imagenFavorito}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagenFavoritoVacia}>
                    <Text style={styles.textoImagenVacia}>
                      SIN FOTO
                    </Text>
                  </View>
                )}

                <View style={styles.informacionFavorito}>

                  <Text style={styles.categoriaFavorito}>
                    {puesto.categoria || 'EMPRENDIMIENTO'}
                  </Text>

                  <Text
                    style={styles.nombreFavorito}
                    numberOfLines={1}
                  >
                    {puesto.nombre}
                  </Text>

                  <Text
                    style={styles.descripcionFavorito}
                    numberOfLines={2}
                  >
                    {puesto.descripcion}
                  </Text>

                  <Text style={styles.abrirFavorito}>
                    VER PUESTO →
                  </Text>

                </View>

                <Text style={styles.corazonFavorito}>
                  ♥
                </Text>

              </TouchableOpacity>

            ))}

          </View>

        )}

      </View>

      <View style={styles.piePagina}>
        <Text style={styles.textoPie}>
          PLAZAGO · SAN MARTÍN
        </Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  contenedor: {
    flex: 1,
    backgroundColor: '#F3F1E9',
    paddingTop: 25,
    marginBottom: 0,
  },

  encabezado: {
    paddingHorizontal: 22,
    marginBottom: 22,
  },

  etiqueta: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#A38A43',
    marginBottom: 7,
  },

  titulo: {
    fontSize: 27,
    fontWeight: '800',
    color: '#26382A',
  },

  subtitulo: {
    fontSize: 13,
    lineHeight: 19,
    color: '#74796F',
    marginTop: 7,
  },

  contenedorBuscador: {
    height: 48,
    marginHorizontal: 22,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2D8',
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconoBuscar: {
    fontSize: 25,
    color: '#74796F',
    marginRight: 10,
  },

  inputBuscador: {
    flex: 1,
    fontSize: 14,
    color: '#26382A',
  },

  limpiarBusqueda: {
    fontSize: 17,
    color: '#74796F',
    padding: 5,
  },

  seccionCategorias: {
    marginTop: 25,
  },

  tituloCategorias: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#74796F',
    marginHorizontal: 22,
    marginBottom: 12,
  },

  listaCategorias: {
    paddingHorizontal: 22,
    gap: 9,
  },

  chipCategoria: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#E8EDDF',
    borderWidth: 1,
    borderColor: '#D8DED0',
  },

  chipCategoriaActivo: {
    backgroundColor: '#26382A',
    borderColor: '#26382A',
  },

  textoChip: {
    fontSize: 12,
    fontWeight: '600',
    color: '#53604F',
  },

  textoChipActivo: {
    color: '#FFFFFF',
  },

  seccionPuestos: {
    marginTop: 30,
  },

  encabezadoPuestos: {
    paddingHorizontal: 22,
    marginBottom: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  tituloPuestos: {
    fontSize: 21,
    fontWeight: '800',
    color: '#26382A',
  },

  cantidadPuestos: {
    fontSize: 11,
    color: '#74796F',
    marginBottom: 3,
  },

  listaPuestos: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    gap: 12,
  },

  // TARJETAS DE FERIA MÁS COMPACTAS
  cardPuesto: {
    width: 215,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E2D8',
  },

  contenedorImagen: {
    height: 130,
    backgroundColor: '#E8EDDF',
  },

  imagenPuesto: {
    width: '100%',
    height: '100%',
  },

  imagenMarca: {
    position: 'absolute',
    right: 12,
    bottom: -18,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },

  informacionPuesto: {
    padding: 13,
  },

  categoriaPuesto: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#A38A43',
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  nombrePuesto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#26382A',
    marginBottom: 7,
  },

  descripcionPuesto: {
    fontSize: 12,
    lineHeight: 17,
    color: '#74796F',
    minHeight: 51,
  },

  verPuesto: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#26382A',
    marginTop: 13,
  },

  cargando: {
    marginTop: 45,
  },

  estadoVacio: {
    paddingHorizontal: 22,
    paddingVertical: 35,
    alignItems: 'center',
  },

  textoEstado: {
    fontSize: 13,
    color: '#74796F',
    textAlign: 'center',
  },

  botonReintentar: {
    marginTop: 15,
    backgroundColor: '#26382A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9,
  },

  textoReintentar: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  // FAVORITOS
  seccionFavoritos: {
    marginTop: 25,
    marginBottom: 30,
  },

  encabezadoFavoritos: {
    paddingHorizontal: 22,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  listaFavoritos: {
    paddingHorizontal: 22,
    gap: 10,
  },

  cardFavorito: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2D8',
    overflow: 'hidden',
    minHeight: 105,
  },

  imagenFavorito: {
    width: 100,
    height: 105,
    backgroundColor: '#E8EDDF',
  },

  imagenFavoritoVacia: {
    width: 100,
    height: 105,
    backgroundColor: '#26382A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoImagenVacia: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '800',
  },

  informacionFavorito: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  categoriaFavorito: {
    color: '#A38A43',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  nombreFavorito: {
    color: '#26382A',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },

  descripcionFavorito: {
    color: '#74796F',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },

  abrirFavorito: {
    color: '#26382A',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 7,
    letterSpacing: 0.6,
  },

  corazonFavorito: {
    color: '#B58C32',
    fontSize: 20,
    paddingHorizontal: 12,
  },

  cargandoFavoritos: {
    marginVertical: 25,
  },

  favoritosVacios: {
    marginHorizontal: 22,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2D8',
  },

  textoFavoritosVacios: {
    color: '#26382A',
    fontSize: 13,
    fontWeight: '800',
  },

  subtextoFavoritosVacios: {
    color: '#74796F',
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },

  piePagina: {
    marginTop: 10,
    marginBottom: 25,
    alignItems: 'center',
  },

  textoPie: {
    color: '#A38A43',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

});
