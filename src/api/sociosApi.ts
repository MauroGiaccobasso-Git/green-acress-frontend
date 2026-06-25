import { httpClient } from "./httpClient";

/*
Representa el usuario asociado a un socio.

Se utiliza para mantener alineado el contrato
del frontend con la respuesta real del backend.
*/
export type SocioUser = {
  id: number;

  email: string;

  rol: "ADMIN" | "SOCIO";

  estado: "ACTIVO" | "INACTIVO" | "BLOQUEADO";
};

/*
Representa la estructura de socio utilizada
por el frontend.

Se mantienen los nombres del backend para evitar
mapeos innecesarios y respetar el contrato real
expuesto por la API.
*/
export type Socio = {
  id: number;

  usuario_id: number;

  documento: string;

  nombre: string;

  apellido: string;

  telefono: string | null;

  fecha_alta: string;

  consentimiento_aceptado: boolean;

  fecha_consentimiento: string | null;

  fecha_creacion: string;

  fecha_actualizacion: string;

  estado: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";

  usuario: SocioUser;
};

/*
Centraliza las operaciones HTTP relacionadas
con socios.

Los componentes no deben realizar llamadas
directas a la API.
*/
export const sociosApi = {
  async getSocios(search?: string): Promise<Socio[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    return httpClient<Socio[]>(`/socios${query}`);
  },
};