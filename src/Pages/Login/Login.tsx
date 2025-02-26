import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { HStack, Box, VStack, Heading, Stack } from "@chakra-ui/react";
import { Field } from "@components/ui/field";
import { PasswordInput } from "@components/ui/password-input";
import { Alert } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { useAuth } from "@context/AuthContext";
import "./login.css";

function Login() {
  const { handleLogin, error } = useAuth();
  const [loading, setloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ user: string; password: string }>();

  const onSubmit = async (data: { user: string; password: string }) => {
    setloading(true);
    await handleLogin(data.user, data.password);
    setloading(false);
  };

  return (
    <HStack className="container">
      <Box
        w="100vw"
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgGradient="linear(to-r, teal.100, blue.100)"
        p={4}
      >
        <Box
          w={{ base: "100%", sm: "400px" }}
          p={6}
          boxShadow="xl"
          borderRadius="lg"
          bg="white"
        >
          <VStack align="stretch">
            <Heading size="lg" textAlign="center" color="teal.500">
              Iniciar Sesión
            </Heading>
            {error && <Alert status="error" title={error}></Alert>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="4" align="flex-start" maxW="sm">
                <Field
                  label="Usuario"
                  invalid={!!errors.user}
                  errorText={errors.user?.message}
                >
                  <input
                    placeholder="Usuario"
                    {...register("user", {
                      required: "El usuario es obligatorio",
                    })}
                  />
                </Field>

                <Field
                  label="Password"
                  invalid={!!errors.password}
                  errorText={errors.password?.message}
                >
                  <PasswordInput
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message:
                          "La contraseña debe tener al menos 6 caracteres",
                      },
                    })}
                  />
                </Field>

                <div className="buttonContainer">
                  <Button
                    loading={loading}
                    size="md"
                    type="submit"
                    colorPalette="teal"
                    variant="surface"
                  >
                    Login
                  </Button>
                </div>
              </Stack>
            </form>
          </VStack>
        </Box>
      </Box>
    </HStack>
  );
}

export default Login;
