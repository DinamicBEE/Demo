import { toaster } from "@components/ui/toaster"

export const toast = (message: string, type: "success" | "error" | "warning", title?: string) => {
    // toaster.getCount() > 2 && toaster.remove();
    toaster.create({
        title: title ? title : "",
        description: message,
        type,
        duration: 1500,
        closable: true,
    })
}