
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';

import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../config/apiConfig';

export const PantallaRegistroPuestero = ({ navigation }) => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [nombreEmprendimiento, setNombreEmprendimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');

 const registrar = async () => {
    if (
        !nombre ||
        !apellido ||
        !email ||
        !telefono ||
        !password ||
        !confirmarPassword ||
        !nombreEmprendimiento
    ) {
        alert('Completá todos los campos obligatorios.');
        return;
    }

    if (password !== confirmarPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const respuesta = await axios.post(`${API_URL}/registrar`, {
            nombre,
            apellido,
            email,
            password,
            rol: 'usuario'
        });

        const id_usuario = respuesta.data.id_usuario;

        await axios.post(`${API_URL}/solicitarSerPuestero`, {
            id_usuario,
            nombre_emprendimiento: nombreEmprendimiento,
            telefono,
            descripcion
        });

        alert('Cuenta creada. Tu solicitud para ser puestero quedó pendiente de aprobación.');

        navigation.navigate('Login');

    } catch (error) {
        console.error('Error en el registro:', error.response?.data || error.message);

        alert(
            error.response?.data?.mensaje ||
            'No se pudo completar el registro.'
        );
    }
};

  return (
    <View style={styles.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor="#101512" />

      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#D9B95B" />
          <Text style={styles.textoVolver}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.encabezado}>
          <View style={styles.logoContenedor}>
            <Image
              source={require('../Assets/iconPlazaGO.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.nombreApp}>PLAZAGO</Text>

          <View style={styles.subtituloContenedor}>
            <View style={styles.lineaDecorativa} />
            <Text style={styles.subtitulo}>SAN MARTÍN</Text>
            <View style={styles.lineaDecorativa} />
          </View>

          <Text style={styles.frase}>
            Registrá tu emprendimiento
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <View style={styles.detalleSuperior} />

          <Text style={styles.titulo}>Crear cuenta de puestero</Text>

          <Text style={styles.descripcion}>
            Completá tus datos para comenzar a formar parte de PlazaGo.
          </Text>

          {/* DATOS PERSONALES */}

          <Text style={styles.seccion}>DATOS PERSONALES</Text>

          <Text style={styles.etiqueta}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#68766B"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.etiqueta}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu apellido"
            placeholderTextColor="#68766B"
            value={apellido}
            onChangeText={setApellido}
          />

          <Text style={styles.etiqueta}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#68766B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.etiqueta}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu número de contacto"
            placeholderTextColor="#68766B"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
          />

          {/* DATOS DE CUENTA */}

          <View style={styles.separador} />

          <Text style={styles.seccion}>SEGURIDAD DE LA CUENTA</Text>

          <Text style={styles.etiqueta}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Creá una contraseña"
            placeholderTextColor="#68766B"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.etiqueta}>Confirmar contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Repetí tu contraseña"
            placeholderTextColor="#68766B"
            secureTextEntry
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
          />

          {/* EMPRENDIMIENTO */}

          <View style={styles.separador} />

          <Text style={styles.seccion}>MI EMPRENDIMIENTO</Text>

          <Text style={styles.etiqueta}>Nombre del emprendimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="¿Cómo se llama tu puesto?"
            placeholderTextColor="#68766B"
            value={nombreEmprendimiento}
            onChangeText={setNombreEmprendimiento}
          />

          <Text style={styles.etiqueta}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            placeholder="Contanos qué productos ofrecés..."
            placeholderTextColor="#68766B"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <View style={styles.aviso}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#D9B95B"
            />
            <Text style={styles.textoAviso}>
              Tu solicitud podrá ser revisada por la administración de PlazaGo.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botonRegistrar}
            onPress={registrar}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBoton}>
              Crear mi cuenta
            </Text>
            <Ionicons name="arrow-forward" size={19} color="#182016" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoCancelar}>
              Volver al paso anterior
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.pie}>
          FERIAS LOCALES · COMUNIDAD · COMERCIO
        </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  contenedor: {
    flex: 1,
    backgroundColor: '#101512',
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 25,
  },

  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 25,
  },

  textoVolver: {
    color: '#D9B95B',
    fontSize: 13,
    fontWeight: '600',
  },

  encabezado: {
    alignItems: 'center',
    marginBottom: 27,
  },

  logoContenedor: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#1A211C',
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  logo: {
    width: 64,
    height: 64,
  },

  nombreApp: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#F2F5EF',
  },

  subtituloContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },

  lineaDecorativa: {
    width: 23,
    height: 1,
    backgroundColor: '#D9B95B',
    opacity: 0.7,
  },

  subtitulo: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
  },

  frase: {
    color: '#98A399',
    fontSize: 13,
    marginTop: 9,
  },

  tarjeta: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#1A211C',
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.28)',
    borderRadius: 20,
    padding: 22,
    overflow: 'hidden',
  },

  detalleSuperior: {
    position: 'absolute',
    top: 0,
    left: 22,
    right: 22,
    height: 2,
    backgroundColor: '#D9B95B',
    opacity: 0.65,
  },

  titulo: {
    color: '#F2F5EF',
    fontSize: 23,
    fontWeight: '800',
  },

  descripcion: {
    color: '#98A399',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 25,
  },

  seccion: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 16,
  },

  etiqueta: {
    color: '#DCE3D9',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 13,
  },

  input: {
    height: 48,
    backgroundColor: '#111712',
    borderWidth: 1,
    borderColor: '#354137',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#F2F5EF',
    fontSize: 13,
  },

  inputMultilinea: {
    height: 100,
    paddingTop: 13,
  },

  separador: {
    height: 1,
    backgroundColor: '#354137',
    marginVertical: 24,
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#252D23',
    borderRadius: 10,
    padding: 12,
    gap: 9,
    marginTop: 22,
  },

  textoAviso: {
    color: '#AAB5A8',
    fontSize: 11,
    lineHeight: 17,
    flex: 1,
  },

  botonRegistrar: {
    height: 51,
    backgroundColor: '#D9F36A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
  },

  textoBoton: {
    color: '#182016',
    fontSize: 14,
    fontWeight: '900',
  },

  botonCancelar: {
    alignItems: 'center',
    marginTop: 20,
  },

  textoCancelar: {
    color: '#98A399',
    fontSize: 12,
    fontWeight: '600',
  },

  pie: {
    color: '#647067',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 25,
  },

});
