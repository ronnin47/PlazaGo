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

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useContext } from 'react';
import { AppContext } from '../provider/AppProvider';




import API_URL from '../config/apiConfig';

export const PantallaLogin = ({ navigation }) => {
  const { setUsuario, setLogueado } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const iniciarSesion = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Completá el usuario y la contraseña.');
      return;
    }

    try {
      const respuesta = await axios.post(
        `${API_URL}/login`,
        {
          email: email.trim(),
          password: password,
        }
      );

      if (respuesta.status === 200) {
        await AsyncStorage.setItem(
          'sesionUsuario',
          JSON.stringify(respuesta.data.usuario)
        );

        setUsuario(respuesta.data.usuario);
        setLogueado(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Usuario o contraseña incorrectos.');
      } else {
        alert('No se pudo conectar con el servidor.');
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#101512" />

      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text style={styles.subtitulo}>
              SAN MARTÍN
            </Text>
            <View style={styles.lineaDecorativa} />
          </View>

          <Text style={styles.frase}>
            Tu espacio en la feria
          </Text>
        </View>

        <View style={styles.tarjeta}>

          <View style={styles.detalleSuperior} />

          <Text style={styles.titulo}>Bienvenido</Text>

          <Text style={styles.descripcion}>
            Ingresá a tu cuenta para continuar.
          </Text>

          <Text style={styles.etiqueta}>
            CORREO ELECTRÓNICO
          </Text>

          <TextInput
            style={styles.input}
            placeholder="nombre@ejemplo.com"
            placeholderTextColor="#778078"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.etiqueta}>
            CONTRASEÑA
          </Text>

          <View style={styles.passwordContenedor}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingresá tu contraseña"
              placeholderTextColor="#778078"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setMostrarPassword(!mostrarPassword)}
            >
              <Text style={styles.mostrarTexto}>
                {mostrarPassword ? 'Ocultar' : 'Ver'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.olvido}
            onPress={() => alert('Recuperación de contraseña pendiente.')}
          >
            <Text style={styles.olvidoTexto}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.boton}
            onPress={iniciarSesion}
            activeOpacity={0.8}
          >
            <Text style={styles.botonTexto}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linea} />
            <Text style={styles.oTexto}>O</Text>
            <View style={styles.linea} />
          </View>

          <TouchableOpacity
            style={styles.botonSecundario}
            onPress={() => navigation.navigate('Registro')}
            activeOpacity={0.8}
          >
            <Text style={styles.botonSecundarioTexto}>
              Crear una cuenta
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.pie}>
          FERIAS LOCALES  ·  COMUNIDAD  ·  COMERCIO
        </Text>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({

  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#101512',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },

  encabezado: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoContenedor: {
    width: 86,
    height: 86,
    borderRadius: 25,
    backgroundColor: '#1A211C',
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  logo: {
    width: 72,
    height: 72,
  },

  nombreApp: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#F2F5EF',
  },

  subtituloContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    gap: 10,
  },

  lineaDecorativa: {
    width: 25,
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
    padding: 24,
    overflow: 'hidden',
  },

  detalleSuperior: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: '#D9B95B',
    opacity: 0.65,
  },

  titulo: {
    color: '#F2F5EF',
    fontSize: 26,
    fontWeight: '800',
  },

  descripcion: {
    color: '#98A399',
    fontSize: 13,
    marginTop: 7,
    marginBottom: 27,
  },

  etiqueta: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
  },

  input: {
    height: 50,
    backgroundColor: '#111712',
    borderWidth: 1,
    borderColor: '#354137',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 21,
  },

  passwordContenedor: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111712',
    borderWidth: 1,
    borderColor: '#354137',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 13,
  },

  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 0,
  },

  mostrarTexto: {
    color: '#D9B95B',
    fontSize: 12,
    fontWeight: '700',
    paddingLeft: 10,
  },

  olvido: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },

  olvidoTexto: {
    color: '#D9B95B',
    fontSize: 12,
    fontWeight: '600',
  },

  boton: {
    height: 51,
    backgroundColor: '#D9F36A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botonTexto: {
    color: '#182016',
    fontSize: 14,
    fontWeight: '900',
  },

  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  linea: {
    flex: 1,
    height: 1,
    backgroundColor: '#354137',
  },

  oTexto: {
    color: '#D9B95B',
    fontSize: 11,
    fontWeight: '700',
    marginHorizontal: 13,
  },

  botonSecundario: {
    height: 48,
    backgroundColor: '#22352A',
    borderWidth: 1,
    borderColor: 'rgba(217,185,91,0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botonSecundarioTexto: {
    color: '#E7EDE4',
    fontSize: 13,
    fontWeight: '700',
  },

  pie: {
    color: '#647067',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginTop: 27,
  },

});