import { defineSlotRecipe } from "@chakra-ui/react"

export const tableSlotRecipe = defineSlotRecipe({
  className: "chakra-table",
  slots: ["root", "header", "body", "row", "columnHeader", "cell", "footer", "caption"],
  base: {
    root: {
      fontVariantNumeric: "lining-nums tabular-nums",
      borderCollapse: "collapse",
      width: "full",
      textAlign: "start",
      verticalAlign: "top",
    },
    row: {
      "& tr": {
        // _hover: {
        //   bg: "#EDF2F7",
          // transition: "background 0.2s"
        // },
      },
      _selected: {
        bg: "colorPalette.subtle",
      },
    },
    cell: {
      textAlign: "center",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid",
      borderColor: "#EDF2F7",


    },
    columnHeader: {
      fontWeight: "700",
      textAlign: "center",
      color: "2D3748",
      bgColor: "mera.bg",
      padding: "12px 0",
      borderSpacing: "0 8px",
      borderBottom: "2px solid",
      borderColor: "#718096"
    },
    caption: {
      fontWeight: "medium",
      textStyle: "xs",
    },
    footer: {
      fontWeight: "medium",
    },
  },
  variants: {
    interactive: {
      true: {
        body: {
          "& tr": {
            _hover: {
              bg: "#EDF2F7",
              // transition: "background 0.2s"
            },
          },
        },
      },
    },
    stickyHeader: {
      true: {
        header: {
          "& :where(tr)": {
            top: "var(--table-sticky-offset, 0)",
            position: "sticky",
            //zIndex: 1,
          },
        },
      },
    },
    striped: {
      true: {
        row: {
          "&:nth-of-type(odd) td": {
            bg: "bg.muted",
          },
        },
      },
    },
    showColumnBorder: {
      true: {
        columnHeader: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
          },
        },
        cell: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
          },
        },
      },
    },
    variant: {
      line: {
        columnHeader: {
          borderBottomWidth: "1px",
        },
        cell: {
          borderBottomWidth: "1px",
        },
        row: {
          bg: "bg",
        },
      },
      outline: {
        root: {
          boxShadow: "0 0 0 1px {colors.border}",
          //overflow: "hidden",
        },
        columnHeader: {
          borderBottomWidth: "1px",
        },
        header: {
          bg: "bg.muted",
        },
        row: {
          "&:not(:last-of-type)": {
            borderBottomWidth: "1px",
          },
        },
        footer: {
          borderTopWidth: "1px",
        },
      },
    },
    size: {
      sm: {
        root: {
          textStyle: "sm",
        },
        columnHeader: {
          px: "2",
          py: "2",
        },
        cell: {
          px: "2",
          py: "2",
        },
      },
      md: {
        root: {
          textStyle: "sm",
        },
        columnHeader: {
          px: "3",
          py: "3",
        },
        cell: {
          px: "3",
          py: "3",
        },
      },
      lg: {
        root: {
          textStyle: "md",
        },
        columnHeader: {
          px: "4",
          py: "3",
        },
        cell: {
          px: "4",
          py: "3",
        },
      },
    },
  },
  defaultVariants: {
    variant: "line",
    size: "md",
    interactive: true
  },
})
