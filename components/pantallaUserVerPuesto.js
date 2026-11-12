
import React, { useState, useEffect, useRef, useContext } from 'react';

import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_URL from '../config/apiConfig';
import { AppContext } from '../provider/AppProvider';

const FONDO =
  'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

export const PantallaUserVerPuesto = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { usuario } = useContext(AppContext);
  const id_usuario = usuario?.id_usuario;

  const { id_puesto, id_producto, origen } = route.params || {};

  const [puesto, setPuesto] = useState(null);
  const [referentes, setReferentes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // FAVORITOS
  const [esFavorito, setEsFavorito] = useState(false);
  const [cargandoFavorito, setCargandoFavorito] = useState(true);

  // REFERENCIA AL SCROLL PRINCIPAL
  const scrollRef = useRef(null);

  // POSICIÓN DE LAS SECCIONES
  const posicionReferentes = useRef(0);
  const posicionProductos = useRef(0);
  const posicionGaleria = useRef(0);

  // ==========================================
  // CONSULTAR SI EL PUESTO ES FAVORITO
  // ==========================================

  const obtenerEstadoFavorito = async () => {
    if (!id_usuario || !id_puesto) return;

    try {
      setCargandoFavorito(true);

      const respuesta = await axios.get(
        `${API_URL}/obtenerFavoritos/${id_usuario}`,
        { timeout: 10000 }
      );

      const favoritoEncontrado = respuesta.data.some(
        favorito =>
          String(favorito.id_puesto) === String(id_puesto)
      );

      setEsFavorito(favoritoEncontrado);

    } catch (error) {
      console.error(
        'Error al consultar favoritos:',
        error.response?.data || error.message
      );
    } finally {
      setCargandoFavorito(false);
    }
  };

  useEffect(() => {
    if (id_usuario && id_puesto) {
      obtenerEstadoFavorito();
    }
  }, [id_usuario, id_puesto]);

  // ==========================================
  // AGREGAR O ELIMINAR FAVORITO
  // ==========================================

  const alternarFavorito = async () => {
    if (!id_usuario || !id_puesto || cargandoFavorito) return;

    try {
      setCargandoFavorito(true);

      if (esFavorito) {
        await axios.delete(
          `${API_URL}/eliminarFavorito`,
          {
            data: {
              id_usuario,
              id_puesto,
            },
            timeout: 10000,
          }
        );

        setEsFavorito(false);

      } else {
        await axios.post(
          `${API_URL}/agregarFavorito`,
          {
            id_usuario,
            id_puesto,
          },
          { timeout: 10000 }
        );

        setEsFavorito(true);
      }

    } catch (error) {
      console.error(
        'Error al actualizar favorito:',
        error.response?.data || error.message
      );
    } finally {
      setCargandoFavorito(false);
    }
  };

  // ==========================================
  // CARGAR INFORMACIÓN DEL PUESTO
  // ==========================================

  useEffect(() => {
    obtenerDetallePuesto();
  }, [id_puesto]);

  const obtenerDetallePuesto = async () => {
    if (!id_puesto) {
      setError('No se recibió el identificador del puesto.');
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const respuesta = await axios.get(
        `${API_URL}/obtenerDetallePuesto/${id_puesto}`,
        { timeout: 10000 }
      );

      const datos = respuesta.data;

      setPuesto(datos.puesto || null);

      setReferentes(
        Array.isArray(datos.puesto?.referentes)
          ? datos.puesto.referentes
          : []
      );

      const listaProductos = Array.isArray(datos.productos)
        ? datos.productos
        : [];

      setProductos(listaProductos);

      if (id_producto) {
        const productoInicial = listaProductos.find(
          producto =>
            String(producto.id_producto) === String(id_producto)
        );

        setProductoSeleccionado(
          productoInicial || listaProductos[0] || null
        );
      } else {
        setProductoSeleccionado(listaProductos[0] || null);
      }

    } catch (err) {
      console.error(
        'Error al obtener el puesto:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.mensaje ||
        'No se pudo cargar la información del puesto.'
      );

    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // DESPLAZAR HASTA LOS REFERENTES
  // ==========================================

  useEffect(() => {
    if (
      !cargando &&
      !error &&
      puesto &&
      origen === 'puesteros'
    ) {
      const timeout = setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: posicionReferentes.current,
          animated: true,
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [cargando, error, puesto, origen]);

  // ==========================================
  // DESPLAZAR HASTA LA GALERÍA
  // ==========================================

  useEffect(() => {
    if (
      !cargando &&
      !error &&
      puesto &&
      origen === 'producto'
    ) {
      const timeout = setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: 540,
          animated: true,
        });
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [cargando, error, puesto, origen]);

  // SELECCIONAR PRODUCTO
  const seleccionarProducto = producto => {
    setProductoSeleccionado(producto);
  };

  // FORMATEAR PRECIO
  const formatearPrecio = precio => {
    if (precio === null || precio === undefined) {
      return 'Consultar precio';
    }

    return Number(precio).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    });
  };

  // ABRIR ENLACES
  const abrirEnlace = enlace => {
    if (!enlace) return;

    const url = enlace.startsWith('http')
      ? enlace
      : `https://${enlace}`;

    Linking.openURL(url).catch(err => {
      console.error('Error al abrir enlace:', err);
    });
  };

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <ImageBackground source={{ uri: FONDO }} style={styles.background}>
        <View style={styles.estadoContenedor}>
          <ActivityIndicator size="large" color="#D9B95B" />
          <Text style={styles.textoCarga}>
            Conociendo el puesto...
          </Text>
        </View>
      </ImageBackground>
    );
  }

  // ERROR
  if (error || !puesto) {
    return (
      <ImageBackground source={{ uri: FONDO }} style={styles.background}>
        <View style={styles.estadoContenedor}>
          <Text style={styles.textoError}>
            {error || 'Puesto no encontrado.'}
          </Text>

          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBotonVolver}>VOLVER</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: FONDO }}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover', opacity: 0.7 }}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >

      {/* 1. HERO DEL PUESTO */}

<View style={styles.tarjetaPuesto}>

  {/* FAVORITO: ARRIBA A LA IZQUIERDA DEL HERO */}
  <View style={styles.contenedorFavorito}>
    <TouchableOpacity
      style={[
        styles.botonFavorito,
        esFavorito && styles.botonFavoritoActivo,
      ]}
      onPress={alternarFavorito}
      disabled={cargandoFavorito || !id_usuario}
      activeOpacity={0.8}
    >
      {cargandoFavorito ? (
        <ActivityIndicator size="small" color="#26382A" />
      ) : (
        <>
          <Text
            style={[
              styles.iconoFavorito,
              esFavorito && styles.iconoFavoritoActivo,
            ]}
          >
            {esFavorito ? '♥' : '♡'}
          </Text>

          <Text
            style={[
              styles.textoFavorito,
              esFavorito && styles.textoFavoritoActivo,
            ]}
          >
            {esFavorito
              ? 'Quitar de favoritos'
              : 'Agregar a favoritos'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  </View>

  {puesto.imagen_url ? (
    <Image
      source={{ uri: puesto.imagen_url }}
      style={styles.imagenPuesto}
      resizeMode="cover"
    />
  ) : (
    <View style={styles.imagenVacia}>
      <Text style={styles.textoImagenVacia}>
        SIN IMAGEN
      </Text>
    </View>
  )}

  {puesto.imagen_marca && (
    <View style={styles.marcaContenedor}>
      <Image
        source={{ uri: puesto.imagen_marca }}
        style={styles.imagenMarca}
        resizeMode="contain"
      />
    </View>
  )}

  <View style={styles.informacionPuesto}>

    <Text style={styles.categoriaPuesto}>
      {puesto.categoria || 'EMPRENDIMIENTO'}
    </Text>

    <Text style={styles.nombrePuesto}>
      {puesto.nombre}
    </Text>

    <View style={styles.separador} />

    <Text style={styles.descripcionPuesto}>
      {puesto.descripcion ||
        'Este puesto todavía no tiene una presentación.'}
    </Text>

    <Text style={styles.firmaPuesto}>
      PLAZAGO · SAN MARTÍN
    </Text>

  </View>
</View>

        {/* 2. PRODUCTOS DEL PUESTO */}

        <View
          style={styles.seccionProductos}
          onLayout={event => {
            posicionProductos.current = event.nativeEvent.layout.y;
          }}
        >

          <View style={styles.encabezadoSeccion}>
            <View style={styles.indicadorSeccion} />

            <View>
              <Text style={styles.tituloSeccion}>
                PRODUCTOS DEL PUESTO
              </Text>

              <Text style={styles.subtituloSeccion}>
                Explorá lo que tiene para ofrecer
              </Text>
            </View>
          </View>

          {productos.length > 0 ? (
            <>
              {productoSeleccionado && (
                <View style={styles.detalleProducto}>

                  <View style={styles.etiquetaDetalleContenedor}>
                    <Text style={styles.etiquetaDetalle}>
                      PRODUCTO SELECCIONADO
                    </Text>

                    {productoSeleccionado.destacado && (
                      <Text style={styles.etiquetaDestacado}>
                        ✦ DESTACADO
                      </Text>
                    )}
                  </View>

                  {productoSeleccionado.imagen_url ? (
                    <Image
                      source={{ uri: productoSeleccionado.imagen_url }}
                      style={styles.imagenDetalle}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagenDetalleVacia}>
                      <Text style={styles.textoImagenVacia}>
                        SIN IMAGEN
                      </Text>
                    </View>
                  )}

                  <View style={styles.contenidoDetalle}>
                    <Text style={styles.nombreDetalle}>
                      {productoSeleccionado.nombre}
                    </Text>

                    <Text style={styles.precioDetalle}>
                      {formatearPrecio(productoSeleccionado.precio)}
                    </Text>

                    <View style={styles.separadorDetalle} />

                    <Text style={styles.etiquetaDescripcion}>
                      DESCRIPCIÓN
                    </Text>

                    <Text style={styles.descripcionDetalle}>
                      {productoSeleccionado.descripcion ||
                        'Este producto todavía no tiene una descripción.'}
                    </Text>
                  </View>
                </View>
              )}

              <Text
                style={styles.etiquetaGaleria}
                onLayout={event => {
                  posicionGaleria.current =
                    posicionProductos.current +
                    event.nativeEvent.layout.y;
                }}
              >
                MÁS PRODUCTOS DE ESTE PUESTO
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listaGaleria}
              >
                {productos.map(producto => {
                  const seleccionado =
                    String(productoSeleccionado?.id_producto) ===
                    String(producto.id_producto);

                  return (
                    <TouchableOpacity
                      key={producto.id_producto}
                      activeOpacity={0.8}
                      style={[
                        styles.tarjetaGaleria,
                        seleccionado && styles.productoActivo,
                      ]}
                      onPress={() => seleccionarProducto(producto)}
                    >
                      {producto.imagen_url ? (
                        <Image
                          source={{ uri: producto.imagen_url }}
                          style={styles.imagenGaleria}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.imagenGaleriaVacia}>
                          <Text style={styles.textoImagenVacia}>
                            SIN IMAGEN
                          </Text>
                        </View>
                      )}

                      <Text
                        style={[
                          styles.nombreGaleria,
                          seleccionado && styles.nombreGaleriaActivo,
                        ]}
                        numberOfLines={1}
                      >
                        {producto.nombre}
                      </Text>

                      {seleccionado && (
                        <View style={styles.indicadorActivo} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <View style={styles.sinProductos}>
              <Text style={styles.textoSinProductos}>
                Este puesto todavía no tiene productos publicados.
              </Text>
            </View>
          )}
        </View>

        {/* 3. PERSONAS DETRÁS DEL PUESTO */}

        <View
          style={styles.seccionReferentes}
          onLayout={event => {
            posicionReferentes.current = event.nativeEvent.layout.y;
          }}
        >

          <View style={styles.encabezadoSeccion}>
            <View style={styles.indicadorSeccion} />

            <View>
              <Text style={styles.tituloSeccion}>
                LAS PERSONAS DETRÁS DEL PUESTO
              </Text>

              <Text style={styles.subtituloSeccion}>
                Conocé quiénes hacen posible este emprendimiento
              </Text>
            </View>
          </View>

          <View style={styles.tarjetaReferentes}>
            {referentes.length > 0 ? (
              referentes.map((referente, indice) => (
                <View
                  key={referente.id_referente || indice}
                  style={styles.referente}
                >
                  {referente.imagen_url ? (
                    <Image
                      source={{ uri: referente.imagen_url }}
                      style={styles.avatarReferente}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.avatarReferente}>
                      <Text style={styles.textoAvatar}>
                        {referente.nombre
                          ? referente.nombre.charAt(0).toUpperCase()
                          : '?'}
                      </Text>
                    </View>
                  )}

                  <View style={styles.informacionReferente}>
                    <Text style={styles.etiquetaReferente}>
                      REFERENTE DEL PUESTO
                    </Text>

                    <Text style={styles.nombreReferente}>
                      {referente.nombre}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.textoSinReferentes}>
                Información de referentes no disponible.
              </Text>
            )}
          </View>
        </View>

        {/* 4. CONTACTO DEL PUESTO */}

        <View style={styles.seccionContacto}>

          <View style={styles.encabezadoSeccion}>
            <View style={styles.indicadorSeccion} />

            <Text style={styles.tituloSeccion}>
              CONECTÁ CON EL PUESTO
            </Text>
          </View>

          <View style={styles.tarjetaContacto}>

            {puesto.telefono && (
              <TouchableOpacity
                style={styles.botonContacto}
                onPress={() =>
                  abrirEnlace(
                    `https://wa.me/${puesto.telefono.replace(/\D/g, '')}`
                  )
                }
              >
                <Text style={styles.iconoContacto}>☎</Text>
                <Text style={styles.textoContacto}>WhatsApp</Text>
              </TouchableOpacity>
            )}

            {puesto.instagram && (
              <TouchableOpacity
                style={styles.botonContacto}
                onPress={() => abrirEnlace(puesto.instagram)}
              >
                <Text style={styles.iconoContacto}>◎</Text>
                <Text style={styles.textoContacto}>Instagram</Text>
              </TouchableOpacity>
            )}

            {puesto.facebook && (
              <TouchableOpacity
                style={styles.botonContacto}
                onPress={() => abrirEnlace(puesto.facebook)}
              >
                <Text style={styles.iconoContacto}>f</Text>
                <Text style={styles.textoContacto}>Facebook</Text>
              </TouchableOpacity>
            )}

            {puesto.tiktok && (
              <TouchableOpacity
                style={styles.botonContacto}
                onPress={() => abrirEnlace(puesto.tiktok)}
              >
                <Text style={styles.iconoContacto}>♪</Text>
                <Text style={styles.textoContacto}>TikTok</Text>
              </TouchableOpacity>
            )}

            {puesto.otro_enlace && (
              <TouchableOpacity
                style={styles.botonContacto}
                onPress={() => abrirEnlace(puesto.otro_enlace)}
              >
                <Text style={styles.iconoContacto}>↗</Text>
                <Text style={styles.textoContacto}>
                  Más información
                </Text>
              </TouchableOpacity>
            )}

            {!puesto.telefono &&
              !puesto.instagram &&
              !puesto.facebook &&
              !puesto.tiktok &&
              !puesto.otro_enlace && (
                <Text style={styles.textoSinContacto}>
                  Este puesto todavía no publicó medios de contacto.
                </Text>
              )}
          </View>
        </View>

        {/* PIE DE PÁGINA */}

        <View style={styles.piePagina}>
          <Text style={styles.textoPie}>
            ✦ PLAZAGO · SAN MARTÍN
          </Text>

          <Text style={styles.subtextoPie}>
            Detrás de cada puesto hay una historia por conocer.
          </Text>
        </View>

      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  contenido: {
    paddingTop: 0,
    paddingBottom: 35,
  },

  // FAVORITOS

 contenedorFavorito: {
  position: 'absolute',
  top: 45,
  left: 14,
  zIndex: 20,
  elevation: 20,
},

botonFavorito: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 22,
  borderWidth: 1,
  borderColor: '#D8DED0',
  paddingHorizontal: 12,
  paddingVertical: 4,
  minWidth: 105,
  minHeight: 24,
},

  botonFavoritoActivo: {
    backgroundColor: '#26382A',
    borderColor: '#D9B95B',
  },

  iconoFavorito: {
    color: '#26382A',
    fontSize: 22,
    marginRight: 9,
  },

  iconoFavoritoActivo: {
    color: '#D9B95B',
  },

  textoFavorito: {
    color: '#26382A',
    fontSize: 12,
    fontWeight: '800',
  },

  textoFavoritoActivo: {
    color: '#FFFFFF',
  },

  // ESTADOS

  estadoContenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  textoCarga: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 14,
    fontWeight: '600',
  },

  textoError: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },

  // HERO

  tarjetaPuesto: {
    width: '100%',
    height: 470,
    position: 'relative',
    backgroundColor: '#26382A',
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: 0,
    elevation: 0,
  },

  imagenPuesto: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  imagenVacia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26382A',
  },

  textoImagenVacia: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  marcaContenedor: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 65,
    height: 65,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 5,
    borderWidth: 1,
    borderColor: '#D9B95B',
    zIndex: 5,
  },

  imagenMarca: {
    width: '100%',
    height: '100%',
  },

  informacionPuesto: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },

  categoriaPuesto: {
    color: '#D9B95B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 10,
  },

  nombrePuesto: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },

  separador: {
    width: 48,
    height: 3,
    backgroundColor: '#D9B95B',
    marginVertical: 14,
    borderRadius: 3,
  },

  descripcionPuesto: {
    color: '#F0F0E9',
    fontSize: 14,
    lineHeight: 22,
  },

  firmaPuesto: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 18,
  },

  // ENCABEZADOS

  encabezadoSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  indicadorSeccion: {
    width: 5,
    height: 34,
    backgroundColor: '#D9B95B',
    borderRadius: 4,
    marginRight: 11,
  },

  tituloSeccion: {
    color: '#1f1d1d',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  subtituloSeccion: {
    color: '#C6CBBF',
    fontSize: 11,
    marginTop: 4,
  },

  // PRODUCTOS

  seccionProductos: {
    marginTop: 28,
  },

  detalleProducto: {
    marginHorizontal: 12,
    backgroundColor: '#17251D',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.4)',
    overflow: 'hidden',
  },

  etiquetaDetalleContenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },

  etiquetaDetalle: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  etiquetaDestacado: {
    color: '#F5D77B',
    fontSize: 9,
    fontWeight: '900',
  },

  imagenDetalle: {
    width: '100%',
    height: 230,
    backgroundColor: '#30382F',
  },

  imagenDetalleVacia: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30382F',
  },

  contenidoDetalle: {
    padding: 17,
  },

  nombreDetalle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },

  precioDetalle: {
    color: '#F0D477',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 9,
  },

  separadorDetalle: {
    height: 1,
    backgroundColor: 'rgba(217,185,91,0.3)',
    marginVertical: 14,
  },

  etiquetaDescripcion: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  descripcionDetalle: {
    color: '#D4D8D0',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 7,
  },

  etiquetaGaleria: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 20,
    marginHorizontal: 14,
    marginBottom: 3,
  },

  listaGaleria: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },

  tarjetaGaleria: {
    width: 95,
    backgroundColor: '#17251D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.3)',
    overflow: 'hidden',
    paddingBottom: 8,
  },

  productoActivo: {
    borderColor: '#D9B95B',
    borderWidth: 2,
    backgroundColor: '#26382A',
  },

  imagenGaleria: {
    width: '100%',
    height: 72,
    backgroundColor: '#30382F',
  },

  imagenGaleriaVacia: {
    width: '100%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30382F',
  },

  nombreGaleria: {
    color: '#D6D6CB',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 7,
    paddingTop: 8,
  },

  nombreGaleriaActivo: {
    color: '#F5D77B',
  },

  indicadorActivo: {
    height: 3,
    backgroundColor: '#D9B95B',
    marginTop: 7,
    marginHorizontal: 7,
    borderRadius: 3,
  },

  sinProductos: {
    marginHorizontal: 12,
    padding: 20,
    backgroundColor: '#17251D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.3)',
  },

  textoSinProductos: {
    color: '#D4D8D0',
    fontSize: 13,
  },

  // REFERENTES

  seccionReferentes: {
    marginTop: 28,
    paddingHorizontal: 12,
  },

  tarjetaReferentes: {
    backgroundColor: '#17251D',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.3)',
    padding: 14,
  },

  referente: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  avatarReferente: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#344B38',
    borderWidth: 1,
    borderColor: '#D9B95B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textoAvatar: {
    color: '#F5D77B',
    fontSize: 20,
    fontWeight: '900',
  },

  informacionReferente: {
    flex: 1,
  },

  etiquetaReferente: {
    color: '#D9B95B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  nombreReferente: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },

  textoSinReferentes: {
    color: '#C6CBBF',
    fontSize: 12,
  },

  // CONTACTO

  seccionContacto: {
    marginTop: 28,
    paddingHorizontal: 12,
  },

  tarjetaContacto: {
    backgroundColor: '#17251D',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.3)',
    padding: 14,
    gap: 12,
  },

  botonContacto: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },

  iconoContacto: {
    color: '#D9B95B',
    fontSize: 20,
    width: 35,
    fontWeight: '900',
  },

  textoContacto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  textoSinContacto: {
    color: '#C6CBBF',
    fontSize: 12,
  },

  // PIE DE PÁGINA

  piePagina: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  textoPie: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  subtextoPie: {
    color: '#D4D8D0',
    fontSize: 11,
    marginTop: 7,
    textAlign: 'center',
  },

});
