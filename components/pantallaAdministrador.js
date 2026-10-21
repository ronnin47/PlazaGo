
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppContext } from '../provider/AppProvider';

import API_URL from '../config/apiConfig';

const FECHA_INICIAL = () => new Date();

const formatearFecha = (fecha) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
};

const formatearHora = (fecha) => {
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${horas}:${minutos}`;
};

const convertirFechaLocal = (fecha, hora) => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);

  if (
    !anio || !mes || !dia ||
    Number.isNaN(horas) ||
    Number.isNaN(minutos) ||
    horas < 0 || horas > 23 ||
    minutos < 0 || minutos > 59
  ) {
    return null;
  }

  const resultado = new Date(anio, mes - 1, dia, horas, minutos);

  if (
    resultado.getFullYear() !== anio ||
    resultado.getMonth() !== mes - 1 ||
    resultado.getDate() !== dia
  ) {
    return null;
  }

  return resultado;
};

export const PantallaAdministrador = () => {
  const { usuario, cerrarSesion } = useContext(AppContext);

  const fondoPantallaConfiguracion =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

  const [modalVisible, setModalVisible] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const [fechaInicio, setFechaInicio] = useState(FECHA_INICIAL());
  const [fechaFin, setFechaFin] = useState(FECHA_INICIAL());

  const [horaInicio, setHoraInicio] = useState('10:00');
  const [horaFin, setHoraFin] = useState('18:00');

  const [selectorFecha, setSelectorFecha] = useState(null);
  const [selectorHora, setSelectorHora] = useState(null);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setUbicacion('');
    setImagenUrl('');
    setFechaInicio(FECHA_INICIAL());
    setFechaFin(FECHA_INICIAL());
    setHoraInicio('10:00');
    setHoraFin('18:00');
    setSelectorFecha(null);
    setSelectorHora(null);
  };

  const abrirSelectorFecha = (tipo) => {
    setSelectorFecha(tipo);
    setSelectorHora(null);
  };

  const abrirSelectorHora = (tipo) => {
    setSelectorHora(tipo);
    setSelectorFecha(null);
  };

  const obtenerFechaSeleccionada = () => {
    return selectorFecha === 'inicio' ? fechaInicio : fechaFin;
  };

  const actualizarFecha = (evento, nuevaFecha) => {
    if (Platform.OS === 'android') {
      setSelectorFecha(null);
    }

    if (evento.type === 'dismissed' || !nuevaFecha) {
      return;
    }

    if (selectorFecha === 'inicio') {
      setFechaInicio(nuevaFecha);
    } else {
      setFechaFin(nuevaFecha);
    }

    if (Platform.OS === 'ios') {
      setSelectorFecha(null);
    }
  };

  const actualizarHora = (evento, nuevaFecha) => {
    if (Platform.OS === 'android') {
      setSelectorHora(null);
    }

    if (evento.type === 'dismissed' || !nuevaFecha) {
      return;
    }

    const hora = formatearHora(nuevaFecha);

    if (selectorHora === 'inicio') {
      setHoraInicio(hora);
    } else {
      setHoraFin(hora);
    }

    if (Platform.OS === 'ios') {
      setSelectorHora(null);
    }
  };

  const crearFeria = async () => {
    if (
      !nombre.trim() ||
      !ubicacion.trim()
    ) {
      Alert.alert(
        'Datos incompletos',
        'Completá el nombre y la ubicación de la feria.'
      );
      return;
    }

    const inicio = convertirFechaLocal(
      formatearFecha(fechaInicio),
      horaInicio
    );

    const fin = convertirFechaLocal(
      formatearFecha(fechaFin),
      horaFin
    );

    if (!inicio || !fin) {
      Alert.alert(
        'Fechas incorrectas',
        'Seleccioná fechas válidas e ingresá las horas en formato HH:mm.'
      );
      return;
    }

    if (fin <= inicio) {
      Alert.alert(
        'Fechas incorrectas',
        'La fecha de finalización debe ser posterior al inicio.'
      );
      return;
    }

    if (!usuario || !usuario.id_usuario) {
      Alert.alert(
        'Error',
        'No se pudo identificar al administrador.'
      );
      return;
    }

    const fechaInicioAPI =
      `${formatearFecha(fechaInicio)} ${horaInicio}:00`;

    const fechaFinAPI =
      `${formatearFecha(fechaFin)} ${horaFin}:00`;

    setCargando(true);

    try {
      const respuesta = await axios.post(
        `${API_URL}/insertarFeria`,
        {
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          fecha_inicio: fechaInicioAPI,
          fecha_fin: fechaFinAPI,
          ubicacion: ubicacion.trim(),
          imagen_url: imagenUrl.trim() || null,
          id_administrador: usuario.id_usuario,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      setModalVisible(false);
      limpiarFormulario();

      Alert.alert(
        'Feria creada',
        respuesta.data?.message ||
          'La feria se guardó correctamente como borrador.'
      );
    } catch (error) {
      console.error(
        'Error al crear feria:',
        error.response?.data || error.message
      );

      const mensaje =
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED'
          ? 'El servidor tardó demasiado en responder.'
          : 'No se pudo conectar con el servidor.');

      Alert.alert('Error al crear la feria', mensaje);
    } finally {
      setCargando(false);
    }
  };

  const renderizarSelector = () => {
    if (selectorFecha) {
      return (
       <DateTimePicker
  value={obtenerFechaSeleccionada()}
  mode="date"
  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
  onValueChange={actualizarFecha}
  onDismiss={() => {}}
  minimumDate={
    selectorFecha === 'fin' ? fechaInicio : undefined
  }
/>
      );
    }

    if (selectorHora) {
      const horaActual =
        selectorHora === 'inicio' ? horaInicio : horaFin;

      const [horas, minutos] = horaActual.split(':').map(Number);
      const fechaHora = new Date();
      fechaHora.setHours(horas, minutos, 0, 0);

      return (
        <DateTimePicker
          value={fechaHora}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour
          onChange={actualizarHora}
        />
      );
    }

    return null;
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
              <Text style={styles.rolUsuario}>ADMINISTRADOR</Text>
            </View>
          </View>

          <Text style={styles.tituloSeccion}>Gestión de ferias</Text>

          <TouchableOpacity
            style={styles.tarjetaCrear}
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.iconoCrear}>
              <Text style={styles.iconoCrearTexto}>＋</Text>
            </View>

            <View style={styles.contenidoCrear}>
              <Text style={styles.tituloTarjeta}>Crear nueva feria</Text>
              <Text style={styles.descripcionTarjeta}>
                Cargá los datos, las fechas y la ubicación de una nueva feria.
              </Text>

              <View style={styles.etiquetaAccion}>
                <Text style={styles.textoAccion}>NUEVA FERIA</Text>
                <Text style={styles.flecha}>→</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.tarjetaInformativa}>
            <Text style={styles.infoTitulo}>Antes de publicar</Text>
            <Text style={styles.infoTexto}>
              Las ferias nuevas se guardan como borrador. Después podremos
              agregar una sección para revisar las ferias creadas y publicarlas.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botonCerrarSesion}
            onPress={() => cerrarSesion()}
            activeOpacity={0.8}
          >
            <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!cargando) {
            setModalVisible(false);
            setSelectorFecha(null);
            setSelectorHora(null);
          }
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalFondo}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCaja}>
            <View style={styles.modalEncabezado}>
              <View>
                <Text style={styles.modalEtiqueta}>ADMINISTRACIÓN</Text>
                <Text style={styles.modalTitulo}>Nueva feria</Text>
              </View>

              <TouchableOpacity
                style={styles.botonCerrarModal}
                onPress={() => {
                  if (!cargando) {
                    setModalVisible(false);
                    setSelectorFecha(null);
                    setSelectorHora(null);
                  }
                }}
                disabled={cargando}
              >
                <Text style={styles.cerrarModalTexto}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Nombre de la feria *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Feria de emprendedores"
                placeholderTextColor="#92978E"
                value={nombre}
                onChangeText={setNombre}
                maxLength={150}
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.inputMultilinea]}
                placeholder="Contá de qué se trata la feria..."
                placeholderTextColor="#92978E"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Fecha de inicio *</Text>

              <TouchableOpacity
                style={styles.selectorFecha}
                onPress={() => abrirSelectorFecha('inicio')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconoFecha}>▦</Text>
                <View style={styles.contenidoFecha}>
                  <Text style={styles.textoFecha}>
                    {fechaInicio.toLocaleDateString('es-AR')}
                  </Text>
                  <Text style={styles.ayudaSelector}>
                    Seleccionar día
                  </Text>
                </View>
                <Text style={styles.flechaFecha}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selectorFecha}
                onPress={() => abrirSelectorHora('inicio')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconoFecha}>◷</Text>
                <View style={styles.contenidoFecha}>
                  <Text style={styles.textoFecha}>{horaInicio}</Text>
                  <Text style={styles.ayudaSelector}>
                    Seleccionar hora
                  </Text>
                </View>
                <Text style={styles.flechaFecha}>›</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Fecha de finalización *</Text>

              <TouchableOpacity
                style={styles.selectorFecha}
                onPress={() => abrirSelectorFecha('fin')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconoFecha}>▦</Text>
                <View style={styles.contenidoFecha}>
                  <Text style={styles.textoFecha}>
                    {fechaFin.toLocaleDateString('es-AR')}
                  </Text>
                  <Text style={styles.ayudaSelector}>
                    Seleccionar día
                  </Text>
                </View>
                <Text style={styles.flechaFecha}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selectorFecha}
                onPress={() => abrirSelectorHora('fin')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconoFecha}>◷</Text>
                <View style={styles.contenidoFecha}>
                  <Text style={styles.textoFecha}>{horaFin}</Text>
                  <Text style={styles.ayudaSelector}>
                    Seleccionar hora
                  </Text>
                </View>
                <Text style={styles.flechaFecha}>›</Text>
              </TouchableOpacity>

              {renderizarSelector()}

              <Text style={styles.label}>Ubicación *</Text>
              <TextInput
                style={styles.input}
                placeholder="Dirección o nombre de la plaza"
                placeholderTextColor="#92978E"
                value={ubicacion}
                onChangeText={setUbicacion}
                maxLength={255}
              />

              <Text style={styles.label}>URL de imagen (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                placeholderTextColor="#92978E"
                value={imagenUrl}
                onChangeText={setImagenUrl}
                autoCapitalize="none"
                keyboardType="url"
              />

              <View style={styles.avisoBorrador}>
                <Text style={styles.avisoIcono}>●</Text>
                <Text style={styles.avisoTexto}>
                  La feria se guardará como borrador.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.botonGuardar,
                  cargando && styles.botonDeshabilitado,
                ]}
                onPress={crearFeria}
                disabled={cargando}
                activeOpacity={0.85}
              >
                {cargando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoGuardar}>Guardar feria</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => {
                  if (!cargando) {
                    setModalVisible(false);
                    setSelectorFecha(null);
                    setSelectorHora(null);
                  }
                }}
                disabled={cargando}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },

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

  iconoAdminTexto: { fontSize: 25, color: '#E7D39A' },

  tarjetaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#24351E',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#E8EDD9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarTexto: {
    fontSize: 25,
    fontWeight: '800',
    color: '#405733',
  },

  datosUsuario: { flex: 1 },

  nombreUsuario: {
    fontSize: 18,
    fontWeight: '800',
    color: '#263323',
  },

  emailUsuario: {
    color: '#7A8175',
    fontSize: 13,
    marginTop: 3,
  },

  rolUsuario: {
    alignSelf: 'flex-start',
    color: '#627A42',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 7,
  },

  tituloSeccion: {
    fontSize: 21,
    fontWeight: '800',
    color: '#293626',
    marginBottom: 15,
  },

  tarjetaCrear: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#33452D',
    borderWidth: 1,
    borderColor: '#60724C',
    elevation: 5,
    shadowColor: '#1E2B19',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  iconoCrear: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#E7D39A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  iconoCrearTexto: {
    color: '#33452D',
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '400',
  },

  contenidoCrear: { flex: 1 },

  tituloTarjeta: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  descripcionTarjeta: {
    color: '#E0E7D9',
    fontSize: 14,
    lineHeight: 21,
  },

  etiquetaAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 19,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },

  textoAccion: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#E7D39A',
  },

  flecha: { fontSize: 23, color: '#E7D39A' },

  tarjetaInformativa: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginTop: 20,
  },

  infoTitulo: {
    color: '#35462D',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },

  infoTexto: {
    color: '#6B7564',
    fontSize: 13,
    lineHeight: 20,
  },

  botonCerrarSesion: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 26,
  },

  textoCerrarSesion: {
    color: '#9C4239',
    fontSize: 14,
    fontWeight: '700',
  },

  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(21, 30, 19, 0.68)',
    padding: 15,
  },

  modalCaja: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    alignSelf: 'center',
    backgroundColor: '#F8F9F3',
    borderRadius: 23,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E7D9',
  },

  modalEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  modalEtiqueta: {
    color: '#738653',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },

  modalTitulo: {
    fontSize: 26,
    color: '#293626',
    fontWeight: '800',
  },

  botonCerrarModal: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#E9EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cerrarModalTexto: {
    color: '#405238',
    fontSize: 18,
    fontWeight: '700',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#384633',
    marginBottom: 7,
    marginTop: 15,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#293626',
  },

  inputMultilinea: {
    minHeight: 85,
    textAlignVertical: 'top',
  },

  selectorFecha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },

  iconoFecha: {
    fontSize: 23,
    color: '#627A42',
    width: 35,
  },

  contenidoFecha: { flex: 1 },

  textoFecha: {
    fontSize: 15,
    fontWeight: '700',
    color: '#293626',
  },

  ayudaSelector: {
    fontSize: 11,
    color: '#7D8676',
    marginTop: 3,
  },

  flechaFecha: {
    color: '#627A42',
    fontSize: 25,
    paddingHorizontal: 5,
  },

  avisoBorrador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF1E5',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  avisoIcono: {
    color: '#788A51',
    fontSize: 12,
    marginRight: 9,
  },

  avisoTexto: {
    color: '#56664A',
    fontSize: 12,
    flex: 1,
  },

  botonGuardar: {
    backgroundColor: '#33452D',
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 50,
  },

  botonDeshabilitado: { opacity: 0.65 },

  textoGuardar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  botonCancelar: {
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 5,
  },

  textoCancelar: {
    color: '#6C7565',
    fontSize: 14,
    fontWeight: '700',
  },
});

