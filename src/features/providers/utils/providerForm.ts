import type {
  CreateProviderPayload,
  Provider,
  UpdateProviderPayload,
} from "@/api/providersApi";

/* =========================================================
   TIPOS
========================================================= */

export type ProviderFormValues = CreateProviderPayload;

export type ProviderFormField = keyof ProviderFormValues;

export type ProviderFormErrors = Partial<
  Record<ProviderFormField, string>
>;

/* =========================================================
   CONSTANTES
========================================================= */

export const EMPTY_PROVIDER_FORM_VALUES: ProviderFormValues = {
  nombre: "",
  contacto: "",
  telefono: "",
  email: "",
};

/* =========================================================
   NORMALIZACIÓN
========================================================= */

const normalizeText = (value: string): string =>
  value.trim().replace(/\s+/g, " ");

const normalizePhone = (value: string): string =>
  value.replace(/\s+/g, "").trim();

const normalizeEmail = (value: string): string =>
  value.trim().toLowerCase();

/*
Normaliza el formulario antes de validarlo
y antes de enviarlo al backend.
*/
export function normalizeProviderFormValues(
  values: ProviderFormValues,
): ProviderFormValues {
  return {
    nombre: normalizeText(values.nombre),
    contacto: normalizeText(values.contacto),
    telefono: normalizePhone(values.telefono),
    email: normalizeEmail(values.email),
  };
}

/* =========================================================
   VALIDACIÓN
========================================================= */

const PHONE_PATTERN = /^\d{8,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
Replica en frontend las validaciones básicas
del contrato real del backend.

El backend continúa siendo la fuente de verdad
para duplicados y reglas de negocio.
*/
export function validateProviderForm(
  values: ProviderFormValues,
): ProviderFormErrors {
  const normalizedValues = normalizeProviderFormValues(values);
  const errors: ProviderFormErrors = {};

  if (!normalizedValues.nombre) {
    errors.nombre = "El nombre del proveedor es obligatorio.";
  }

  if (!normalizedValues.contacto) {
    errors.contacto = "El contacto del proveedor es obligatorio.";
  }

  if (!normalizedValues.telefono) {
    errors.telefono = "El teléfono del proveedor es obligatorio.";
  } else if (!PHONE_PATTERN.test(normalizedValues.telefono)) {
    errors.telefono =
      "El teléfono debe contener entre 8 y 15 números.";
  }

  if (!normalizedValues.email) {
    errors.email = "El email del proveedor es obligatorio.";
  } else if (!EMAIL_PATTERN.test(normalizedValues.email)) {
    errors.email = "Ingresá un email válido.";
  }

  return errors;
}

export function hasProviderFormErrors(
  errors: ProviderFormErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

/* =========================================================
   EDICIÓN
========================================================= */

/*
Construye los valores iniciales del formulario
a partir de un proveedor existente.
*/
export function providerToFormValues(
  provider: Provider,
): ProviderFormValues {
  return {
    nombre: provider.nombre,
    contacto: provider.contacto,
    telefono: provider.telefono,
    email: provider.email,
  };
}

/*
Detecta si realmente existe alguna modificación
antes de ejecutar un PUT.
*/
export function hasProviderFormChanges(
  originalValues: ProviderFormValues,
  currentValues: ProviderFormValues,
): boolean {
  const normalizedOriginal =
    normalizeProviderFormValues(originalValues);

  const normalizedCurrent =
    normalizeProviderFormValues(currentValues);

  return (
    normalizedOriginal.nombre !== normalizedCurrent.nombre ||
    normalizedOriginal.contacto !== normalizedCurrent.contacto ||
    normalizedOriginal.telefono !== normalizedCurrent.telefono ||
    normalizedOriginal.email !== normalizedCurrent.email
  );
}

/*
Devuelve el payload completo requerido por alta y edición.
*/
export function buildProviderPayload(
  values: ProviderFormValues,
): CreateProviderPayload & UpdateProviderPayload {
  return normalizeProviderFormValues(values);
}