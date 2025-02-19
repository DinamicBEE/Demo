import { toaster } from "@components/ui/toaster"

export const toast = (message: string, type: "success" | "error" | "warning") => {
    toaster.create({
        description: message,
        type,
        duration: 2000
    })
}