import { Box, Typography } from "@mui/material";

import { pageHeaderStyles } from "./pageHeader.styles";

type PageHeaderProps = {
  title?: string;
  subtitle?: string;
};

/*
Header reutilizable para páginas internas del panel administrativo.

Permite que cada pantalla defina su título y subtítulo
desde el layout, evitando duplicar encabezados dentro
de cada container.
*/
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <Box sx={pageHeaderStyles.wrapper}>
      {title && (
        <Typography component="h1" sx={pageHeaderStyles.title}>
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography component="p" sx={pageHeaderStyles.subtitle}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
