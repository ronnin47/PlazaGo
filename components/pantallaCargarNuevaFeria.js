
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
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
    !anio ||
    !mes ||
    !dia ||
    Number.isNaN(horas) ||
    Number.isNaN(minutos) ||
    horas < 0 ||
    horas > 23 ||
    minutos < 0 ||
    minutos > 59
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

export const PantallaCargarNuevaFeria = () => {
  const { usuario } = useContext(AppContext);
  const navigation = useNavigation();

  const fondoPantallaConfiguracion =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

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

      // Evita que el fin quede antes del nuevo inicio.
      if (nuevaFecha > fechaFin) {
        setFechaFin(nuevaFecha);
      }
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

const renderizarSelector = () => {
  if (selectorFecha) {
    return (
      <DateTimePicker
        value={obtenerFechaSeleccionada()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        minimumDate={
          selectorFecha === 'fin' ? fechaInicio : undefined
        }
        onValueChange={(evento, nuevaFecha) => {
          if (!(nuevaFecha instanceof Date)) return;

          if (selectorFecha === 'inicio') {
            setFechaInicio(nuevaFecha);

            if (nuevaFecha > fechaFin) {
              setFechaFin(nuevaFecha);
            }
          } else {
            setFechaFin(nuevaFecha);
          }

          setSelectorFecha(null);
        }}
        onDismiss={() => setSelectorFecha(null)}
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
        is24Hour={true}
        onValueChange={(evento, nuevaFecha) => {
          if (!(nuevaFecha instanceof Date)) return;

          const hora = formatearHora(nuevaFecha);

          if (selectorHora === 'inicio') {
            setHoraInicio(hora);
          } else {
            setHoraFin(hora);
          }

          setSelectorHora(null);
        }}
        onDismiss={() => setSelectorHora(null)}
      />
    );
  }

  return null;
};



  const crearFeria = async () => {
    if (!nombre.trim() || !ubicacion.trim()) {
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

      Alert.alert(
        'Feria creada',
        respuesta.data?.message ||
          'La feria se guardó correctamente como publicada.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
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

  return (
    <ImageBackground
      source={{ uri: fondoPantallaConfiguracion }}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover', opacity: 0.4 }}
    >
      <View style={styles.capaFondo}>
        <KeyboardAvoidingView
          style={styles.teclado}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ENCABEZADO */}
            <View style={styles.encabezado}>
              <View style={styles.encabezadoTexto}>
                <Text style={styles.etiqueta}>PLAZA GO</Text>
                <Text style={styles.titulo}>Nueva feria</Text>
                <Text style={styles.subtitulo}>
                  Completá los datos para registrar una feria.
                </Text>
              </View>

              <View style={styles.iconoAdmin}>
                <Text style={styles.iconoAdminTexto}>＋</Text>
              </View>
            </View>

            {/* FORMULARIO */}
            <View style={styles.tarjetaFormulario}>
              <Text style={styles.tituloSeccion}>
                Información de la feria
              </Text>

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
                numberOfLines={4}
                textAlignVertical="top"
              />

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

              <View style={styles.separadorFormulario} />

              <Text style={styles.tituloSeccion}>
                Fecha y horario
              </Text>

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

              <Text style={styles.label}>
                Fecha de finalización *
              </Text>

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

              {/* AVISO */}
              <View style={styles.avisoBorrador}>
  <Text style={styles.avisoIcono}>●</Text>
  <Text style={styles.avisoTexto}>
    La feria estará disponible para solicitar inscripciones.
  </Text>
</View>

              {/* GUARDAR */}
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
                  <Text style={styles.textoGuardar}>
                    Guardar feria
                  </Text>
                )}
              </TouchableOpacity>

              {/* VOLVER */}
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => navigation.goBack()}
                disabled={cargando}
                activeOpacity={0.8}
              >
                <Text style={styles.textoCancelar}>
                  Cancelar y volver
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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

  teclado: {
    flex: 1,
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
    marginBottom: 25,
  },

  encabezadoTexto: {
    flex: 1,
    marginRight: 12,
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
    lineHeight: 20,
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
    fontSize: 29,
    color: '#E7D39A',
  },

  tarjetaFormulario: {
    backgroundColor: 'rgba(248, 249, 243, 0.97)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#24351E',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  tituloSeccion: {
    fontSize: 20,
    fontWeight: '800',
    color: '#293626',
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#384633',
    marginBottom: 7,
    marginTop: 17,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },

  separadorFormulario: {
    height: 1,
    backgroundColor: '#DDE3D4',
    marginTop: 26,
    marginBottom: 22,
  },

  selectorFecha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 9,
  },

  iconoFecha: {
    fontSize: 23,
    color: '#627A42',
    width: 35,
  },

  contenidoFecha: {
    flex: 1,
  },

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
    padding: 13,
    borderRadius: 10,
    marginTop: 24,
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
    lineHeight: 18,
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

  botonDeshabilitado: {
    opacity: 0.65,
  },

  textoGuardar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  botonCancelar: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 5,
  },

  textoCancelar: {
    color: '#6C7565',
    fontSize: 14,
    fontWeight: '700',
  },
});
