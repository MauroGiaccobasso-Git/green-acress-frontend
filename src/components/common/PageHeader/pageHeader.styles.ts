import { colors } from "@/theme/colors";

export const pageHeaderStyles = {
  wrapper: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    ml: { xs: 1, md: 1.5 },
  },

  title: {
    color: colors.text.primary,
    fontSize: { xs: 20, md: 22 },
    fontWeight: 850,
    letterSpacing: "-0.04em",
    lineHeight: 1.05,
  },

  subtitle: {
    color: colors.text.secondary,
    fontSize: { xs: 12, md: 13 },
    fontWeight: 500,
    lineHeight: 1.35,
    mt: 0.35,
  },
} as const;
