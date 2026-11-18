import { registerRootComponent } from 'expo';
import App from './App';
import { AppProvider } from './src/provider/AppProvider';

const Aplicacion = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

registerRootComponent(Aplicacion);
