import { extendTheme, StyleFunctionProps, withDefaultColorScheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false
};

export const theme = extendTheme(
  {
    fonts: {
      heading: "var(--font-poppins)",
      body: "var(--font-poppins)",
      a: "var(--font-poppins)"
    },
    styles: {
      global: (props: any) => ({
        html: {
          "--navbar-height": "60px"
        },
        body: {
          bg: props.colorMode === "dark" ? "gs-gray.900" : "gs-light.100",
          color: props.colorMode === "dark" ? "white" : "gray.800"
        },
        a: {
          color: "gs-yellow.400"
        }
      })
    },
    colors: {
      "gs-green": {
        50: "#e0fff0",
        100: "#b7f7d7",
        200: "#8cf1bb",
        300: "#60e99d",
        400: "#35e37c",
        500: "#1cca6f",
        600: "#119d5f",
        700: "#06704b",
        800: "#004431",
        900: "#00180d"
      },
      "gs-yellow": {
        50: "#ffeae0",
        100: "#facbb7",
        200: "#f2af8d",
        300: "#ea9461",
        400: "#e37c35",
        500: "#ca571c",
        600: "#9e3a15",
        700: "#71220c",
        800: "#450e03",
        900: "#1d0002"
      },
      "gs-yellow-dark": {
        "50": "#1a0a00",
        "100": "#2b1600",
        "200": "#3c2200",
        "300": "#4c2d00",
        "400": "#5d3900",
        "500": "#6d4500",
        "600": "#7e5100",
        "700": "#8f5d00",
        "800": "#a06900",
        "900": "#b07500"
      },

      "gs-gray": {
        50: "#e8f6f6",
        100: "#d4dbdd",
        200: "#bcc1c2",
        300: "#a4a9a9",
        400: "#8a8f91",
        500: "#707577",
        600: "#565c5d",
        700: "#3d4243",
        800: "#222729",
        900: "#001010"
      },
      "gs-light": {
        50: "#FFFFFF",
        100: "#F7FAFC"
      }
    },
    layerStyles: {
      "with-shadow": {
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)"
      }
    },
    config,
    components: {
      Button: {
        variants: {
          solid: (styleProps: StyleFunctionProps) => {
            if (styleProps.colorScheme === "gs-green") {
              return {
                bg: "gs-green.700",
                color: "white",
                _hover: {
                  bg: "gs-green.800"
                }
              };
            }

            if (styleProps.colorScheme === "red") {
              return {
                bg: "red.500",
                _hover: {
                  bg: "red.600"
                }
              };
            }
          }
        },
        defaultProps: {
          colorScheme: "gs-green",
          variant: "solid"
        }
      }
    }
  },
  withDefaultColorScheme({ colorScheme: "gs-yellow" })
);

export default theme;
