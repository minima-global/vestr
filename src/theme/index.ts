import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: "#16181C",
    },
    secondary: {
      main: "#317AFF",
    },
  },
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
        root: {
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
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#16181c",
          fontSize: "1rem",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          borderRadius: 8,

          input: {
            padding: "8px",
            color: "#000",
            border: "1px solid #585f63",
            fontWeight: "600",
            textOverflow: "ellipsis",
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
