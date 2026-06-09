import { colors } from "@/theme/colors";

export const productsStyles = {
  page: {
    minHeight: "100vh",
    bgcolor: colors.background.app,
    py: 4,
  },

  panel: {
    p: 4,
    borderRadius: 4,
  },

  header: {
    mb: 4,
  },

  title: {
    color: colors.brand.primaryDark,
  },

  subtitle: {
    color: colors.text.secondary,
  },

  actions: {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: 2,
    mb: 4,
  },

  createButton: {
    px: 3,
  },

  feedbackText: {
    color: colors.text.secondary,
  },

  errorText: {
    color: colors.state.error,
  },

  list: {
    display: "grid",
    gap: 2,
  },

  card: {
    borderRadius: 3,
  },

  cardTitle: {
    color: colors.brand.primaryDark,
    mb: 1,
  },

  cardDescription: {
    color: colors.text.secondary,
    mb: 2,
  },
};