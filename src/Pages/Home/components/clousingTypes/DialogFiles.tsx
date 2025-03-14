import {
  Button,
  Flex,
  useFileUpload,
  FileUpload,
  Icon,
  Box,
} from "@chakra-ui/react";
import { Alert } from "@components/ui/alert";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { useTDCAdyenContext } from "@context/clousing/tdcAdyenContext";
import { DialogFilesProps } from "@models/tdc.model";
import { FileError } from "@zag-js/file-utils";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";

function DialogFiles({ isOpen, onClose, subsidiary, location }: DialogFilesProps) {
  const { fetchProcessFiles } = useTDCAdyenContext();
  const fileUpload = useFileUpload({
    maxFiles: 20,
    accept: ".csv",
    onFileChange: () => {
      setError("");
    },
    validate(file, details) {
      const errors: FileError[] = [];
      details.acceptedFiles.forEach((files) => {
        if (files.name === file.name) {
          errors.push("Archivo duplicado");
        }
      });
      return errors.length > 0 ? errors : null;
    },
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (files: File[]) => {
    setLoading(true);
    const data = await fetchProcessFiles(files, subsidiary, location);

    if (data && data.success === true) {
      fileUpload.clearFiles();
      setError("");
      onClose();
    } else {
      setError(data?.error || "Error al procesar los archivos");
    }
    setLoading(false);
  };

  return (
    <DialogRoot
      open={isOpen}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      scrollBehavior="inside"
      onOpenChange={() => {
        onClose(), fileUpload.clearFiles(), setError("");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar archivos</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FileUpload.RootProvider width={"100%"} value={fileUpload}>
            <FileUpload.HiddenInput />
            <FileUpload.Label />
            <FileUpload.Dropzone
              width={"100%"}
              pointerEvents={loading ? "none" : "auto"}
            >
              <Icon size="md" color="fg.muted">
                <LuUpload />
              </Icon>
              <FileUpload.DropzoneContent>
                <Box>Arrastra y suelta tus archivos aquí o presiona</Box>
                <Box color="fg.muted">.csv</Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <FileUpload.Trigger />
            {fileUpload.rejectedFiles.length > 0 && (
              <Alert status="error" mb={4}>
                {fileUpload.rejectedFiles.map((file, index) => (
                  <Box key={file.file.name}>
                    {file.file.name} - {file.errors[0]}
                  </Box>
                ))}
              </Alert>
            )}
            {error && (
              <Alert status="error" mb={4}>
                {error}
              </Alert>
            )}
            <FileUpload.ItemGroup>
              <FileUpload.Context>
                {({ acceptedFiles }) =>
                  acceptedFiles.map((file) => (
                    <FileUpload.Item key={file.name} file={file}>
                      <FileUpload.ItemPreview />
                      <FileUpload.ItemName />
                      <FileUpload.ItemDeleteTrigger
                        onClick={() => fileUpload.clearRejectedFiles()}
                      />
                    </FileUpload.Item>
                  ))
                }
              </FileUpload.Context>
            </FileUpload.ItemGroup>
          </FileUpload.RootProvider>
        </DialogBody>

        <DialogFooter>
          <Flex gap={4}>
            <Button
              disabled={fileUpload.acceptedFiles.length === 0}
              loading={loading}
              colorPalette="meraInfo"
              onClick={() => {
                handleFileUpload(fileUpload.acceptedFiles);
              }}
            >
              Procesar archivos
            </Button>
          </Flex>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default DialogFiles;
