import { httpClient } from "./httpClient";

// Estructura esperada de usuario
// recibida desde backend.
type LoginUser = {
  id: number;
  email: string;
  rol: "ADMIN" | "SOCIO";
};

// Estructura esperada de respuesta
// devuelta por endpoint login.
type LoginResponse = {
  token: string;
  usuario: LoginUser;
};

// Módulo encargado de centralizar
// operaciones relacionadas a autenticación.
export const authApi = {

  // Realiza solicitud login hacia backend
  login(email: string, password: string) {

    return httpClient<LoginResponse>(
      "/auth/login",
      {
        method: "POST",

        body: {
          email,
          password,
        },
      }
    );
  },
};