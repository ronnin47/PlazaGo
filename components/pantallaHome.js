import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { AppContext } from '../provider/AppProvider';
import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import API_URL from '../config/apiConfig';


console.log('API_URL en PantallaHome:', API_URL);
import axios from 'axios';




const fondoPantallaHome2="https://res.cloudinary.com/dzul1hatw/image/upload/v1792521295/Fondo_org%C3%A1nico_verde_y_dorado_komwcn.png"









export const PantallaHome = () => {
  const { usuario } = useContext(AppContext);
 const [proximaFeria, setProximaFeria] = useState(null);
const [puestos,setPuestos]=useState([]);
  const [clima,setClima]=useState(null);

  const navigation = useNavigation();

// vamos a asumir que cuando entra a una receta en ese momento se guarda en el historial de busquedas, y si ya estaba no se repite, y solo se mantiene un maximo de 5 ultimas busquedas
// y eso lo guardamos en el contexto, y lo mostramos en la pantalla de inicio, y si no hay ultimas busquedas mostramos un mensaje que diga "Todavía no realizaste ninguna búsqueda."

useEffect(() => {
  obtenerProximaFeria();
  obtenerClima();
}, []);



const obtenerClima = async (fechaFeria) => {
  if (!fechaFeria) return;

  try {
    const fecha = new Date(fechaFeria);
    const fechaConsulta = [
      fecha.getFullYear(),
      String(fecha.getMonth() + 1).padStart(2, '0'),
      String(fecha.getDate()).padStart(2, '0'),
    ].join('-');

    const respuesta = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: -34.57741887080065,
          longitude: -58.539048090951056,
          daily:
            'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
          timezone: 'America/Argentina/Buenos_Aires',
          start_date: fechaConsulta,
          end_date: fechaConsulta,
        },
      }
    );

    const datos = respuesta.data.daily;

    setClima({
      weather_code: datos.weather_code[0],
      temperatura_maxima: datos.temperature_2m_max[0],
      temperatura_minima: datos.temperature_2m_min[0],
      probabilidad_lluvia: datos.precipitation_probability_max[0],
    });
  } catch (error) {
    console.error(
      'Error al obtener el pronóstico de la feria:',
      error.message
    );
    setClima(null);
  }
};


const obtenerProximaFeria = async () => {
    const url = `${API_URL}/proximaFeria`;

    try {
        //console.log('Consultando próxima feria:', url);

        const respuesta = await axios.get(url, {
            timeout: 10000,
        });

        //console.log('Respuesta de próxima feria:', respuesta.data);

        const feria = respuesta.data.feria ?? null;

        setProximaFeria(feria);

       /* console.log(
            'Datos de la feria:',
            JSON.stringify(feria, null, 2)
        );
*/
        if (feria?.fecha_inicio) {
            await obtenerClima(feria.fecha_inicio);
        } else {
            setClima(null);
            console.log('La feria no tiene fecha de inicio.');
        }

    } catch (error) {
        console.error(
            'Error al obtener la próxima feria:',
            error.message
        );
        console.error('URL solicitada:', url);
        console.error('Respuesta del servidor:', error.response?.data);
        console.error('Código HTTP:', error.response?.status);
        console.error('Código de error:', error.code);

        if (error.response?.status === 404) {
            setProximaFeria(null);
            setClima(null);
        }
    }
};

const obtenerPuestosFeria = async () => {
  if (!proximaFeria?.id_feria) {
    setPuestos([]);
    return;
  }

  try {
    const respuesta = await axios.get(
      `${API_URL}/obtenerPuestosAprobadosFeria`,
      {
        params: {
          id_feria: proximaFeria.id_feria,
        },
      }
    );

    setPuestos(
      Array.isArray(respuesta.data) ? respuesta.data : []
    );
  } catch (error) {
    console.error(
      'Error al obtener los puestos de la feria:',
      error.response?.data || error.message
    );

    setPuestos([]);
  }
};

useEffect(() => {
  obtenerPuestosFeria();
}, [proximaFeria?.id_feria]);


const productosDestacados = [
  {
    id: 1,
    imagen: "https://sierrasandaluzas.com/wp-content/uploads/2021/11/miel-cruda-eco-1024x683.jpg",
    nombre: "Miel artesanal",
    descripcion: "Miel pura de producción local.",
    categoria: "Alimentos",
    nombrePuesto: "El Rincón Apícola",
  },
  {
    id: 2,
    imagen: "https://d22fxaf9t8d39k.cloudfront.net/beeeb959ec1bd78c9bfa239382a27b3a6a371bd5ec2dfc17ece2c578ce5712b1437090.png",
    nombre: "Cuenco de cerámica",
    descripcion: "Pieza artesanal hecha a mano.",
    categoria: "Artesanías",
    nombrePuesto: "Cerámica del Sur",
  },
  {
    id: 3,
    imagen: "https://www.conasi.eu/blog/wp-content/uploads/2015/10/Pan-hecho-con-masa-madre-900x629.jpg",
    nombre: "Pan de masa madre",
    descripcion: "Pan artesanal de fermentación lenta.",
    categoria: "Panadería",
    nombrePuesto: "La Espiga",
  },
  {
    id: 4,
    imagen: "https://content.elmueble.com/medio/2019/12/11/como-hacer-jabon-natural_c5d7893d_674x818.jpg",
    nombre: "Jabón natural",
    descripcion: "Jabón elaborado con ingredientes naturales.",
    categoria: "Cosmética natural",
    nombrePuesto: "Esencia Viva",
  },
  {
    id: 5,
    imagen: "https://acdn-us.mitiendanube.com/stores/005/381/375/products/j-72-134a0102d25bb0fba717368178164582-1024-1024.webp",
    nombre: "Collar artesanal",
    descripcion: "Collar hecho a mano con piedras naturales.",
    categoria: "Accesorios",
    nombrePuesto: "Piedra y Plata",
  },
  {
    id: 6,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTleBX8laO5qNr9_gykziSNmVS2PfeLo4Rrw5BKvuZmrA&s=10",
    nombre: "Mermelada de frutilla",
    descripcion: "Mermelada casera elaborada en pequeños lotes.",
    categoria: "Alimentos",
    nombrePuesto: "Dulces del Campo",
  },
  {
    id: 7,
    imagen: "https://scontent.faep7-1.fna.fbcdn.net/v/t39.30808-6/360097105_770514561542156_3730272878156361880_n.jpg?stp=dst-jpg_tt6&cstp=mx662x660&ctp=s662x660&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=aKe5sW140bMQ7kNvwEUrpFl&_nc_oc=AdpczQg6uXCGIjZrGMzJali0Ekovbf6ySUGH-VtsFOcPSmL1MjRA4HgaPQ-wN0wr9L9Bs8yp9jV-DRj_L47aJvxw&_nc_zt=23&_nc_ht=scontent.faep7-1.fna&_nc_gid=eNO2WdRABrPz0JxpBVXN_Q&_nc_ss=7b2a8&oh=00_AQNqQR2O6Ry4HzZrISxRiSARsD4zminwcOQIKwzkH54yTg&oe=6ADDE523",
    nombre: "Maceta pintada a mano",
    descripcion: "Maceta decorativa con diseño original.",
    categoria: "Decoración",
    nombrePuesto: "Verde Hogar",
  },
  {
    id: 8,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_q63OrZmT9jEnBE2MH-P53ixq1VpR8cEYi6xu__6xz2fu2_5eT1I0FeKE&s=10",
    nombre: "Budín de naranja",
    descripcion: "Budín casero con naranja fresca.",
    categoria: "Pastelería",
    nombrePuesto: "La Cocina de Ana",
  },
  {
    id: 9,
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEWPDw8egIE6_yDDo08uqF9kibZvhoJadonKyyA3_FNg&s=10",
    nombre: "Bolsa de tela estampada",
    descripcion: "Bolsa reutilizable con estampado artesanal.",
    categoria: "Textiles",
    nombrePuesto: "Trama Creativa",
  },
  {
    id: 10,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_632804-MLA114083100625_072026-O.webp",
    nombre: "Vela aromática",
    descripcion: "Vela artesanal con fragancia de lavanda.",
    categoria: "Decoración",
    nombrePuesto: "Luz de Luna",
  },
];






const frasesDelDia = [
  'Los mejores descubrimientos empiezan con un paseo.',
  'Detrás de cada puesto hay una historia por conocer.',
  'Hoy puede ser el día en que encuentres algo único.',
  'Lo artesanal tiene algo que lo industrial no puede copiar.',
  'Un pequeño productor también puede crear algo extraordinario.',
  'Salí a descubrir, siempre hay algo nuevo esperándote.',
  'Apoyar lo local es ayudar a crecer a toda una comunidad.',
];


const fechaHoy = new Date();

const numeroDia = Math.floor(
  Date.UTC(
    fechaHoy.getFullYear(),
    fechaHoy.getMonth(),
    fechaHoy.getDate()
  ) / 86400000
);

const fraseDelDia =
  frasesDelDia[
    ((numeroDia % frasesDelDia.length) +
      frasesDelDia.length) %
      frasesDelDia.length
  ];

const fechaFeria = proximaFeria?.fecha_inicio
  ? new Date(proximaFeria.fecha_inicio)
  : null;

const fechaFinFeria = proximaFeria?.fecha_fin
  ? new Date(proximaFeria.fecha_fin)
  : null;

const formatearFecha = (fecha) =>
  fecha
    ? fecha.toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
      })
    : '';

const formatearHora = (fecha) =>
  fecha
    ? fecha.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '';

const fechaActualArgentina = new Date(
  fechaHoy.toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  }) + 'T12:00:00'
);

const fechaFeriaArgentina = fechaFeria
  ? new Date(
      fechaFeria.toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }) + 'T12:00:00'
    )
  : null;

const diasRestantes = fechaFeriaArgentina
  ? Math.round(
      (fechaFeriaArgentina.getTime() -
        fechaActualArgentina.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  : null;


const obtenerDescripcionClima = (codigo) => {
  if (codigo === 0) return 'Despejado';
  if (codigo === 1) return 'Mayormente despejado';
  if (codigo === 2) return 'Parcialmente nublado';
  if (codigo === 3) return 'Nublado';

  if (codigo === 45 || codigo === 48) return 'Niebla';

  if ([51, 53, 55, 56, 57].includes(codigo)) {
    return 'Llovizna';
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) {
    return 'Lluvia';
  }

  if ([71, 73, 75, 77, 85, 86].includes(codigo)) {
    return 'Nieve';
  }

  if ([95, 96, 99].includes(codigo)) {
    return 'Tormenta';
  }

  return 'Clima variable';
};


return (
  <ImageBackground
    source={{ uri: fondoPantallaHome2 }}
    style={styles.background}
    imageStyle={{ resizeMode: 'cover', opacity: 0.7 }}
  >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenidoHome}
      showsVerticalScrollIndicator={false}
    >


{/* PRÓXIMA FERIA */}
<View style={styles.seccionProximaFeria}>
  <View style={styles.encabezadoSeccion}>
    <View style={styles.indicadorSeccion} />

    <Text style={styles.etiquetaSeccion}>
      PRÓXIMA FERIA
    </Text>

    {proximaFeria && diasRestantes >= 0 && (
      <View
        style={[
          styles.contadorDias,
          diasRestantes === 0 && styles.contadorHoy,
        ]}
      >
        <Text
          style={[
            styles.textoContadorDias,
            diasRestantes === 0 && styles.textoHoy,
          ]}
        >
          {diasRestantes === 0
            ? '¡HOY HAY FERIA!'
            : `FALTAN ${diasRestantes} ${
                diasRestantes === 1 ? 'DÍA' : 'DÍAS'
              }`}
        </Text>
      </View>
    )}
  </View>

  {proximaFeria && fechaFeria ? (
    <>
      {/* IMAGEN Y DATOS DE LA FERIA */}
      <View style={styles.contenedorImagenFeria}>
        <Image
          source={{ uri: proximaFeria.imagen_url }}
          style={styles.imagenFeria}
          resizeMode="cover"
        />

        <View style={styles.overlayImagenFeria} />

        <View style={styles.contenidoSobreImagen}>
          {/* FECHAS Y HORARIOS */}
          <View style={styles.filaInformacionFeria}>
            <View style={styles.tarjetaFecha}>
              <Text style={styles.diaSemana}>
                {fechaFeria.toLocaleDateString('es-AR', {
                  weekday: 'long',
                  timeZone: 'UTC',
                })}
              </Text>

              <Text style={styles.valorFechaImagen}>
                {fechaFeria.toLocaleDateString('es-AR', {
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </Text>

              <Text style={styles.mesFecha}>
                {fechaFeria.toLocaleDateString('es-AR', {
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </Text>

              <View style={styles.separadorFecha} />

              <Text style={styles.etiquetaFecha}>
                HORARIO DE APERTURA
              </Text>

              <Text style={styles.valorHorarioImagen}>
                {fechaFeria.toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'UTC',
                })}
              </Text>

              <View style={styles.separadorFecha} />

              <Text style={styles.etiquetaFecha}>
                FECHA DE CIERRE
              </Text>

              <Text style={styles.valorHorarioImagen}>
                {fechaFinFeria
                  ? fechaFinFeria.toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })
                  : 'Sin fecha definida'}
              </Text>

              <Text style={styles.etiquetaFecha}>
                HORARIO DE CIERRE
              </Text>

              <Text style={styles.valorHorarioImagen}>
                {fechaFinFeria
                  ? fechaFinFeria.toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'UTC',
                    })
                  : '--:--'}
              </Text>
            </View>
          </View>

          {/* TÍTULO SOBRE LA IMAGEN */}
          <View style={styles.tituloSobreImagen}>
            <Text style={styles.etiquetaImagen}>
              FERIA DESTACADA
            </Text>

            <Text style={styles.tituloFeria}>
              {proximaFeria.nombre}
            </Text>
          </View>
        </View>
      </View>

      {/* PRONÓSTICO PARA LA FERIA */}
<View style={styles.datosClimaFeria}>
  {clima ? (
    <>
      <View style={styles.iconoClimaContenedor}>
        <Text style={styles.iconoClimaFeria}>
          {clima.weather_code === 0
            ? '☀️'
            : clima.weather_code <= 2
            ? '🌤️'
            : clima.weather_code === 3
            ? '☁️'
            : clima.weather_code === 45 ||
              clima.weather_code === 48
            ? '🌫️'
            : clima.weather_code >= 95
            ? '⛈️'
            : '🌧️'}
        </Text>
      </View>

      <View style={styles.informacionClimaFeria}>
        <Text style={styles.tituloClimaFeria}>
          PRONÓSTICO PARA LA FERIA
        </Text>

        <Text style={styles.descripcionClimaFeria}>
          {obtenerDescripcionClima(clima.weather_code)}
        </Text>

        <Text style={styles.temperaturaClimaFeria}>
          Probabilidad de lluvia:{' '}
          {clima.probabilidad_lluvia != null
            ? `${clima.probabilidad_lluvia}%`
            : 'Sin datos'}
        </Text>
      </View>

      <View style={styles.datoSensacionFeria}>
        <Text style={styles.valorTemperaturaFeria}>
          {clima.temperatura_minima != null
            ? `${Math.round(clima.temperatura_minima)}°`
            : '--'}
          <Text style={styles.separadorTemperaturas}> / </Text>
          {clima.temperatura_maxima != null
            ? `${Math.round(clima.temperatura_maxima)}°`
            : '--'}
        </Text>

        <Text style={styles.etiquetaSensacionFeria}>
          MÍN. / MÁX.
        </Text>
      </View>
    </>
  ) : (
    <Text style={styles.descripcionClimaFeria}>
      Pronóstico todavía no disponible.
    </Text>
  )}
</View>

      {/* DESCRIPCIÓN */}
      <View style={styles.cuerpoFeria}>
        <Text style={styles.descripcionFeria}>
          {proximaFeria.descripcion}
        </Text>
      </View>
    </>
  ) : (
    <View style={styles.cuerpoFeria}>
      <Text style={styles.descripcionFeria}>
        No hay ferias próximas para mostrar.
      </Text>
    </View>
  )}
</View>



      {/* PRODUCTOS DESTACADOS */}
      <View style={styles.seccionProductos}>
        <View style={styles.encabezadoSeccion}>
          <View style={styles.indicadorSeccion} />

          <Text style={styles.etiquetaSeccion}>
            PRODUCTOS DESTACADOS
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaProductos}
        >
          {productosDestacados.map((producto) => (
            <View
              key={producto.id}
              style={styles.tarjetaProducto}
            >
              <Image
                source={{ uri: producto.imagen }}
                style={styles.imagenProducto}
                resizeMode="cover"
              />

              <View style={styles.contenidoProducto}>
                <Text style={styles.categoriaProducto}>
                  {producto.categoria}
                </Text>

                <Text
                  style={styles.nombreProducto}
                  numberOfLines={1}
                >
                  {producto.nombre}
                </Text>

                <Text
                  style={styles.descripcionProducto}
                  numberOfLines={2}
                >
                  {producto.descripcion}
                </Text>

                <View style={styles.separadorProducto} />

                <Text
                  style={styles.nombrePuesto}
                  numberOfLines={1}
                >
                  {producto.nombrePuesto}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

{/* PUESTOS DE LA PRÓXIMA FERIA */}
<View style={styles.seccionPuestos}>
  <View style={styles.encabezadoSeccion}>
    <View style={styles.indicadorSeccion} />

    <View>
      <Text style={styles.etiquetaSeccion}>
        CONOCÉ A LOS PUESTEROS
      </Text>

      <Text style={styles.subtituloPuestos}>
        Personas detrás de cada puesto
      </Text>
    </View>
  </View>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.listaPuestos}
  >
    {puestos.map((puesto) => (
      <View
        key={puesto.id_inscripcion}
        style={styles.tarjetaPuesto}
      >
        <View style={styles.contenedorImagenPuesto}>
          <Image
            source={{ uri: puesto.imagen_url }}
            style={styles.imagenPuesto}
            resizeMode="cover"
          />

          <View style={styles.etiquetaPuesto}>
            <Text style={styles.textoEtiquetaPuesto}>
              FERIA DE PRIMAVERA
            </Text>
          </View>
        </View>

        <View style={styles.contenidoPuesto}>
          <Text style={styles.etiquetaPuestero}>
            PUESTERO
          </Text>

          <Text
            style={styles.nombrePuestero}
            numberOfLines={2}
          >
            {Array.isArray(puesto.referentes)
              ? puesto.referentes
                  .map((referente) =>
                    typeof referente === 'string'
                      ? referente
                      : referente.nombre
                  )
                  .filter(Boolean)
                  .join(' & ') || 'Sin referentes asignados'
              : puesto.nombre_referente || 'Sin referentes asignados'}
          </Text>

          <View style={styles.separadorPuesto} />

          <Text
  style={styles.nombrePuesto}
  numberOfLines={2}
>
  {puesto.nombre_puesto}
</Text>

<Text
  style={styles.etiquetaPuestero}
  numberOfLines={1}
>
  {puesto.categoria || 'Sin categoría'}
</Text>
        </View>
      </View>
    ))}
  </ScrollView>
</View>

      {/* LEO Y LA FRASE DEL DÍA */}
      <View style={styles.seccionLeo}>
        <View style={styles.tarjetaLeo}>
          <View style={styles.contenidoLeo}>
            <Text style={styles.etiquetaLeo}>
              ✦ UN MOMENTO CON LEO
            </Text>

            <Text style={styles.tituloLeo}>
              La frase del día
            </Text>

            <View style={styles.detalleLeo} />

            <Text style={styles.fraseLeo}>
              “{fraseDelDia}”
            </Text>

            <Text style={styles.pieLeo}>
              DESCUBRÍ ALGO NUEVO HOY
            </Text>
          </View>

          <Image
            source={{
              uri: 'https://res.cloudinary.com/dzul1hatw/image/upload/v1792603526/leo1_pphsna.png',
            }}
            style={styles.imagenLeo}
            resizeMode="contain"
          />
        </View>
      </View>


    </ScrollView>
  </ImageBackground>
);

};












const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  nombreUsuario: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 20,
  },

  input: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  listaHorizontal: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  textoVacio: {
    marginHorizontal: 20,
    marginBottom: 25,
    color: '#eb9f14',
    fontSize: 15,
  },

  // TARJETAS GENERALES

  card: {
    width: 220,
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 16,
    elevation: 5,
  },

  cardImage: {
    width: '100%',
    height: 120,
  },

  cardInfo: {
    padding: 12,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  cardDescripcion: {
    marginTop: 6,
    fontSize: 14,
    color: '#777',
  },

  cardBoton: {
    marginTop: 10,
    color: '#FF6B35',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // CONTENIDO PRINCIPAL

  contenidoHome: {
    paddingTop: 25,
    paddingBottom: 0,
  },

  saludoHome: {
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 24,
    color: '#F1F0E8',
    fontSize: 15,
  },

  // CONTENEDOR DE LA FERIA

  seccionProximaFeria: {
    marginHorizontal: 12,
    paddingHorizontal: 0,
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6EAE5',
    elevation: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },

  encabezadoSeccion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    minHeight: 68,
  },

  indicadorSeccion: {
    width: 5,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#16A879',
    marginRight: 12,
  },

  etiquetaSeccion: {
    flex: 1,
    color: '#174C43',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  // CONTADOR DE DÍAS

  contadorDias: {
    marginLeft: 8,
    backgroundColor: '#E5F6F0',
    borderWidth: 1,
    borderColor: '#D0EEE3',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoContadorDias: {
    color: '#08795E',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  numeroContadorDias: {
    color: '#08795E',
    fontSize: 13,
    fontWeight: '900',
  },

  contadorHoy: {
    backgroundColor: '#DDF7E8',
    borderColor: '#A5E8C3',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    elevation: 0,
  },

  textoHoy: {
    color: '#087443',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // IMAGEN PRINCIPAL DE LA FERIA

  contenedorImagenFeria: {
    minHeight: 440,
    position: 'relative',
    backgroundColor: '#183D35',
    overflow: 'hidden',
  },

  imagenFeria: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  overlayImagenFeria: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 30, 27, 0.38)',
  },

  contenidoSobreImagen: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 18,
    minHeight: 440,
  },

  // PANEL DE FECHAS Y HORARIOS

  filaInformacionFeria: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },

  tarjetaFecha: {
    width: '47%',
    maxWidth: 250,
    minWidth: 0,
    backgroundColor: 'rgba(12, 43, 46, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 17,
    justifyContent: 'center',
  },

  etiquetaFecha: {
    color: '#BCE9D9',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    lineHeight: 14,
  },

  diaSemana: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 1,
  },

  valorFechaImagen: {
    color: '#FFFFFF',
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '900',
  },

  mesFecha: {
    color: '#E3F0EB',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginTop: 1,
  },

  separadorFecha: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
    marginVertical: 14,
  },

  valorHorarioImagen: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 5,
  },

  // ESTILOS DE CLIMA CONSERVADOS

  tarjetaClima: {
    flex: 0.8,
    minWidth: 0,
    backgroundColor: 'rgba(25, 40, 28, 0.64)',
    borderWidth: 1,
    borderColor: '#D9B95B',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconoClima: {
    fontSize: 32,
    marginBottom: 12,
  },

  etiquetaClimaImagen: {
    color: '#E9D38A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 6,
  },

  valorClimaImagen: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  // NOMBRE DE LA FERIA SOBRE LA IMAGEN

  tituloSobreImagen: {
    marginTop: 22,
    paddingHorizontal: 2,
    paddingBottom: 2,
  },

  etiquetaImagen: {
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    backgroundColor: '#13A879',
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 10,
  },

  tituloFeria: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 33,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  // DESCRIPCIÓN DEBAJO DE LA IMAGEN

  cuerpoFeria: {
    paddingHorizontal: 18,
    paddingVertical: 17,
    backgroundColor: '#FFFFFF',
  },

  descripcionFeria: {
    color: '#334B45',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 0,
  },

  // ESTILOS ANTERIORES CONSERVADOS

  detallesFeria: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE7DD',
  },

  datoFeria: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 135,
  },

  iconoContenedor: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F2F0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  iconoFeria: {
    fontSize: 19,
  },

  infoDatoFeria: {
    flex: 1,
  },

  etiquetaDato: {
    color: '#85877D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },

  valorDato: {
    color: '#303B30',
    fontSize: 14,
    fontWeight: '700',
  },

  climaFeria: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },

  infoClima: {
    flex: 1,
  },

  // PRODUCTOS

  seccionProductos: {
    width: '100%',
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 12,
  },

  listaProductos: {
    paddingVertical: 12,
    paddingHorizontal: 2,
    gap: 14,
  },

  tarjetaProducto: {
    width: 220,
    backgroundColor: 'rgba(20, 24, 29, 0.94)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.28)',
    overflow: 'hidden',
  },

  imagenProducto: {
    width: '100%',
    height: 145,
    backgroundColor: '#252525',
  },

  contenidoProducto: {
    padding: 12,
  },

  categoriaProducto: {
    color: '#D9B95B',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },

  nombreProducto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  descripcionProducto: {
    color: '#C2C2C2',
    fontSize: 12,
    lineHeight: 18,
    minHeight: 36,
  },

  separadorProducto: {
    height: 1,
    backgroundColor: 'rgba(217, 185, 91, 0.2)',
    marginVertical: 10,
  },

  // PUESTOS

  seccionPuestos: {
    marginTop: 20,
    marginBottom: 24,
  },

  subtituloPuestos: {
    color: '#D0D0C5',
    fontSize: 12,
    marginTop: 4,
  },

  listaPuestos: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 14,
  },

  tarjetaPuesto: {
    width: 235,
    backgroundColor: 'rgba(20, 24, 29, 0.96)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.35)',
    overflow: 'hidden',
  },

  contenedorImagenPuesto: {
    height: 145,
    position: 'relative',
    backgroundColor: '#252A25',
  },

  imagenPuesto: {
    width: '100%',
    height: '100%',
  },

  etiquetaPuesto: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(20, 24, 29, 0.78)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(217, 185, 91, 0.4)',
  },

  textoEtiquetaPuesto: {
    color: '#E9D38A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  contenidoPuesto: {
    padding: 13,
  },

  etiquetaPuestero: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  nombrePuestero: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  separadorPuesto: {
    height: 1,
    backgroundColor: 'rgba(217, 185, 91, 0.28)',
    marginVertical: 10,
  },

  nombrePuesto: {
    color: '#C8C8BD',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    minHeight: 34,
  },

  // LEO Y FRASE DEL DÍA

  seccionLeo: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#17251D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(217, 185, 91, 0.35)',
  },

  tarjetaLeo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22352A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217, 185, 91, 0.3)',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 10,
    minHeight: 142,
    overflow: 'hidden',
  },

  contenidoLeo: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
  },

  etiquetaLeo: {
    color: '#D9B95B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },

  tituloLeo: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 7,
  },

  detalleLeo: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D9B95B',
    marginBottom: 8,
  },

  fraseLeo: {
    color: '#F0E8D5',
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },

  pieLeo: {
    color: '#D9B95B',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 10,
  },

  imagenLeo: {
    width: 112,
    height: 132,
    marginLeft: 6,
  },
  
datosClimaFeria: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 18,
  paddingVertical: 16,
  backgroundColor: '#F0F6F1',
  borderTopWidth: 1,
  borderTopColor: '#DCEBE3',
  gap: 12,
},

iconoClimaContenedor: {
  width: 54,
  height: 54,
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  justifyContent: 'center',
},

iconoClimaFeria: {
  fontSize: 30,
},

informacionClimaFeria: {
  flex: 1,
  minWidth: 0,
},

tituloClimaFeria: {
  color: '#557266',
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 0.7,
},

descripcionClimaFeria: {
  color: '#204B3B',
  fontSize: 14,
  fontWeight: '800',
  marginTop: 4,
},

temperaturaClimaFeria: {
  color: '#557266',
  fontSize: 10,
  fontWeight: '600',
  marginTop: 5,
},

datoSensacionFeria: {
  alignItems: 'flex-end',
  justifyContent: 'center',
},

valorTemperaturaFeria: {
  color: '#204B3B',
  fontSize: 19,
  fontWeight: '900',
},

separadorTemperaturas: {
  color: '#8BA397',
  fontSize: 14,
  fontWeight: '500',
},

etiquetaSensacionFeria: {
  color: '#557266',
  fontSize: 9,
  fontWeight: '800',
  marginTop: 5,
},

});
