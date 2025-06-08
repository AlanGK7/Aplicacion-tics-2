import axios from "axios";

const API_BASE_URL = "https://tics-web.vercel.app/api/logs";
import { obtenerUbicacion } from "./location";
import { hayConexionInternet } from "./internetConection"; // Asegúrate de tener esta función para verificar la conexión a internet
import AsyncStorage from "@react-native-async-storage/async-storage"; // agregando para manejar el almacenamiento local en React Native

const STORAGE_KEY = "logs_pendientes";


export const obtenerHoraActual = () => {
  const ahora = new Date();

  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0"); // meses van de 0 a 11
  const dia = String(ahora.getDate()).padStart(2, "0");

  const hora = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const segundos = String(ahora.getSeconds()).padStart(2, "0");
  const region = Intl.DateTimeFormat().resolvedOptions().timeZone; // Obtener la zona horaria
  return `${region}-${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
};

const cargarLogsPendientes = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
const guardarLogsPendientes = async (logs: any[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};


//antes de enviar log, verificar si hay coneccion a internet, si no hay, guardar en localStorage y enviar cuando haya conexión
const verificarConexion = async () => {
  const conectado = await hayConexionInternet();
  return conectado;
};

export async function enviarLog(mac: string, mensaje: string) {
  try {
    const conectado = await hayConexionInternet();
    const hora = obtenerHoraActual();
    const ubicacion = await obtenerUbicacion();

    const nuevoLog = { mac, mensaje, hora, ubicacion };

    if (!conectado) {
      const logsPendientes = await cargarLogsPendientes();
      logsPendientes.push(nuevoLog);
      await guardarLogsPendientes(logsPendientes);
      console.log("Log guardado localmente:", nuevoLog);
      return;
    }

    // Enviar logs pendientes primero
   const logsPendientes = await cargarLogsPendientes();
    for (const log of logsPendientes) {
      await axios.post(API_BASE_URL, log);
    }
    await AsyncStorage.removeItem(STORAGE_KEY); // Borrar si ya se enviaron todos

    // Enviar el log actual
    await axios.post(API_BASE_URL, nuevoLog);
    console.log("Log enviado:", nuevoLog);

  } catch (error) {
    console.error("Error al enviar log:", error);
  }
}


