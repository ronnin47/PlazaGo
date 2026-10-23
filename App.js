
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './provider/AppProvider';
import { Ionicons } from '@expo/vector-icons';

import { PantallaHome } from './components/pantallaHome';
import { PantallaMisPuestos } from './components/pantallaMisPuestos';
import { PantallaConfiguracion } from './components/pantallaConfiguracion';
import { PantallaLogin } from './components/pantallaLogin';

import { PantallaAdministrador } from './components/pantallaAdministrador';


import { AppContext } from './provider/AppProvider';
import { useContext } from 'react';
import { PantallaPuestero } from './components/pantallaPuestero.js';
import { PantallaCargarNuevaFeria } from './components/pantallaCargarNuevaFeria.js';
import { PantallaRegistrarPuestos } from './components/pantallaRegistrarPuestos.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ---------- STACK HOME ----------
const StackHome = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2d2c30',
          borderBottomWidth: 1,
          borderBottomColor: '#e6af4a',
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Inicio"
        component={PantallaHome}
        options={{ title: 'Inicio' }}
      />
    </Stack.Navigator>
  );
};

// ---------- STACK MIS PUESTOS ----------
const StackMisPuestos = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
          borderBottomWidth: 1,
          borderBottomColor: '#4ae6d9',
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="misPuestos"
        component={PantallaMisPuestos}
        options={{ title: 'Mis Recetas' }}
      />
    </Stack.Navigator>
  );
};

// ---------- STACK CONFIGURACION ----------
const StackConfiguracion = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
          borderBottomWidth: 1,
          borderBottomColor: '#4ae6d9',
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Configuracion"
        component={PantallaConfiguracion}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
};


// ---------- STACK ADMINISTRADOR----------
const StackAdministrador = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
          borderBottomWidth: 1,
          borderBottomColor: '#4ae6d9',
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Administrador"
        component={PantallaAdministrador}
        options={{ title: 'Administrador' }}
      />

       <Stack.Screen
        name="PantallaCargarNuevaFeria"
        component={PantallaCargarNuevaFeria}
        options={{ title: '+ Nueva Feria' }}
      />

       <Stack.Screen
        name="PantallaRegistrarPuestos"
        component={PantallaRegistrarPuestos}
        options={{ title: 'Registro de puestos' }}
      />
    </Stack.Navigator>
  );
};


//---------PUESTERO----------
const StackPuestero = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
          borderBottomWidth: 1,
          borderBottomColor: '#4ae6d9',
        },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="Puesto"
        component={PantallaPuestero}
        options={{ title: 'Mi puesto' }}
      />
    </Stack.Navigator>
  );
};



// ---------- NAVEGACION PRINCIPAL ----------
const NavegacionPrincipal = () => {
  const { usuario } = useContext(AppContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2d2c30',
          borderTopColor: '#E0D6C3',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#eeba10',
        tabBarInactiveTintColor: '#fcfbfb',
      }}
    >
      <Tab.Screen
        name="StackHome"
        component={StackHome}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="StackMisPuestos"
        component={StackMisPuestos}
        options={{
          title: 'Mis Puestos',
          tabBarLabel: 'Mis Puestos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'storefront' : 'storefront-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />


      {usuario.rol == 'administrador' && (
        <Tab.Screen
          name="StackAdministrador"
          component={StackAdministrador}
          options={{
            title: 'Administrador',
            tabBarLabel: 'Administrador',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'shield' : 'shield-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      {usuario.rol == 'puestero' && (
        <Tab.Screen
          name="StackPuestero"
          component={StackPuestero}
          options={{
            title: 'Puesto',
            tabBarLabel: 'Puesto',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                 name={focused ? 'umbrella' : 'umbrella-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}


      <Tab.Screen
        name="StackConfiguracion"
        component={StackConfiguracion}
        options={{
          title: 'Configuración',
          tabBarLabel: 'Configuración',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};














// ---------- APP ----------
export default function App() {
  const { logueado, loading} = useContext(AppContext);

  if (loading) {
    return null;
  }

return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {logueado ? (
          <Stack.Screen
            name="Principal"
            component={NavegacionPrincipal}
          
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={PantallaLogin}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}






