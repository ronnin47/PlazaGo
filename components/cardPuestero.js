
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export const CardPuestero = ({ puesto, onPress,esFavorito  }) => {


  console.log(
  'CARD:',
  puesto.id_puesto,
  'FAVORITO:',
  esFavorito,
  'TIPO:',
  typeof esFavorito
);

  const referentes = (puesto.referentes || [])
    .slice(0, 3)
    .map((referente) => ({
      nombre: typeof referente === 'string'
        ? referente
        : referente.nombre,

      imagen_url: typeof referente === 'object'
        ? referente.imagen_url || referente.imagen || null
        : null,
    }))
    .filter(referente => referente.nombre);

  const inicialMarca = (puesto.nombre_puesto || '?')
    .charAt(0)
    .toUpperCase();

  return (
    <TouchableOpacity
      style={styles.tarjeta}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
    >

      {/* IMAGEN DEL REFERENTE */}
      <View style={styles.contenedorImagen}>

       {referentes[0]?.imagen_url ? (
  <Image
    source={{ uri: referentes[0].imagen_url }}
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

{esFavorito === true && (
  <View style={styles.etiquetaFavorito}>
    <Text style={styles.corazonFavorito}>♥</Text>
    <Text style={styles.textoFavorito}>FAVORITO</Text>
  </View>
)}

        {/* MARCA Y EMPRENDIMIENTO */}
        <View style={styles.overlayImagen}>

          {puesto.imagen_marca ? (
            <Image
              source={{ uri: puesto.imagen_marca }}
              style={styles.logoMarca}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoVacio}>
              <Text style={styles.inicialMarca}>
                {inicialMarca}
              </Text>
            </View>
          )}

          <View style={styles.infoMarca}>

            <Text
              style={styles.nombreMarca}
              numberOfLines={2}
            >
              {puesto.nombre_puesto}
            </Text>

            <Text
              style={styles.categoria}
              numberOfLines={1}
            >
              {puesto.categoria || 'Sin categoría'}
            </Text>

          </View>

        </View>

      </View>

      {/* REFERENTES DEL PUESTO */}
      <View style={styles.seccionReferentes}>

        <View style={styles.encabezadoReferentes}>

          <Text style={styles.tituloReferentes}>
            REFERENTES DEL PUESTO
          </Text>

          <View style={styles.lineaDecorativa} />

        </View>

        {referentes.length > 0 ? (

          <View style={styles.listaReferentes}>

            {referentes.map((referente, index) => (

              <View
                key={`${referente.nombre}-${index}`}
                style={styles.itemReferente}
              >

                {referente.imagen_url ? (
                  <Image
                    source={{ uri: referente.imagen_url }}
                    style={styles.fotoReferente}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.fotoVacia}>
                    <Text style={styles.inicialReferente}>
                      {referente.nombre.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}

                <Text
                  style={styles.nombreReferente}
                  numberOfLines={1}
                >
                  {referente.nombre}
                </Text>

              </View>

            ))}

          </View>

        ) : (

          <Text style={styles.sinReferentes}>
            Sin referentes registrados
          </Text>

        )}

      </View>

      <View style={styles.separador} />

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  tarjeta: {
    width: 220,
    backgroundColor: '#171C19',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.35)',
    overflow: 'hidden',
  },

  // IMAGEN DEL PUESTO

  contenedorImagen: {
    height: 210,
    backgroundColor: '#252A25',
    position: 'relative',
  },

  imagenPuesto: {
    width: '100%',
    height: '100%',
  },

  imagenVacia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#252D27',
  },

  textoImagenVacia: {
    color: '#8B9389',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  // MARCA SUPERPUESTA

  overlayImagen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 11,
    backgroundColor: 'rgba(15, 19, 16, 0.52)',
  },

  logoMarca: {
    width: 48,
    height: 48,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },

  logoVacio: {
    width: 48,
    height: 48,
    borderRadius: 9,
    backgroundColor: '#30382F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inicialMarca: {
    color: '#D9B95B',
    fontSize: 22,
    fontWeight: '800',
  },

  infoMarca: {
    flex: 1,
    justifyContent: 'center',
  },

  nombreMarca: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  categoria: {
    color: '#D9B95B',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },

  // REFERENTES

  seccionReferentes: {
    paddingHorizontal: 13,
    paddingTop: 14,
    paddingBottom: 12,
  },

  encabezadoReferentes: {
    marginBottom: 12,
  },

  tituloReferentes: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  lineaDecorativa: {
    width: 27,
    height: 2,
    backgroundColor: '#D9B95B',
    marginTop: 6,
    borderRadius: 2,
  },

  listaReferentes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 14,
  },

  itemReferente: {
    width: 58,
    alignItems: 'center',
  },

  fotoReferente: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#D9B95B',
    backgroundColor: '#30382F',
  },

  fotoVacia: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#D9B95B',
    backgroundColor: '#30382F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inicialReferente: {
    color: '#D9B95B',
    fontSize: 17,
    fontWeight: '800',
  },

  nombreReferente: {
    color: '#E1E3DC',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    width: '100%',
  },

  sinReferentes: {
    color: '#92988F',
    fontSize: 10,
    fontStyle: 'italic',
  },

  // SEPARADOR

  separador: {
    height: 1,
    backgroundColor: 'rgba(217, 185, 91, 0.22)',
    marginHorizontal: 13,
  },
etiquetaFavorito: {
  position: 'absolute',
  top: 12,
  right: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  paddingHorizontal: 12,
  height: 34,
  borderRadius: 18,
  backgroundColor: '#26382A',
  borderWidth: 1.5,
  borderColor: '#b7e639',
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  zIndex: 999,
},

corazonFavorito: {
  color: '#e0d7b6',
  fontSize: 15,
  includeFontPadding: false,
},

textoFavorito: {
  color: '#FFFFFF',
  fontSize: 11,
  fontWeight: '900',
  letterSpacing: 1,
  includeFontPadding: false,
},
 
});
