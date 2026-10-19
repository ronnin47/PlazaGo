import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';



export const PantallaLogin = ({ navigation }) => {
 
 
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

const iniciarSesion = () => {
  if (!email.trim() || !password.trim()) {
    alert('Completá el usuario y la contraseña.');
    return;
  }

  if (email.trim() === 'admin' && password === '1234') {
  navigation.navigate('Principal', {
  screen: 'StackHome',
  params: {
    screen: 'Inicio',
  },
});

    
  } else {
    alert('Usuario o contraseña incorrectos.');
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
          <View style={styles.logo}>
            <Text style={styles.logoTexto}>P</Text>
          </View>

          <Text style={styles.nombreApp}>PLAZAGO</Text>
          <Text style={styles.subtitulo}>
            Tu espacio en la feria
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Bienvenido</Text>
          <Text style={styles.descripcion}>
            Ingresá a tu cuenta para continuar.
          </Text>

          <Text style={styles.etiqueta}>Correo electrónico</Text>
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

          <Text style={styles.etiqueta}>Contraseña</Text>

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
            <Text style={styles.botonTexto}>Iniciar sesión</Text>
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linea} />
            <Text style={styles.oTexto}>O</Text>
            <View style={styles.linea} />
          </View>

          <TouchableOpacity
            style={styles.botonSecundario}
            onPress={() => alert('Registro pendiente de implementar.')}
            activeOpacity={0.8}
          >
            <Text style={styles.botonSecundarioTexto}>
              Crear una cuenta
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.pie}>
          FERIAS LOCALES · COMUNIDAD · COMERCIO
        </Text>
      </ScrollView>

    </>
  
      
    
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#101512',
  },
  contenido: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  encabezado: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#D9F36A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  logoTexto: {
    fontSize: 32,
    fontWeight: '900',
    color: '#172016',
  },
  nombreApp: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#F2F5EF',
  },
  subtitulo: {
    color: '#98A399',
    fontSize: 14,
    marginTop: 6,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#1A211C',
    borderWidth: 1,
    borderColor: '#2B352D',
    borderRadius: 22,
    padding: 24,
  },
  titulo: {
    color: '#F2F5EF',
    fontSize: 27,
    fontWeight: '800',
  },
  descripcion: {
    color: '#98A399',
    fontSize: 14,
    marginTop: 7,
    marginBottom: 27,
  },
  etiqueta: {
    color: '#DDE4DA',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 9,
  },
  input: {
    height: 51,
    backgroundColor: '#111712',
    borderWidth: 1,
    borderColor: '#354137',
    borderRadius: 11,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 21,
  },
  passwordContenedor: {
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111712',
    borderWidth: 1,
    borderColor: '#354137',
    borderRadius: 11,
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
    color: '#D9F36A',
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: 10,
  },
  olvido: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  olvidoTexto: {
    color: '#D9F36A',
    fontSize: 12,
    fontWeight: '600',
  },
  boton: {
    height: 52,
    backgroundColor: '#D9F36A',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: {
    color: '#182016',
    fontSize: 15,
    fontWeight: '800',
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
    color: '#829084',
    fontSize: 12,
    marginHorizontal: 13,
  },
  botonSecundario: {
    height: 49,
    borderWidth: 1,
    borderColor: '#475449',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSecundarioTexto: {
    color: '#E7EDE4',
    fontSize: 14,
    fontWeight: '700',
  },
  pie: {
    color: '#647067',
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 1.3,
    marginTop: 28,
  },
});