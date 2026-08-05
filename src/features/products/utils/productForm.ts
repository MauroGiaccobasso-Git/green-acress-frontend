import type {
  CreateProductPayload,
  Product,
  ProductImageFile,
  UpdateProductPayload,
} from "@/api/productsApi";

/* =========================================================
   TIPOS DEL FORMULARIO
========================================================= */

export type ProductFormMode = "create" | "edit";

/*
Valores internos utilizados por la interfaz.

Los campos numéricos se mantienen como texto mientras
el administrador escribe para no bloquear estados
intermedios válidos del formulario.
*/
export type ProductFormValues = {
  nombre: string;
  descripcion: string;
  tipo: Product["tipo"];
  genetica: Product["genetica"];
  porcentaje_thc: string;
  precio_venta_actual: string;
  estado: Product["estado"];
};

export type ProductFormField = keyof ProductFormValues;

export type ProductFormErrors = Partial<
  Record<ProductFormField, string>
>;

/*
Payload utilizado por el formulario en modo edición.

El estado viaja junto con los datos del formulario para
facilitar la experiencia del usuario, pero el container
lo enviará mediante su endpoint PATCH específico.
*/
export type EditProductFormPayload = UpdateProductPayload & {
  estado: Product["estado"];
};

export type ProductFormPayload =
  | CreateProductPayload
  | EditProductFormPayload;

/*
Contrato entregado por el modal al container.

La imagen permanece separada del payload de negocio
para que productsApi pueda construir multipart/form-data.
*/
export type ProductFormSubmission = {
  payload: ProductFormPayload;
  imageFile: ProductImageFile;
};

/* =========================================================
   CONSTANTES
========================================================= */

export const PRODUCT_IMAGE_MAX_SIZE_MB = 5;

export const PRODUCT_IMAGE_MAX_SIZE_BYTES =
  PRODUCT_IMAGE_MAX_SIZE_MB * 1024 * 1024;

export const PRODUCT_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp";

const PRODUCT_IMAGE_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const EMPTY_PRODUCT_FORM_VALUES: ProductFormValues = {
  nombre: "",
  descripcion: "",
  tipo: "FLOR",
  genetica: "HIBRIDA",
  porcentaje_thc: "",
  precio_venta_actual: "",
  estado: "ACTIVO",
};

const PRODUCT_UNIT_LABELS: Record<
  Product["unidad_medida"],
  string
> = {
  GRAMOS: "g",
  UNIDADES: "unidades",
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

export function formatProductLabel(
  value?: string | null,
): string {
  if (!value) {
    return "No definido";
  }

  return value.toLowerCase().replaceAll("_", " ");
}

export function getProductUnitByType(
  type: Product["tipo"],
): Product["unidad_medida"] {
  return type === "FLOR" ? "GRAMOS" : "UNIDADES";
}

export function getProductUnitLabel(
  type: Product["tipo"],
): string {
  return PRODUCT_UNIT_LABELS[getProductUnitByType(type)];
}

/* =========================================================
   ESTADO INICIAL
========================================================= */

/*
Construye un estado nuevo para cada apertura del modal.

En edición toma los datos reales del producto.
En creación devuelve una copia independiente de los valores vacíos.
*/
export function buildInitialProductFormValues(
  mode: ProductFormMode,
  product?: Product | null,
): ProductFormValues {
  if (mode === "edit" && product) {
    return {
      nombre: product.nombre,
      descripcion: product.descripcion ?? "",
      tipo: product.tipo,
      genetica: product.genetica,
      porcentaje_thc:
        product.porcentaje_thc !== null &&
        product.porcentaje_thc !== undefined
          ? String(product.porcentaje_thc)
          : "",
      precio_venta_actual:
        product.precio_venta_actual !== null &&
        product.precio_venta_actual !== undefined
          ? String(product.precio_venta_actual)
          : "",
      estado: product.estado,
    };
  }

  return {
    ...EMPTY_PRODUCT_FORM_VALUES,
  };
}

/* =========================================================
   NORMALIZACIÓN
========================================================= */

const normalizeName = (value: string): string =>
  value.trim().replace(/\s+/g, " ");

const normalizeDescription = (value: string): string =>
  value.trim();

const normalizeNumericText = (value: string): string =>
  value.trim();

/*
Normaliza los valores antes de validarlos, compararlos
y construir los payloads de la API.
*/
export function normalizeProductFormValues(
  values: ProductFormValues,
): ProductFormValues {
  return {
    ...values,
    nombre: normalizeName(values.nombre),
    descripcion: normalizeDescription(values.descripcion),
    porcentaje_thc: normalizeNumericText(values.porcentaje_thc),
    precio_venta_actual: normalizeNumericText(
      values.precio_venta_actual,
    ),
  };
}

/* =========================================================
   VALIDACIÓN DEL FORMULARIO
========================================================= */

/*
Devuelve el error asociado a un campo específico.

El backend continúa siendo la fuente de verdad para
duplicados y reglas críticas del dominio.
*/
export function getProductFormFieldError(
  field: ProductFormField,
  values: ProductFormValues,
): string | undefined {
  const normalizedValues = normalizeProductFormValues(values);
  const isSeed = normalizedValues.tipo === "SEMILLA";

  if (field === "nombre") {
    if (!normalizedValues.nombre) {
      return "El nombre es obligatorio.";
    }

    if (normalizedValues.nombre.length > 50) {
      return "El nombre no puede superar los 50 caracteres.";
    }
  }

  if (field === "tipo" && !normalizedValues.tipo) {
    return "El tipo de producto es obligatorio.";
  }

  if (field === "genetica" && !normalizedValues.genetica) {
    return "La genética es obligatoria.";
  }

  /*
  Precio y THC solo aplican a flores.

  Las semillas participan del circuito de compras,
  inventario y producción interna.
  */
  if (field === "precio_venta_actual" && !isSeed) {
    const price = Number(normalizedValues.precio_venta_actual);

    if (
      !normalizedValues.precio_venta_actual ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return "El precio debe ser mayor a 0.";
    }

    if (!Number.isInteger(price)) {
      return "El precio debe ser un número entero mayor a 0.";
    }
  }

  if (field === "porcentaje_thc" && !isSeed) {
    const thc = Number(normalizedValues.porcentaje_thc);

    if (
      !normalizedValues.porcentaje_thc ||
      !Number.isFinite(thc)
    ) {
      return "El THC es obligatorio para flores.";
    }

    if (thc < 1 || thc > 100) {
      return "El THC debe estar entre 1 y 100.";
    }
  }

  return undefined;
}

/*
Valida todos los campos relevantes del formulario.
*/
export function validateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  const fieldsToValidate: ProductFormField[] = [
    "nombre",
    "tipo",
    "genetica",
    "precio_venta_actual",
    "porcentaje_thc",
  ];

  return fieldsToValidate.reduce<ProductFormErrors>(
    (errors, field) => {
      const fieldError = getProductFormFieldError(field, values);

      if (fieldError) {
        errors[field] = fieldError;
      }

      return errors;
    },
    {},
  );
}

export function hasProductFormErrors(
  errors: ProductFormErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

/* =========================================================
   VALIDACIÓN DE IMAGEN
========================================================= */

/*
Valida la imagen antes de enviarla.

Esta validación mejora la experiencia del usuario.
El backend mantiene la validación de seguridad definitiva
sobre MIME, tamaño y contenido binario real.
*/
export function validateProductImageFile(
  file: ProductImageFile,
): string | null {
  if (!file) {
    return null;
  }

  if (!PRODUCT_IMAGE_ALLOWED_TYPES.has(file.type)) {
    return "La imagen debe tener formato JPG, PNG o WEBP.";
  }

  if (file.size <= 0) {
    return "La imagen seleccionada está vacía.";
  }

  if (file.size > PRODUCT_IMAGE_MAX_SIZE_BYTES) {
    return `La imagen no puede superar los ${PRODUCT_IMAGE_MAX_SIZE_MB} MB.`;
  }

  return null;
}

/* =========================================================
   DETECCIÓN DE CAMBIOS
========================================================= */

/*
Detecta cambios dentro del modal para advertir antes
de descartar información no guardada.

Una imagen nueva cuenta siempre como modificación.
*/
export function hasProductFormChanges(
  initialValues: ProductFormValues,
  currentValues: ProductFormValues,
  imageFile: ProductImageFile,
): boolean {
  if (imageFile) {
    return true;
  }

  const normalizedInitial =
    normalizeProductFormValues(initialValues);

  const normalizedCurrent =
    normalizeProductFormValues(currentValues);

  return (
    normalizedInitial.nombre !== normalizedCurrent.nombre ||
    normalizedInitial.descripcion !==
      normalizedCurrent.descripcion ||
    normalizedInitial.tipo !== normalizedCurrent.tipo ||
    normalizedInitial.genetica !== normalizedCurrent.genetica ||
    normalizedInitial.porcentaje_thc !==
      normalizedCurrent.porcentaje_thc ||
    normalizedInitial.precio_venta_actual !==
      normalizedCurrent.precio_venta_actual ||
    normalizedInitial.estado !== normalizedCurrent.estado
  );
}

/*
Detecta si el PUT de datos generales es realmente necesario.

La selección de una imagen nueva obliga a ejecutar la
actualización aunque los demás campos no hayan cambiado.
*/
export function hasProductDataChanges(
  product: Product,
  payload: UpdateProductPayload,
  imageFile: ProductImageFile,
): boolean {
  if (imageFile) {
    return true;
  }

  return (
    payload.nombre !== product.nombre ||
    (payload.descripcion ?? null) !==
      (product.descripcion ?? null) ||
    payload.genetica !== product.genetica ||
    payload.porcentaje_thc !== product.porcentaje_thc ||
    payload.precio_venta_actual !==
      product.precio_venta_actual
  );
}

export function hasProductStatusChange(
  product: Product,
  nextStatus: Product["estado"],
): boolean {
  return product.estado !== nextStatus;
}

/* =========================================================
   CONSTRUCCIÓN DE PAYLOADS
========================================================= */

const getNullableDescription = (
  description: string,
): string | null => description || null;

const getNullableFlowerNumber = (
  value: string,
  isSeed: boolean,
): number | null => (isSeed ? null : Number(value));

export function buildCreateProductPayload(
  values: ProductFormValues,
): CreateProductPayload {
  const normalizedValues = normalizeProductFormValues(values);
  const isSeed = normalizedValues.tipo === "SEMILLA";

  return {
    nombre: normalizedValues.nombre,
    descripcion: getNullableDescription(
      normalizedValues.descripcion,
    ),
    tipo: normalizedValues.tipo,
    genetica: normalizedValues.genetica,
    porcentaje_thc: getNullableFlowerNumber(
      normalizedValues.porcentaje_thc,
      isSeed,
    ),
    precio_venta_actual: getNullableFlowerNumber(
      normalizedValues.precio_venta_actual,
      isSeed,
    ),
  };
}

export function buildEditProductPayload(
  values: ProductFormValues,
): EditProductFormPayload {
  const normalizedValues = normalizeProductFormValues(values);
  const isSeed = normalizedValues.tipo === "SEMILLA";

  return {
    nombre: normalizedValues.nombre,
    descripcion: getNullableDescription(
      normalizedValues.descripcion,
    ),
    genetica: normalizedValues.genetica,
    porcentaje_thc: getNullableFlowerNumber(
      normalizedValues.porcentaje_thc,
      isSeed,
    ),
    precio_venta_actual: getNullableFlowerNumber(
      normalizedValues.precio_venta_actual,
      isSeed,
    ),
    estado: normalizedValues.estado,
  };
}

/*
Construye el contrato definitivo entregado por el modal.
*/
export function buildProductFormSubmission(
  mode: ProductFormMode,
  values: ProductFormValues,
  imageFile: ProductImageFile,
): ProductFormSubmission {
  return {
    payload:
      mode === "create"
        ? buildCreateProductPayload(values)
        : buildEditProductPayload(values),
    imageFile,
  };
}