import * as Network from "expo-network";

export const hayConexionInternet = async (): Promise<boolean> => {
  try {
    const estado = await Network.getNetworkStateAsync();

    // Verificamos que estado no sea null o undefined primero
    const tieneConexion = estado.isConnected ?? false;
    const internetAlcanzable = estado.isInternetReachable !== false;

    return tieneConexion && internetAlcanzable;
  } catch (error) {
    console.error("Error verificando la conexión:", error);
    return false;
  }
};

