
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

const fondoPantallaConfiguracion =
  'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

const crearFormulario = (puesto) => ({
  nombre: puesto.nombre || '',
  descripcion: puesto.descripcion || '',
  categoria: puesto.categoria || '',
  imagen_url: puesto.imagen_url || '',
  imagen_marca: puesto.imagen_marca || '',
  telefono: puesto.telefono || '',
  instagram: puesto.instagram || '',
  facebook: puesto.facebook || '',
  tiktok: puesto.tiktok || '',
  otro_enlace: puesto.otro_enlace || '',
  referentes: Array.isArray(puesto.referentes)
    ? puesto.referentes.map((r) =>
        typeof r === 'string' ? r : r.nombre || ''
      )
    : [''],
});

export const PantallaMiPuesto = ({ puesto }) => {
  const { usuario } = useContext(AppContext);

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [datos, setDatos] = useState(() => crearFormulario(puesto));

  useEffect(() => {
    setDatos(crearFormulario(puesto));
    setEditando(false);
  }, [puesto]);

  const cambiarCampo = (campo, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const cambiarReferente = (indice, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      referentes: anterior.referentes.map((referente, i) =>
        i === indice ? valor : referente
      ),
    }));
  };

  const agregarReferente = () => {
    setDatos((anterior) => ({
      ...anterior,
      referentes: [...anterior.referentes, ''],
    }));
  };

  const eliminarReferente = (indice) => {
    setDatos((anterior) => ({
      ...anterior,
      referentes: anterior.referentes.filter((_, i) => i !== indice),
    }));
  };

  const cancelarEdicion = () => {
    setDatos(crearFormulario(puesto));
    setEditando(false);
  };

  const guardarCambios = async () => {
    if (!datos.nombre.trim()) {
      Alert.alert('Falta información', 'Ingresá el nombre del puesto.');
      return;
    }

    if (!datos.categoria.trim()) {
      Alert.alert('Falta información', 'Ingresá la categoría del puesto.');
      return;
    }

    if (!datos.descripcion.trim()) {
      Alert.alert('Falta información', 'Ingresá una presentación del puesto.');
      return;
    }

    const referentes = datos.referentes
      .map((nombre) => nombre.trim())
      .filter((nombre) => nombre.length > 0);

    setGuardando(true);

    try {
      const payload = {
        id_usuario: usuario.id_usuario,
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion.trim(),
        categoria: datos.categoria.trim(),
        imagen_url: datos.imagen_url.trim(),
        imagen_marca: datos.imagen_marca.trim(),
        telefono: datos.telefono.trim(),
        instagram: datos.instagram.trim(),
        facebook: datos.facebook.trim(),
        tiktok: datos.tiktok.trim(),
        otro_enlace: datos.otro_enlace.trim(),
        referentes,
      };

      await axios.put(
        `${API_URL}/actualizarPuesto/${puesto.id_puesto}`,
        payload
      );

      Alert.alert('Puesto actualizado', 'Los cambios se guardaron correctamente.');
      setEditando(false);
    } catch (error) {
      console.error(
        'Error al actualizar el puesto:',
        error.response ? error.response.data : error.message
      );

      Alert.alert(
        'Error',
        error.response && error.response.data && error.response.data.mensaje
          ? error.response.data.mensaje
          : 'No se pudieron guardar los cambios. Revisá tu conexión e intentá nuevamente.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const campoTexto = (
    etiqueta,
    campo,
    opciones = {}
  ) => (
    <View style={styles.campo} key={campo}>
      <Text style={styles.label}>{etiqueta}</Text>

      {editando ? (
        <TextInput
          style={[
            styles.input,
            opciones.multilinea && styles.inputMultilinea,
          ]}
          value={datos[campo]}
          onChangeText={(valor) => cambiarCampo(campo, valor)}
          placeholder={opciones.placeholder || etiqueta}
          placeholderTextColor="#92998A"
          multiline={opciones.multilinea || false}
          autoCapitalize={opciones.autoCapitalize || 'sentences'}
          keyboardType={opciones.keyboardType || 'default'}
          autoCorrect={opciones.autoCorrect !== false}
        />
      ) : (
        <Text style={styles.valor}>
          {datos[campo] || 'Sin información'}
        </Text>
      )}
    </View>
  );

  const campoImagen = (etiqueta, campo, icono) => (
    <View style={styles.tarjetaImagen} key={campo}>
      <View style={styles.vistaImagen}>
        {datos[campo] ? (
          <Image
            source={{ uri: datos[campo] }}
            style={styles.imagen}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.iconoImagen}>{icono}</Text>
        )}
      </View>

      <View style={styles.contenidoImagen}>
        <Text style={styles.tituloImagen}>{etiqueta}</Text>

        {editando ? (
          <TextInput
            style={styles.input}
            value={datos[campo]}
            onChangeText={(valor) => cambiarCampo(campo, valor)}
            placeholder="Pegá la URL de la imagen"
            placeholderTextColor="#92998A"
            autoCapitalize="none"
            keyboardType="url"
          />
        ) : (
          <Text style={styles.descripcionImagen}>
            {datos[campo] ? 'Imagen configurada' : 'Sin imagen configurada'}
          </Text>
        )}
      </View>
    </View>
  );

  if (!puesto) {
    return (
      <View style={styles.cargando}>
        <Text style={styles.valor}>No se encontró información del puesto.</Text>
      </View>
    );
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
          <View style={styles.encabezado}>
            <View style={styles.indicadorSeccion} />
            <Text style={styles.etiqueta}>MI ESPACIO EN LA FERIA</Text>
            <Text style={styles.titulo}>
              {editando ? 'Editar mi puesto' : datos.nombre}
            </Text>
            <Text style={styles.subtitulo}>
              {editando
                ? 'Modificá la información y guardá los cambios.'
                : 'Consultá la información de tu puesto.'}
            </Text>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Información general</Text>

            {campoTexto('Nombre del puesto', 'nombre')}
            {campoTexto('Categoría', 'categoria')}
            {campoTexto('Presentación', 'descripcion', {
              multilinea: true,
              placeholder: 'Contá qué ofrecés en tu puesto',
            })}

            {campoImagen('Imagen del puesto', 'imagen_url', '🏪')}
            {campoImagen('Imagen de marca', 'imagen_marca', '🌿')}
          </View>

          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Referentes</Text>
            <Text style={styles.descripcionSeccion}>
              Personas de contacto asociadas a tu puesto.
            </Text>

            {datos.referentes.map((referente, indice) => (
              <View style={styles.filaReferente} key={indice}>
                <View style={styles.numeroReferente}>
                  <Text style={styles.numeroReferenteTexto}>
                    {indice + 1}
                  </Text>
                </View>

                {editando ? (
                  <>
                    <TextInput
                      style={styles.inputReferente}
                      value={referente}
                      onChangeText={(valor) =>
                        cambiarReferente(indice, valor)
                      }
                      placeholder="Nombre del referente"
                      placeholderTextColor="#92998A"
                    />

                    <TouchableOpacity
                      style={styles.botonEliminar}
                      onPress={() => eliminarReferente(indice)}
                      accessibilityLabel="Eliminar referente"
                    >
                      <Text style={styles.textoEliminar}>×</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.valorReferente}>
                    {referente || 'Sin nombre'}
                  </Text>
                )}
              </View>
            ))}

            {editando && (
              <TouchableOpacity
                style={styles.botonAgregar}
                onPress={agregarReferente}
              >
                <Text style={styles.textoAgregar}>+ Agregar referente</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Contacto y redes</Text>

            {campoTexto('Teléfono', 'telefono', {
              keyboardType: 'phone-pad',
            })}
            {campoTexto('Instagram', 'instagram', {
              autoCapitalize: 'none',
              autoCorrect: false,
            })}
            {campoTexto('Facebook', 'facebook', {
              autoCapitalize: 'none',
              autoCorrect: false,
            })}
            {campoTexto('TikTok', 'tiktok', {
              autoCapitalize: 'none',
              autoCorrect: false,
            })}
            {campoTexto('Otro enlace', 'otro_enlace', {
              autoCapitalize: 'none',
              autoCorrect: false,
              keyboardType: 'url',
            })}
          </View>

          {editando ? (
            <View style={styles.botonesAccion}>
              <TouchableOpacity
                style={[styles.botonGuardar, guardando && styles.deshabilitado]}
                onPress={guardarCambios}
                disabled={guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoGuardar}>Guardar cambios</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={cancelarEdicion}
                disabled={guardando}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={() => setEditando(true)}
            >
              <Text style={styles.textoGuardar}>Editar puesto</Text>
              <Text style={styles.flechaGuardar}>✎</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.pie}>MI PUESTO · FERIAS</Text>
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
  seccion: {
    backgroundColor: 'rgba(255,255,255,0.91)',
    borderRadius: 19,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 18,
  },
  tituloSeccion: {
    fontSize: 19,
    fontWeight: '800',
    color: '#293626',
    marginBottom: 7,
  },
  descripcionSeccion: {
    fontSize: 12,
    color: '#7A8175',
    lineHeight: 18,
    marginBottom: 14,
  },
  campo: {
    marginTop: 15,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#56664A',
    letterSpacing: 0.8,
    marginBottom: 8,
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
  valor: {
    fontSize: 14,
    lineHeight: 21,
    color: '#293626',
    paddingVertical: 4,
  },
  tarjetaImagen: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E7D9',
    borderRadius: 13,
    padding: 10,
    marginTop: 15,
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
  imagen: {
    width: '100%',
    height: '100%',
  },
  iconoImagen: {
    fontSize: 29,
  },
  contenidoImagen: {
    flex: 1,
    gap: 8,
  },
  tituloImagen: {
    color: '#35462D',
    fontSize: 14,
    fontWeight: '800',
  },
  descripcionImagen: {
    color: '#7A8175',
    fontSize: 12,
    lineHeight: 18,
  },
  filaReferente: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
  valorReferente: {
    flex: 1,
    fontSize: 14,
    color: '#293626',
    paddingVertical: 10,
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
    marginTop: 13,
  },
  textoAgregar: {
    color: '#526A3B',
    fontSize: 12,
    fontWeight: '800',
  },
  botonesAccion: {
    gap: 10,
    marginTop: 5,
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
  deshabilitado: {
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
  botonCancelar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    paddingVertical: 14,
    borderRadius: 13,
  },
  textoCancelar: {
    color: '#56664A',
    fontSize: 14,
    fontWeight: '800',
  },
  pie: {
    textAlign: 'center',
    color: '#89917F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 22,
  },
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F4F7EE',
  },
});
