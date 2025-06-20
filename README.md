# Aplicaci-n-tics-2
# 📱 MiApp

**MiApp** es una aplicación móvil desarrollada con **React Native** y gestionada con **Expo**, diseñada para comunicarse con dispositivos **PROXIVISION Bluetooth Low Energy (BLE)**. Esta app recopila datos desde los dispositivos BLE, gestiona logs, y utiliza APIs para obtener ubicación y estado de conexión. Además, integra almacenamiento local para asegurar la persistencia de datos en caso de desconexión.

---

## 🧰 Tecnologías y Dependencias Principales

| Tecnología / Librería                                | Versión     | Justificación                                                                                                                                           |
|------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| React Native                                         | 0.79.2      | Última versión estable que ofrece mejoras de rendimiento y compatibilidad con Expo SDK 53.0.9. Permite aprovechar la nueva arquitectura de RN.         |
| React                                               | 19.0.0      | Compatible con React Native 0.79.2. Ofrece mejoras en hooks y rendimiento.                                                                              |
| Expo                                                | 53.0.9      | Incluye soporte para APIs necesarias como ubicación, red y BLE, con integración sencilla.                                                               |
| Axios                                               | 1.9.0       | Versión moderna con mejoras en el manejo de peticiones HTTP asíncronas.                                                                                |
| react-native-ble-plx                                | 3.5.0       | Biblioteca eficiente y estable para BLE, compatible con RN 0.79.                                                                                       |
| react-native-base64                                 | 0.2.1       | Utilizada para decodificación Base64 de forma sencilla y ligera.                                                                                       |
| @react-native-async-storage/async-storage           | 2.1.2       | Almacenamiento local confiable y estable, con soporte moderno para RN.                                                                                 |
| expo-location                                       | 18.1.5      | Asegura compatibilidad con SDK 53 y permisos de ubicación actualizados.                                                                                |
| expo-network                                        | 7.1.5       | Para obtener el estado de red con soporte multiplataforma.                                                                                             |
| TypeScript                                          | 5.8.3       | Tipado seguro, compatible con configuraciones modernas del proyecto.                                                                                   |
| @babel/core                                         | 7.25.2      | Transforma código ES6+ a JavaScript compatible con dispositivos.                                                                                       |

---

## 📁 Estructura del Proyecto

```plaintext
MiApp/
├── android/                    # Archivos específicos para Android
├── assets/                     # Recursos estáticos (imágenes, iconos)
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── App.tsx                     # Componente principal de la aplicación
├── service.ts                  # Manejo de envío y almacenamiento local de logs
├── useBLE.ts                   # Hook personalizado para la gestión BLE
├── location.ts                 # Función para obtener ubicación GPS
├── internetConection.ts        # Función para verificar conexión a Internet
├── package.json                # Información y dependencias del proyecto
├── app.json                    # Configuración de Expo (nombre, permisos, etc.)
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Documentación del proyecto
```

---

## ⚙️ Configuración de la Aplicación (`app.json`)

- **Nombre:** MiApp  
- **Versión:** 1.0.0  
- **Orientación:** Retrato (`portrait`)  
- **Iconos:** Íconos para app, splash screen, adaptive icons y favicon web.  
- **Permisos Android:**
  - Ubicación fina y gruesa
  - Estado de red
  - Permisos Bluetooth:
    - `BLUETOOTH`
    - `BLUETOOTH_ADMIN`
    - `BLUETOOTH_CONNECT`
- **Identificador Android:** `com.anonymous.MiApp`  
- Habilitación de nueva arquitectura React Native.

---

## 🔑 Funcionalidades Clave

### 1. Gestión Bluetooth (`useBLE.ts`)

- Maneja permisos, escaneo y conexión de dispositivos BLE.
- Recibe y decodifica datos en tiempo real.
- Envío automático de logs al backend.
- Reconexión automática al último dispositivo conectado.

```ts
const connectToDevice = async (device: Device) => {
  try {
    const connected = await bleManager.connectToDevice(device.id);
    setConnectedDevice(connected);
    await connected.discoverAllServicesAndCharacteristics();
    bleManager.stopDeviceScan();
    startDataStreaming(connected);
  } catch (error) {
    console.log("Connection failed:", error);
  }
};
```
### 2. Manejo de Logs (service.ts)

- Guarda localmente los logs si no hay conexión.
- Envía logs pendientes y actuales al servidor cuando hay conexión.
- Obtiene la ubicación y hora actual para cada log.

```ts
export async function enviarLog(mac: string, mensaje: string) {
  const conectado = await hayConexionInternet();
  const hora = obtenerHoraActual();
  const ubicacion = await obtenerUbicacion();

  if (!conectado) {
    const logsPendientes = await cargarLogsPendientes();
    logsPendientes.push({ mac, mensaje, hora, ubicacion });
    await guardarLogsPendientes(logsPendientes);
    return;
  }

  // Enviar logs pendientes y actual
  // ...
}
```

### 3. Obtención de Ubicación (location.ts)

- Solicita permiso para ubicación.
- Retorna la latitud y longitud separadas por punto y coma.

```ts
export const obtenerUbicacion = async (): Promise<string> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Permiso de ubicación denegado");
  const ubicacion = await Location.getCurrentPositionAsync({});
  return `${ubicacion.coords.latitude};${ubicacion.coords.longitude}`;
};
```

### 4. Verificación de Conexión a Internet (internetConection.ts)

- Verifica el estado de conexión de red para saber si se puede enviar información.

```ts
export const hayConexionInternet = async (): Promise<boolean> => {
  const estado = await Network.getNetworkStateAsync();
  return (estado.isConnected ?? false) && (estado.isInternetReachable !== false);
};
```

## 📦 Scripts Disponibles (`package.json`)

| Script   | Descripción                                                |
|----------|------------------------------------------------------------|
| `start`  | Inicia el servidor de desarrollo Expo (`expo start`)       |
| `android`| Construye y ejecuta la app en Android (`expo run:android`) |


## 🧪 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlanGK7/Aplicacion-tics-2.git
cd Aplicacion-tics-2

npm install

npm run android


