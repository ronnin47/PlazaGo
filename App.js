import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './provider/AppProvider';
//icons
import { Ionicons } from '@expo/vector-icons';

// navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


// componentes
import { PantallaHome } from './components/pantallaHome';
import {PantallaMisPuestos} from './components/pantallaMisPuestos';
import {PantallaConfiguracion} from './components/pantallaConfiguracion';






// ---------- STACK HOME ----------
const StackHome = () => {

//'#2d2c30',
//  borderTopColor: '#E0D6C3',
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







// ---------- APP ----------
export default function App() {







  return (
    <AppProvider>

      <NavigationContainer>


          <Tab.Navigator
            screenOptions={{
              headerShown: false,

              tabBarStyle: {
      backgroundColor: '#2d2c30',
      borderTopColor: '#E0D6C3',
      borderTopWidth: 1,
                },
                tabBarActiveTintColor: '#E67E22',
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
              options={{ title: 'Mis Puestos',
                tabBarLabel: 'Mis Puestos',
                tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'pizza' : 'pizza-outline'}
                size={size}
                color={color}
              />
            ),
              }}
            />






            <Tab.Screen
              name="StackConfiguracion"
              component={StackConfiguracion}
              options={{ title: 'Configuración',
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
    
  
    
      </NavigationContainer>

    </AppProvider> 
  );
}

