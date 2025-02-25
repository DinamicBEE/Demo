import { chakra, defineRecipe } from "@chakra-ui/react";

export const tableRecipe = defineRecipe({
    className: "TableHeader",
    base: {
        bg: "#008D38"
    }

});

export const TableHeader = chakra("th", tableRecipe);