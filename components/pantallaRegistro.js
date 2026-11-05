
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';

import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export const PantallaRegistro = ({ navigation }) => {

  const [tipoCuenta, setTipoCuenta] = useState(null);

 const continuar = () => {
  if (!tipoCuenta) {
    alert('Seleccioná el tipo de cuenta.');
    return;
  }

  if (tipoCuenta === 'puestero') {
    navigation.navigate('RegistroPuestero');
    return;
  }

  if (tipoCuenta === 'usuario') {
    navigation.navigate('RegistroUsuario');
  }
};

  return (
    <View style={styles.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor="#101512" />

      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#D9B95B" />
          <Text style={styles.textoVolver}>Volver al inicio</Text>
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

          <Text style={styles.frase}>Formá parte de nuestra comunidad</Text>

        </View>

        <View style={styles.tarjeta}>

          <View style={styles.detalleSuperior} />

          <Text style={styles.titulo}>Crear una cuenta</Text>

          <Text style={styles.descripcion}>
            Primero contanos cómo querés participar en PlazaGo.
          </Text>

          <Text style={styles.etiqueta}>
            SELECCIONÁ TU TIPO DE CUENTA
          </Text>

          {/* CUENTA USUARIO */}

          <TouchableOpacity
            style={[
              styles.opcion,
              tipoCuenta === 'usuario' && styles.opcionSeleccionada,
            ]}
            onPress={() => setTipoCuenta('usuario')}
            activeOpacity={0.85}
          >
            <View style={styles.iconoContenedor}>
              <Ionicons name="person-outline" size={27} color="#D9B95B" />
            </View>

            <View style={styles.datosOpcion}>
              <Text style={styles.tituloOpcion}>Soy usuario</Text>

              <Text style={styles.descripcionOpcion}>
                Quiero recorrer la feria, descubrir puestos y conocer productos.
              </Text>

              <Text style={styles.detalleOpcion}>
                EXPLORAR PLAZAGO
              </Text>
            </View>

            <Ionicons
              name={tipoCuenta === 'usuario' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={tipoCuenta === 'usuario' ? '#D9B95B' : '#68766B'}
            />
          </TouchableOpacity>

          {/* CUENTA PUESTERO */}

          <TouchableOpacity
            style={[
              styles.opcion,
              tipoCuenta === 'puestero' && styles.opcionSeleccionada,
            ]}
            onPress={() => setTipoCuenta('puestero')}
            activeOpacity={0.85}
          >
            <View style={styles.iconoContenedor}>
              <Ionicons name="storefront-outline" size={27} color="#D9B95B" />
            </View>

            <View style={styles.datosOpcion}>
              <Text style={styles.tituloOpcion}>Soy puestero</Text>

              <Text style={styles.descripcionOpcion}>
                Tengo un emprendimiento y quiero formar parte de la feria.
              </Text>

              <Text style={styles.detalleOpcion}>
                REGISTRAR MI EMPRENDIMIENTO
              </Text>
            </View>

            <Ionicons
              name={tipoCuenta === 'puestero' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={tipoCuenta === 'puestero' ? '#D9B95B' : '#68766B'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonContinuar,
              !tipoCuenta && styles.botonDeshabilitado,
            ]}
            onPress={continuar}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBoton}>
              Continuar
            </Text>

            <Ionicons name="arrow-forward" size={19} color="#182016" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoCancelar}>
              Ya tengo una cuenta. Iniciar sesión
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.pie}>
          FERIAS LOCALES  ·  COMUNIDAD  ·  COMERCIO
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 25,
  },

  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    fontSize: 25,
    fontWeight: '800',
  },

  descripcion: {
    color: '#98A399',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 25,
  },

  etiqueta: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 13,
  },

  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111712',
    borderWidth: 1,
    borderColor: '#354137',
    borderRadius: 13,
    padding: 14,
    marginBottom: 13,
  },

  opcionSeleccionada: {
    borderColor: '#D9B95B',
    backgroundColor: '#253126',
  },

  iconoContenedor: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#263329',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  datosOpcion: {
    flex: 1,
    paddingRight: 8,
  },

  tituloOpcion: {
    color: '#F2F5EF',
    fontSize: 15,
    fontWeight: '800',
  },

  descripcionOpcion: {
    color: '#98A399',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  detalleOpcion: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 9,
  },

  botonContinuar: {
    height: 51,
    backgroundColor: '#D9F36A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
  },

  botonDeshabilitado: {
    opacity: 0.5,
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
