
import React, { useContext, useState } from 'react';
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

const TIPOS_PUESTO = [
  'Artesanías',
  'Gastronomía',
  'Indumentaria',
  'Accesorios',
  'Plantas',
  'Alimentos',
  'Servicios',
  'Otros',
];

export const PantallaCargarMiPuesto = () => {
  const { usuario } = useContext(AppContext);

  const fondoPantallaConfiguracion =
    'https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png';

  const [nombrePuesto, setNombrePuesto] = useState('');
  const [tipoPuesto, setTipoPuesto] = useState('');
  const [presentacion, setPresentacion] = useState('');

  const [imagenPuesto, setImagenPuesto] = useState('');
  const [imagenMarca, setImagenMarca] = useState('');

  const [referentes, setReferentes] = useState(['']);

  const [telefono, setTelefono] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [otroEnlace, setOtroEnlace] = useState('');

  const [guardando, setGuardando] = useState(false);

  const actualizarReferente = (texto, indice) => {
    setReferentes((anteriores) =>
      anteriores.map((nombre, i) =>
        i === indice ? texto : nombre
      )
    );
  };

  const agregarReferente = () => {
    setReferentes((anteriores) => [...anteriores, '']);
  };

  const eliminarReferente = (indice) => {
    if (referentes.length === 1) {
      Alert.alert(
        'Referente obligatorio',
        'El puesto debe tener al menos un referente.'
      );
      return;
    }

    setReferentes((anteriores) =>
      anteriores.filter((_, i) => i !== indice)
    );
  };

  const guardarConfiguracion = async () => {
    if (
      !nombrePuesto.trim() ||
      !tipoPuesto ||
      !referentes.some((nombre) => nombre.trim())
    ) {
      Alert.alert(
        'Datos incompletos',
        'Ingresá el nombre del puesto, su tipo y al menos un referente.'
      );
      return;
    }

    // Pendiente: conectar con el endpoint real de PlazaGo.
    Alert.alert(
      'Configuración preparada',
      'Los datos están listos para conectarse al guardado del backend.'
    );
  };

  const Campo = ({
    etiqueta,
    valor,
    cambiar,
    placeholder,
    multilinea,
    teclado,
  }) => (
    <View style={styles.campo}>
      <Text style={styles.label}>{etiqueta}</Text>

      <TextInput
        style={[
          styles.input,
          multilinea && styles.inputMultilinea,
        ]}
        value={valor}
        onChangeText={cambiar}
        placeholder={placeholder}
        placeholderTextColor="#969D8C"
        multiline={!!multilinea}
        keyboardType={teclado || 'default'}
        autoCapitalize="sentences"
      />
    </View>
  );

  const CampoImagen = ({
    titulo,
    descripcion,
    valor,
    cambiar,
    principal,
  }) => (
    <View style={styles.tarjetaImagen}>
      <View
        style={[
          styles.vistaImagen,
          principal && styles.vistaImagenPrincipal,
        ]}
      >
        {valor.trim() ? (
          <Image
            source={{ uri: valor.trim() }}
            style={styles.imagen}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.iconoImagen}>
            {principal ? '🏕️' : '🏷️'}
          </Text>
        )}
      </View>

      <View style={styles.contenidoImagen}>
        <Text style={styles.tituloImagen}>{titulo}</Text>
        <Text style={styles.descripcionImagen}>
          {descripcion}
        </Text>

        <TextInput
          style={styles.inputImagen}
          value={valor}
          onChangeText={cambiar}
          placeholder="Pegá la URL de la imagen"
          placeholderTextColor="#969D8C"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>
    </View>
  );

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
            <Text style={styles.etiqueta}>PLAZAGO · MI ESPACIO</Text>

            <Text style={styles.titulo}>
              Configurá tu puesto
            </Text>

            <Text style={styles.subtitulo}>
              Presentá tu propuesta para que los visitantes
              puedan conocerte.
            </Text>
          </View>

          <View style={styles.tarjetaUsuario}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>🏪</Text>
            </View>

            <View style={styles.datosUsuario}>
              <Text style={styles.nombreUsuario}>
                {usuario?.nombre || 'Mi puesto'}
              </Text>
              <Text style={styles.textoUsuario}>
                Perfil de puestero
              </Text>
            </View>

            <View style={styles.estado}>
              <Text style={styles.estadoTexto}>CONFIGURACIÓN</Text>
            </View>
          </View>

          {/* IDENTIDAD VISUAL */}
          <View style={styles.seccion}>
            <View style={styles.encabezadoSeccion}>
              <Text style={styles.numeroSeccion}>01</Text>
              <View style={styles.flex}>
                <Text style={styles.tituloSeccion}>
                  Identidad del puesto
                </Text>
                <Text style={styles.descripcionSeccion}>
                  Las imágenes que representan tu espacio y marca.
                </Text>
              </View>
            </View>

            <CampoImagen
              titulo="Imagen del puesto"
              descripcion="Una foto de tu puesto en la feria."
              valor={imagenPuesto}
              cambiar={setImagenPuesto}
              principal
            />

            <CampoImagen
              titulo="Logo o imagen de marca"
              descripcion="La identidad visual de tu emprendimiento."
              valor={imagenMarca}
              cambiar={setImagenMarca}
            />

            <Campo
              etiqueta="NOMBRE DEL PUESTO *"
              valor={nombrePuesto}
              cambiar={setNombrePuesto}
              placeholder="Ej. El Rincón Artesanal"
            />

            <Text style={styles.label}>TIPO DE PUESTO *</Text>

            <View style={styles.listaTipos}>
              {TIPOS_PUESTO.map((tipo) => {
                const seleccionado = tipoPuesto === tipo;

                return (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.chipTipo,
                      seleccionado && styles.chipTipoActivo,
                    ]}
                    onPress={() => setTipoPuesto(tipo)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.textoChip,
                        seleccionado && styles.textoChipActivo,
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* REFERENTES */}
          <View style={styles.seccion}>
            <View style={styles.encabezadoSeccion}>
              <Text style={styles.numeroSeccion}>02</Text>
              <View style={styles.flex}>
                <Text style={styles.tituloSeccion}>
                  Referentes del puesto
                </Text>
                <Text style={styles.descripcionSeccion}>
                  Indicá quiénes están a cargo del puesto.
                </Text>
              </View>
            </View>

            {referentes.map((nombre, indice) => (
              <View key={indice} style={styles.filaReferente}>
                <View style={styles.numeroReferente}>
                  <Text style={styles.numeroReferenteTexto}>
                    {indice + 1}
                  </Text>
                </View>

                <TextInput
                  style={styles.inputReferente}
                  value={nombre}
                  onChangeText={(texto) =>
                    actualizarReferente(texto, indice)
                  }
                  placeholder="Nombre y apellido"
                  placeholderTextColor="#969D8C"
                />

                {referentes.length > 1 && (
                  <TouchableOpacity
                    style={styles.botonEliminar}
                    onPress={() => eliminarReferente(indice)}
                  >
                    <Text style={styles.textoEliminar}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={agregarReferente}
              activeOpacity={0.75}
            >
              <Text style={styles.textoAgregar}>
                + Agregar referente
              </Text>
            </TouchableOpacity>
          </View>

          {/* PRESENTACIÓN */}
          <View style={styles.seccion}>
            <View style={styles.encabezadoSeccion}>
              <Text style={styles.numeroSeccion}>03</Text>
              <View style={styles.flex}>
                <Text style={styles.tituloSeccion}>
                  Presentación
                </Text>
                <Text style={styles.descripcionSeccion}>
                  Contales a los visitantes qué ofrecés.
                </Text>
              </View>
            </View>

            <Campo
              etiqueta="SOBRE EL PUESTO"
              valor={presentacion}
              cambiar={setPresentacion}
              placeholder="Contá la historia de tu emprendimiento, qué productos ofrecés y qué te diferencia..."
              multilinea
            />

            <Text style={styles.contador}>
              {presentacion.length} caracteres
            </Text>
          </View>

          {/* CONTACTO */}
          <View style={styles.seccion}>
            <View style={styles.encabezadoSeccion}>
              <Text style={styles.numeroSeccion}>04</Text>
              <View style={styles.flex}>
                <Text style={styles.tituloSeccion}>
                  Contacto y redes
                </Text>
                <Text style={styles.descripcionSeccion}>
                  Canales para que puedan encontrarte.
                </Text>
              </View>
            </View>

            <Campo
              etiqueta="TELÉFONO"
              valor={telefono}
              cambiar={setTelefono}
              placeholder="Ej. 11 1234-5678"
              teclado="phone-pad"
            />

            <View style={styles.campo}>
              <Text style={styles.label}>INSTAGRAM</Text>
              <View style={styles.filaRed}>
                <Text style={styles.iconoRed}>◎</Text>
                <TextInput
                  style={styles.inputRed}
                  value={instagram}
                  onChangeText={setInstagram}
                  placeholder="@tuemprendimiento o enlace"
                  placeholderTextColor="#969D8C"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>FACEBOOK</Text>
              <View style={styles.filaRed}>
                <Text style={styles.iconoRed}>f</Text>
                <TextInput
                  style={styles.inputRed}
                  value={facebook}
                  onChangeText={setFacebook}
                  placeholder="Nombre o enlace"
                  placeholderTextColor="#969D8C"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>TIKTOK</Text>
              <View style={styles.filaRed}>
                <Text style={styles.iconoRed}>♪</Text>
                <TextInput
                  style={styles.inputRed}
                  value={tiktok}
                  onChangeText={setTiktok}
                  placeholder="@tuemprendimiento o enlace"
                  placeholderTextColor="#969D8C"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <Campo
              etiqueta="OTRO ENLACE (OPCIONAL)"
              valor={otroEnlace}
              cambiar={setOtroEnlace}
              placeholder="Web, WhatsApp u otra red"
            />
          </View>

          <View style={styles.aviso}>
            <Text style={styles.avisoIcono}>ⓘ</Text>
            <Text style={styles.avisoTexto}>
              Los datos con * son obligatorios. Podés agregar
              varios referentes y completar tus redes más adelante.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.botonGuardar,
              guardando && styles.botonDeshabilitado,
            ]}
            onPress={guardarConfiguracion}
            disabled={guardando}
            activeOpacity={0.8}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.textoGuardar}>
                  Guardar configuración
                </Text>
                <Text style={styles.flechaGuardar}>→</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.pie}>
            PLAZAGO · TU PUESTO, TU IDENTIDAD
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

  tarjetaUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 25,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#E8EDD9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarTexto: {
    fontSize: 23,
  },

  datosUsuario: {
    flex: 1,
  },

  nombreUsuario: {
    fontSize: 16,
    fontWeight: '800',
    color: '#263323',
  },

  textoUsuario: {
    fontSize: 12,
    color: '#7A8175',
    marginTop: 4,
  },

  estado: {
    backgroundColor: '#EEF1E5',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 8,
  },

  estadoTexto: {
    fontSize: 8,
    fontWeight: '800',
    color: '#627A42',
    letterSpacing: 0.5,
  },

  seccion: {
    backgroundColor: 'rgba(255,255,255,0.91)',
    borderRadius: 19,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E2E7D9',
    marginBottom: 18,
  },

  encabezadoSeccion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 19,
  },

  numeroSeccion: {
    color: '#B79A4D',
    fontSize: 14,
    fontWeight: '900',
    marginRight: 12,
    marginTop: 2,
  },

  flex: {
    flex: 1,
  },

  tituloSeccion: {
    fontSize: 19,
    fontWeight: '800',
    color: '#293626',
  },

  descripcionSeccion: {
    fontSize: 12,
    color: '#7A8175',
    lineHeight: 18,
    marginTop: 5,
  },

  tarjetaImagen: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E7D9',
    borderRadius: 13,
    padding: 10,
    marginBottom: 12,
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

  vistaImagenPrincipal: {
    width: 92,
    height: 92,
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
  },

  tituloImagen: {
    color: '#35462D',
    fontSize: 14,
    fontWeight: '800',
  },

  descripcionImagen: {
    color: '#7A8175',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
  },

  inputImagen: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 8,
    fontSize: 11,
    color: '#293626',
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#56664A',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  campo: {
    marginTop: 15,
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

  listaTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },

  chipTipo: {
    borderWidth: 1,
    borderColor: '#DDE3D4',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  chipTipoActivo: {
    backgroundColor: '#33452D',
    borderColor: '#33452D',
  },

  textoChip: {
    color: '#58644F',
    fontSize: 12,
    fontWeight: '700',
  },

  textoChipActivo: {
    color: '#F0DDA7',
  },

  filaReferente: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    marginTop: 3,
  },

  textoAgregar: {
    color: '#526A3B',
    fontSize: 12,
    fontWeight: '800',
  },

  contador: {
    textAlign: 'right',
    color: '#8A9181',
    fontSize: 10,
    marginTop: 6,
  },

  filaRed: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3D4',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },

  iconoRed: {
    width: 30,
    fontSize: 22,
    fontWeight: '800',
    color: '#627A42',
  },

  inputRed: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 13,
    color: '#293626',
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF1E5',
    padding: 13,
    borderRadius: 11,
    marginTop: 2,
  },

  avisoIcono: {
    fontSize: 16,
    color: '#788A51',
    marginRight: 9,
  },

  avisoTexto: {
    flex: 1,
    color: '#56664A',
    fontSize: 12,
    lineHeight: 18,
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

  botonDeshabilitado: {
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

  pie: {
    textAlign: 'center',
    color: '#89917F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 22,
  },
});
