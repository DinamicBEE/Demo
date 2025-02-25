import { createSystem, defaultConfig, Table } from "@chakra-ui/react"
import { tableSlotRecipe } from "./table.recipe";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: { value: "#008D38" },
        secondary: { value: "#00B74F" },
        neutrals: {
            dark: { value: "#2D3748" },
            medium: { value: "#718096" },
            light: { value: "#EDF2F7" }
        }
      },
      fonts: {
        heading: { value: `'Poppins', sans-serif` },
        body: { value: `'times new roman', sans-serif` },
      },
    },
    slotRecipes: {
      Table: tableSlotRecipe
    }
  },
});