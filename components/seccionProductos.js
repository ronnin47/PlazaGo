
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import axios from 'axios';
import API_URL from '../config/apiConfig';
import { AppContext } from '../provider/AppProvider';

export const SeccionProductos = ({ puesto }) => {
  const { usuario } = useContext(AppContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [destacado, setDestacado] = useState(false);
  const [productos, setProductos] = useState([]);

  // OBTENER PRODUCTOS DEL PUESTO
  const obtenerProductos = async () => {
    if (!puesto?.id_puesto) {
      setProductos([]);
      return;
    }

    try {
      const respuesta = await axios.get(
        `${API_URL}/obtenerProductosPuesto`,
        {
          params: {
            id_puesto: puesto.id_puesto,
          },
        }
      );

      console.log('PRODUCTOS DEL PUESTO:', respuesta.data);
      setProductos(respuesta.data);
    } catch (error) {
      console.error(
        'Error al obtener los productos:',
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, [puesto?.id_puesto]);

  // CONTAR PRODUCTOS DESTACADOS
  const cantidadDestacados = productos.filter(
    (producto) =>
      producto.destacado === true ||
      producto.destacado === 'true'
  ).length;

  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setImagenUrl('');
    setDestacado(false);
  };

  const abrirModal = () => {
    limpiarFormulario();
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    limpiarFormulario();
  };

// CARGAR PRODUCTO
const cargarProducto = async () => {
  if (!puesto?.id_puesto) {
    Alert.alert(
      'Error',
      'No se encontró el puesto al que pertenece el producto.'
    );
    return;
  }

  if (!nombre.trim()) {
    Alert.alert(
      'Falta información',
      'Ingresá el nombre del producto.'
    );
    return;
  }

  const precioNumerico = Number(precio.replace(',', '.'));

  if (
    !precio.trim() ||
    !Number.isFinite(precioNumerico) ||
    precioNumerico < 0
  ) {
    Alert.alert(
      'Precio inválido',
      'Ingresá un precio válido.'
    );
    return;
  }

  if (destacado && cantidadDestacados >= 3) {
    Alert.alert(
      'Límite de destacados',
      'Tu puesto ya tiene 3 productos destacados.'
    );
    return;
  }

  try {
    const respuesta = await axios.post(
      `${API_URL}/insertarProducto`,
      {
        id_puesto: puesto.id_puesto,
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio: precioNumerico,
        imagen_url: imagenUrl.trim() || null,
        destacado: destacado,
      }
    );

    const productoGuardado = respuesta.data.producto;

    setProductos((anteriores) => [
      productoGuardado,
      ...anteriores,
    ]);

    cerrarModal();

    Alert.alert(
      'Producto agregado',
      'El producto se guardó correctamente.'
    );
  } catch (error) {
    console.error(
      'Error al guardar el producto:',
      error.response?.data || error.message
    );

    Alert.alert(
      'Error al guardar',
      error.response?.data?.mensaje ||
        'No se pudo guardar el producto.'
    );
  }
};

  const editarProducto = (producto) => {
    console.log('EDITAR PRODUCTO:', {
      id_puesto: puesto?.id_puesto,
      producto,
    });
  };

  const eliminarProducto = (producto) => {
    console.log('ELIMINAR PRODUCTO:', {
      id_puesto: puesto?.id_puesto,
      producto,
    });
  };

  // ACTIVAR O DESACTIVAR DESTACADO EN EL FORMULARIO
  const cambiarDestacado = () => {
    if (destacado) {
      setDestacado(false);
      return;
    }

    if (cantidadDestacados >= 3) {
      Alert.alert(
        'Límite de destacados',
        'Solo podés elegir hasta 3 productos destacados para tu puesto.'
      );
      return;
    }

    setDestacado(true);
  };

  // IMAGEN
  const renderImagen = (url, estilo) => {
    if (url) {
      return (
        <Image
          source={{ uri: url }}
          style={estilo}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={[estilo, styles.imagenVacia]}>
        <Text style={styles.iconoImagen}>▧</Text>
      </View>
    );
  };

  return (
    <View style={styles.seccion}>
      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <View style={styles.indicador} />

        <Text style={styles.etiqueta}>TU CATÁLOGO</Text>

        <Text style={styles.titulo}>Mis productos</Text>

        <Text style={styles.subtitulo}>
          {puesto?.nombre
            ? `Productos de ${puesto.nombre}`
            : 'Administrá los productos de tu puesto.'}
        </Text>
      </View>

      {/* LISTADO */}
      <View style={styles.encabezadoLista}>
        <View>
          <Text style={styles.tituloLista}>
            Productos cargados
          </Text>

          <Text style={styles.contador}>
            {productos.length}{' '}
            {productos.length === 1 ? 'producto' : 'productos'}
          </Text>

          <Text style={styles.contadorDestacadosLista}>
            {cantidadDestacados} de 3 productos destacados
          </Text>
        </View>

        <TouchableOpacity
          style={styles.botonNuevo}
          onPress={abrirModal}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotonNuevo}>
            + Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {productos.length === 0 ? (
        <View style={styles.vacio}>
          <View style={styles.iconoVacioContenedor}>
            <Text style={styles.iconoVacio}>▧</Text>
          </View>

          <Text style={styles.textoVacio}>
            Todavía no hay productos
          </Text>

          <Text style={styles.detalleVacio}>
            Agregá tus productos para empezar a armar tu catálogo.
          </Text>

          <TouchableOpacity
            style={styles.botonVacio}
            onPress={abrirModal}
          >
            <Text style={styles.textoBotonVacio}>
              Cargar mi primer producto
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listaProductos}>
          {productos.map((producto) => {
            const esDestacado =
              producto.destacado === true ||
              producto.destacado === 'true';

            return (
              <View
                style={styles.producto}
                key={producto.id_producto}
              >
                {renderImagen(
                  producto.imagen_url,
                  styles.imagenProducto
                )}

                <View style={styles.datosProducto}>
                  <View style={styles.filaNombreProducto}>
                    <Text style={styles.nombreProducto}>
                      {producto.nombre}
                    </Text>

                    {esDestacado && (
                      <View style={styles.etiquetaDestacado}>
                        <Text style={styles.textoEtiquetaDestacado}>
                          ★ Destacado
                        </Text>
                      </View>
                    )}
                  </View>

                  {producto.descripcion ? (
                    <Text
                      style={styles.descripcionProducto}
                      numberOfLines={3}
                    >
                      {producto.descripcion}
                    </Text>
                  ) : null}

                  <Text style={styles.precioProducto}>
                    ${Number(producto.precio || 0).toLocaleString('es-AR')}
                  </Text>

                  <View style={styles.accionesProducto}>
                    <TouchableOpacity
                      style={styles.botonEditar}
                      onPress={() => editarProducto(producto)}
                    >
                      <Text style={styles.textoEditar}>
                        Editar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botonEliminar}
                      onPress={() => eliminarProducto(producto)}
                    >
                      <Text style={styles.textoEliminar}>
                        Eliminar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* MODAL PARA AGREGAR PRODUCTO */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <KeyboardAvoidingView
          style={styles.fondoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.contenedorModal}>
            <View style={styles.cabeceraModal}>
              <View style={styles.contenidoCabeceraModal}>
                <Text style={styles.etiquetaModal}>
                  TU CATÁLOGO
                </Text>

                <Text style={styles.tituloModal}>
                  Nuevo producto
                </Text>

                <Text style={styles.subtituloModal}>
                  Completá los datos del producto.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.botonCerrar}
                onPress={cerrarModal}
                accessibilityLabel="Cerrar modal"
              >
                <Text style={styles.textoCerrar}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formularioModal}
              contentContainerStyle={styles.contenidoFormulario}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>
                Nombre del producto *
              </Text>

              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej.: Correa para perros"
                placeholderTextColor="#92998A"
              />

              <Text style={styles.label}>Descripción</Text>

              <TextInput
                style={[styles.input, styles.inputMultilinea]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Características del producto"
                placeholderTextColor="#92998A"
                multiline
              />

              <Text style={styles.label}>Precio *</Text>

              <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                placeholder="Ej.: 8500"
                placeholderTextColor="#92998A"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>
                Imagen del producto
              </Text>

              <TextInput
                style={styles.input}
                value={imagenUrl}
                onChangeText={setImagenUrl}
                placeholder="URL de la imagen"
                placeholderTextColor="#92998A"
                autoCapitalize="none"
                keyboardType="url"
              />

              {/* CHECKBOX DESTACADO */}
              <TouchableOpacity
                style={styles.filaDestacado}
                activeOpacity={0.8}
                onPress={cambiarDestacado}
              >
                <View
                  style={[
                    styles.checkboxDestacado,
                    destacado && styles.checkboxDestacadoActivo,
                  ]}
                >
                  {destacado && (
                    <Text style={styles.checkDestacado}>
                      ✓
                    </Text>
                  )}
                </View>

                <View style={styles.textosDestacado}>
                  <Text style={styles.tituloDestacado}>
                    Producto destacado
                  </Text>

                  <Text style={styles.descripcionDestacado}>
                    Elegilo para mostrarlo entre los destacados de tu puesto.
                  </Text>

                  <Text style={styles.contadorDestacado}>
                    {cantidadDestacados} de 3 seleccionados
                  </Text>
                </View>
              </TouchableOpacity>

              {imagenUrl.trim() !== '' &&
                renderImagen(
                  imagenUrl.trim(),
                  styles.vistaPrevia
                )}

              <TouchableOpacity
                style={styles.botonGuardar}
                onPress={cargarProducto}
                activeOpacity={0.8}
              >
                <Text style={styles.textoGuardar}>
                  Guardar producto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={cerrarModal}
              >
                <Text style={styles.textoCancelar}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  seccion: {
    marginTop: 24,
    marginBottom: 20,
  },

  encabezado: {
    marginBottom: 22,
  },

  indicador: {
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
    fontSize: 26,
    fontWeight: '800',
    color: '#263323',
  },

  subtitulo: {
    fontSize: 13,
    color: '#66715F',
    marginTop: 7,
    lineHeight: 20,
  },

  encabezadoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  tituloLista: {
    fontSize: 18,
    fontWeight: '800',
    color: '#293626',
  },

  contador: {
    color: '#7A8175',
    fontSize: 12,
    marginTop: 4,
  },

  contadorDestacadosLista: {
    color: '#526A3B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },

  botonNuevo: {
    backgroundColor: '#33452D',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 11,
  },

  textoBotonNuevo: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  vacio: {
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderStyle: 'dashed',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.78)',
  },

  iconoVacioContenedor: {
    width: 57,
    height: 57,
    borderRadius: 17,
    backgroundColor: '#E8EDD9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  iconoVacio: {
    fontSize: 28,
    color: '#718653',
  },

  textoVacio: {
    fontSize: 15,
    fontWeight: '800',
    color: '#35462D',
    textAlign: 'center',
  },

  detalleVacio: {
    fontSize: 12,
    lineHeight: 18,
    color: '#7A8175',
    marginTop: 7,
    textAlign: 'center',
  },

  botonVacio: {
    backgroundColor: '#33452D',
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 17,
  },

  textoBotonVacio: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  listaProductos: {
    gap: 12,
  },

  producto: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: '#E2E7D9',
    borderRadius: 15,
    padding: 11,
    gap: 12,
  },

  imagenProducto: {
    width: 100,
    height: 116,
    borderRadius: 11,
    backgroundColor: '#E8EDD9',
  },

  imagenVacia: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconoImagen: {
    fontSize: 28,
    color: '#718653',
  },

  datosProducto: {
    flex: 1,
    gap: 7,
  },

  filaNombreProducto: {
    gap: 5,
  },

  nombreProducto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#293626',
  },

  etiquetaDestacado: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8EDD9',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  textoEtiquetaDestacado: {
    color: '#526A3B',
    fontSize: 10,
    fontWeight: '800',
  },

  descripcionProducto: {
    fontSize: 12,
    lineHeight: 17,
    color: '#66715F',
  },

  precioProducto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#526A3B',
    marginTop: 2,
  },

  accionesProducto: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },

  botonEditar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EEF1E5',
  },

  textoEditar: {
    color: '#526A3B',
    fontSize: 11,
    fontWeight: '800',
  },

  botonEliminar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F7E9E5',
  },

  textoEliminar: {
    color: '#9C4239',
    fontSize: 11,
    fontWeight: '800',
  },

  // MODAL

  fondoModal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(23, 31, 20, 0.82)',
  },

  contenedorModal: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#F4F7EE',
    borderRadius: 16,
    overflow: 'hidden',
  },

  cabeceraModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E7D9',
  },

  contenidoCabeceraModal: {
    flex: 1,
  },

  etiquetaModal: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#668044',
    marginBottom: 7,
  },

  tituloModal: {
    fontSize: 23,
    fontWeight: '800',
    color: '#263323',
  },

  subtituloModal: {
    fontSize: 12,
    color: '#66715F',
    marginTop: 5,
  },

  botonCerrar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#E8EDD9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  textoCerrar: {
    fontSize: 27,
    lineHeight: 30,
    color: '#35462D',
  },

  formularioModal: {
    flexGrow: 0,
  },

  contenidoFormulario: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 30,
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#56664A',
    marginTop: 16,
    marginBottom: 7,
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
    minHeight: 90,
    textAlignVertical: 'top',
  },

  filaDestacado: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 20,
    backgroundColor: '#E8EDD9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DEC6',
  },

  checkboxDestacado: {
    width: 23,
    height: 23,
    borderWidth: 1.5,
    borderColor: '#718653',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDestacadoActivo: {
    backgroundColor: '#526A3B',
    borderColor: '#526A3B',
  },

  checkDestacado: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  textosDestacado: {
    flex: 1,
    marginLeft: 12,
  },

  tituloDestacado: {
    color: '#293626',
    fontSize: 13,
    fontWeight: '800',
  },

  descripcionDestacado: {
    color: '#66715F',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  contadorDestacado: {
    color: '#526A3B',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
  },

  vistaPrevia: {
    width: '100%',
    height: 175,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: '#E8EDD9',
  },

  botonGuardar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#33452D',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 24,
    minHeight: 50,
  },

  textoGuardar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  botonCancelar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 5,
  },

  textoCancelar: {
    color: '#66715F',
    fontSize: 13,
    fontWeight: '700',
  },
});
