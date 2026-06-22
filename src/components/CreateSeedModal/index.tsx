"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

import { CreateProductPayload, Product } from "@/api/productsApi";

import { createSeedModalStyles } from "./CreateSeedModal.styles";

export type CreateSeedFromPurchaseData = {
  productPayload: CreateProductPayload;
  purchaseUnitPrice: number;
};

type CreateSeedModalProps = {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (data: CreateSeedFromPurchaseData) => Promise<Product | null>;
};

type SeedGenetics = CreateProductPayload["genetica"];

const geneticsOptions: { value: SeedGenetics; label: string }[] = [
  { value: "INDICA", label: "Índica" },
  { value: "SATIVA", label: "Sativa" },
  { value: "HIBRIDA", label: "Híbrida" },
];

/*
Modal especializado para alta rápida de semillas desde Compras.

El objetivo es permitir que el administrador cree una semilla
sin abandonar el flujo de registro de compra.

Decisiones de negocio:
- tipo se envía siempre como SEMILLA.
- unidad de medida la resuelve backend como UNIDADES.
- porcentaje_thc se envía null porque no aplica a semillas.
- precio_venta_actual se envía null porque las semillas no se venden a socios.
- el precio visible se presenta como precio de compra para respetar el contexto del módulo.
- el precio de compra se devuelve separado al contenedor para precargar el detalle de compra.
- el stock inicial no se carga acá; se incrementa luego mediante la compra.
*/
export function CreateSeedModal({
  open,
  creating,
  onClose,
  onCreate,
}: CreateSeedModalProps) {
  const [name, setName] = useState("");
  const [genetics, setGenetics] = useState<SeedGenetics>("HIBRIDA");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const parsedPurchasePrice = Number(purchasePrice);

  const canSubmit = useMemo(
    () =>
      name.trim().length > 0 &&
      parsedPurchasePrice > 0 &&
      !Number.isNaN(parsedPurchasePrice) &&
      !creating,
    [creating, name, parsedPurchasePrice],
  );

  const resetForm = () => {
    setName("");
    setGenetics("HIBRIDA");
    setPurchasePrice("");
    setFormError(null);
  };

  const handleClose = () => {
    if (creating) return;

    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    setFormError(null);

    if (!name.trim()) {
      setFormError("El nombre de la semilla es obligatorio.");
      return;
    }

    if (parsedPurchasePrice <= 0 || Number.isNaN(parsedPurchasePrice)) {
      setFormError("El precio de compra debe ser mayor a cero.");
      return;
    }

    /*
    Se separan explícitamente dos conceptos distintos:

    productPayload:
    Datos del catálogo de productos. La semilla se crea sin THC
    y sin precio de venta porque no se comercializa a socios.

    purchaseUnitPrice:
    Precio unitario de compra. Pertenece al detalle de la compra,
    no al producto.
    */
    const createdSeed = await onCreate({
      productPayload: {
        nombre: name.trim(),
        descripcion: null,
        imagen_url: null,
        tipo: "SEMILLA",
        genetica: genetics,
        porcentaje_thc: null,
        precio_venta_actual: null,
      },
      purchaseUnitPrice: parsedPurchasePrice,
    });

    if (!createdSeed) return;

    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: createSeedModalStyles.paper,
        },
      }}
    >
      <DialogTitle sx={createSeedModalStyles.title}>
        <Box sx={createSeedModalStyles.header}>
          <Box sx={createSeedModalStyles.iconBox}>
            <SpaOutlinedIcon />
          </Box>

          <Box sx={createSeedModalStyles.headerText}>
            <Typography component="h2" sx={createSeedModalStyles.heading}>
              Nueva semilla
            </Typography>

            <Typography sx={createSeedModalStyles.subtitle}>
              Creá la semilla sin salir del flujo de compra.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={createSeedModalStyles.content}>
        {formError && (
          <Alert severity="error" sx={createSeedModalStyles.errorAlert}>
            {formError}
          </Alert>
        )}

        <Box sx={createSeedModalStyles.form}>
          <TextField
            label="Nombre *"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Critical Kush Auto"
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="seed-genetics-label">Genética *</InputLabel>

            <Select
              labelId="seed-genetics-label"
              label="Genética *"
              value={genetics}
              onChange={(event) =>
                setGenetics(event.target.value as SeedGenetics)
              }
            >
              {geneticsOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Precio de compra *"
            type="number"
            value={purchasePrice}
            onChange={(event) => setPurchasePrice(event.target.value)}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 1,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />

          <Box sx={createSeedModalStyles.helperBox}>
            <Typography sx={createSeedModalStyles.helperText}>
              Se creará como producto tipo SEMILLA, unidad UNIDADES, estado
              ACTIVO, sin THC y sin precio de venta. El precio ingresado se
              usará como precio unitario de compra.
            </Typography>
          </Box>

          <Box sx={createSeedModalStyles.actions}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={creating}
              startIcon={<CloseIcon />}
              sx={createSeedModalStyles.cancelButton}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!canSubmit}
              startIcon={<AddIcon />}
              sx={createSeedModalStyles.submitButton}
            >
              {creating ? "Creando..." : "Crear semilla"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}