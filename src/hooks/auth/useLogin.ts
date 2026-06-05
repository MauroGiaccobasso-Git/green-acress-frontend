import { useState } from "react";

import { authApi } from "@/api/authApi";

import { useAuth } from "./useAuth";

/*
Hook encargado exclusivamente
del flujo de inicio de sesión.

Su responsabilidad es coordinar
la autenticación entre:

- formulario de login
- backend
- AuthProvider

Este hook NO renderiza interfaz.

Este hook NO guarda directamente
datos en localStorage.

Este hook NO decide redirecciones
por rol.

Solamente ejecuta el login,
administra loading/error y guarda
la sesión autenticada mediante
AuthProvider.
*/
export function useLogin() {
  /*
  Obtiene la función login
  desde el contexto global
  de autenticación.

  Esa función pertenece a
  AuthProvider y se encarga
  de guardar la sesión en memoria
  y persistirla mediante authStorage.
  */
  const { login } = useAuth();

  /*
  Estado utilizado para indicar
  si el proceso de login está
  ejecutándose.

  Sirve para que el formulario pueda:

  - deshabilitar inputs
  - deshabilitar botón
  - mostrar texto de carga
  */
  const [isLoading, setIsLoading] =
    useState(false);

  /*
  Estado utilizado para guardar
  el mensaje de error producido
  durante el intento de login.

  Si el login funciona correctamente,
  este valor queda en null.
  */
  const [error, setError] =
    useState<string | null>(null);

  /*
  Ejecuta el proceso completo
  de autenticación.

  Recibe email y password desde
  el formulario visual.

  Luego llama a authApi, que es
  la capa encargada de comunicarse
  con el backend.
  */
  const handleLogin = async (
    email: string,
    password: string
  ) => {
    /*
    Activa estado de carga antes
    de iniciar la solicitud.
    */
    setIsLoading(true);

    /*
    Limpia errores anteriores para
    evitar mostrar mensajes viejos
    durante un nuevo intento.
    */
    setError(null);

    try {
      /*
      Solicita autenticación real
      al backend.

      authApi.login se encarga de
      usar httpClient y consumir
      el endpoint correspondiente.
      */
      const response =
        await authApi.login(
          email,
          password
        );

      /*
      Guarda la sesión autenticada
      en el estado global del frontend.

      A partir de este punto, otras
      pantallas pueden acceder al
      usuario y token mediante useAuth.
      */
      login(
        response.usuario,
        response.token
      );

      /*
      Devuelve la respuesta completa
      para que el container pueda decidir
      qué hacer después del login.

      Por ejemplo:
      - redirigir según rol
      - mostrar flujo de consentimiento
      - continuar navegación
      */
      return response;
    } catch (error) {
      /*
      Normaliza el error para obtener
      siempre un mensaje entendible
      por la interfaz.
      */
      const message =
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión";

      /*
      Guarda el mensaje para que el
      formulario pueda mostrarlo.
      */
      setError(message);

      /*
      Retorna null para indicar que
      el login no fue exitoso.
      */
      return null;
    } finally {
      /*
      Finaliza estado de carga tanto
      si el login fue exitoso como si falló.
      */
      setIsLoading(false);
    }
  };

  /*
  Expone únicamente lo que necesita
  el container de login:

  - función para ejecutar login
  - estado de carga
  - mensaje de error
  */
  return {
    handleLogin,

    isLoading,

    error,
  };
}