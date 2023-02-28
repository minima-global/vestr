import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: `
            body {
                background: #16181C;
            }
          `,
    },
  },
});

theme = createTheme(theme, {
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(254, 242, 242)",
          color: "rgb(153, 27, 27)!important",
          padding: 8,
          margin: 0,
          fontSize: "0.875rem",
          fontFamily: "Manrope-regular",
          letterSpacing: "0.00938em",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          marginTop: 4,
          borderRadius: 4,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        "&$error": {
          color: "black",
        },
      },
      root: {
        "&$error": {
          color: "black",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS

          borderRadius: 8,
          textTransform: "none",
          fontWeight: 800,
          letterSpacing: 0,
          lineHeight: "21px",
          minHeight: 44,
          fontSize: "0.875rem",

          "&:disabled": {
            backgroundColor: "#D3D3D8",
            color: "#fff",
            cursor: "not-allowed",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.text.primary,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          borderRadius: 8,

          input: {
            color: "#000",
            border: "1px solid #585f63",
            paddingLeft: 16,
            fontWeight: "600",
            textOverflow: "ellipsis",
            paddingRight: 16,

            "&::placeholder": {
              fontWeight: "600",
              color: "#585f63",
            },
            "&:focus": {
              backgroundColor: "#fff",
            },
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          zIndex: 0,
          borderBottom: "none",
          backgroundColor: "#0D0E10",
          color: "#fff",
          padding: "0px 8px!important",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          "&& .Mui-selected, && .Mui-selected:hover": {
            color: "#317AFF",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 8,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          paddingBottom: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "&:focus": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Manrope-regular",
        },
      },
    },
  },
});

export default theme;
