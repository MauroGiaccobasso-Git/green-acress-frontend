"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import { CreateProviderPayload, Provider } from "@/api/providersApi";

import { createProviderModalStyles } from "./CreateProviderModal.styles";

type CreateProviderModalProps = {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (payload: CreateProviderPayload) => Promise<Provider | null>;
};

/*
Modal especializado para alta rápida de proveedores desde Compras.

El objetivo es permitir que el administrador cree un proveedor
sin abandonar el flujo de registro de compra.

Este modal no reemplaza al futuro módulo completo de Proveedores.
Solo captura los datos mínimos necesarios para continuar la operación.

Importante:
- nombre, contacto, teléfono y email son obligatorios porque el backend
  exige esos datos para registrar un proveedor válido.
- el teléfono se normaliza antes de enviarse para cumplir el formato
  esperado por backend sin obligar al usuario a ingresarlo perfecto.
*/
export function CreateProviderModal({
  open,
  creating,
  onClose,
  onCreate,
}: CreateProviderModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const normalizedPhone = phone.replace(/\s/g, "").trim();

  const canSubmit = useMemo(
    () =>
      name.trim().length > 0 &&
      contact.trim().length > 0 &&
      normalizedPhone.length > 0 &&
      email.trim().length > 0 &&
      !creating,
    [creating, name, contact, normalizedPhone, email],
  );

  const resetForm = () => {
    setName("");
    setContact("");
    setPhone("");
    setEmail("");
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
      setFormError("El nombre del proveedor es obligatorio.");
      return;
    }

    if (!contact.trim()) {
      setFormError("El contacto del proveedor es obligatorio.");
      return;
    }

    if (!normalizedPhone) {
      setFormError("El teléfono del proveedor es obligatorio.");
      return;
    }

    if (!email.trim()) {
      setFormError("El email del proveedor es obligatorio.");
      return;
    }

    /*
    Se crea un proveedor mínimo y activo.

    La gestión completa del proveedor queda reservada
    para el módulo específico de Proveedores.

    El teléfono se envía normalizado sin espacios para respetar
    la validación centralizada del backend.
    */
    const createdProvider = await onCreate({
      nombre: name.trim(),
      contacto: contact.trim(),
      telefono: normalizedPhone,
      email: email.trim(),
    });

    if (!createdProvider) return;

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
          sx: createProviderModalStyles.paper,
        },
      }}
    >
      <DialogTitle sx={createProviderModalStyles.title}>
        <Box sx={createProviderModalStyles.header}>
          <Box sx={createProviderModalStyles.iconBox}>
            <LocalShippingOutlinedIcon />
          </Box>

          <Box sx={createProviderModalStyles.headerText}>
            <Typography component="h2" sx={createProviderModalStyles.heading}>
              Nuevo proveedor
            </Typography>

            <Typography sx={createProviderModalStyles.subtitle}>
              Creá el proveedor sin salir del flujo de compra.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={createProviderModalStyles.content}>
        {formError && (
          <Alert severity="error" sx={createProviderModalStyles.errorAlert}>
            {formError}
          </Alert>
        )}

        <Box sx={createProviderModalStyles.form}>
          <TextField
            label="Nombre *"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Proveedor Test Sprint 4"
            fullWidth
          />

          <TextField
            label="Contacto *"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Ej: Juan Pérez"
            fullWidth
          />

          <TextField
            label="Teléfono *"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ej: 099555777"
            fullWidth
          />

          <TextField
            label="Email *"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Ej: proveedor@correo.com"
            fullWidth
          />

          <Box sx={createProviderModalStyles.helperBox}>
            <Typography sx={createProviderModalStyles.helperText}>
              Se creará un proveedor activo con datos mínimos para continuar la
              compra. La información podrá completarse luego desde el módulo de
              Proveedores.
            </Typography>
          </Box>

          <Box sx={createProviderModalStyles.actions}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={creating}
              startIcon={<CloseIcon />}
              sx={createProviderModalStyles.cancelButton}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!canSubmit}
              startIcon={<AddIcon />}
              sx={createProviderModalStyles.submitButton}
            >
              {creating ? "Creando..." : "Crear proveedor"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
