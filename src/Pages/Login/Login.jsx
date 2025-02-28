import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  HStack,
  Box,
  VStack,
  Heading,
  Stack,
  Container,
  Image,
  Text,
  Input,
} from "@chakra-ui/react";
import { Field } from "@components/ui/field";
import { PasswordInput } from "@components/ui/password-input";
import { Alert } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { useAuth } from "@context/AuthContext";
import { useUser } from "@context/UserContext";
import { loginUser } from "@services/authService";
import { SlPlane } from "react-icons/sl";

import "./login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetcUser } = useUser();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setloading(true);

    try {
      const token = await loginUser(data.email, data.password);

      if (token) {
        const userData = await fetcUser(token);
        console.log(userData);
        if (userData) {
          setloading(false);
          login(token);
          navigate("/home");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <svg
          className="fondo"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.dev/svgjs"
          viewBox="0 0 100% 100%"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient
              gradientTransform="rotate(273, 0.5, 0.5)"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="ffflux-gradient"
            >
              <stop stop-color="#3d6e3a" stop-opacity="1" offset="0%"></stop>
              <stop stop-color="#6ac7f3" stop-opacity="1" offset="100%"></stop>
            </linearGradient>
            <filter
              id="ffflux-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.005 0.003"
                numOctaves="2"
                seed="2"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="turbulence"
              ></feTurbulence>
              <feGaussianBlur
                stdDeviation="27 16"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="turbulence"
                edgeMode="duplicate"
                result="blur"
              ></feGaussianBlur>
              <feBlend
                mode="screen"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="SourceGraphic"
                in2="blur"
                result="blend"
              ></feBlend>
            </filter>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#ffflux-gradient)"
            filter="url(#ffflux-filter)"
          ></rect>
        </svg>

        <Box className="login-aside">
          <VStack className="aside-items-container">
            <Text className="login-phrase">
              Connecting people, enriching lives, inspiring new horizons.
            </Text>
          </VStack>
        </Box>

        <HStack className="login-container">
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <Box
              className="login-form-container"
              w={{ base: "100%", sm: "400px" }}
              p={6}
              boxShadow="xl"
              borderRadius="lg"
              bg="white"
            >
              <VStack spacing={4} align="stretch" display="flex" flexDir="column" justifyContent="center">
                <Image className="mera-logo-login" src="src\assets\meraClean.png" />
                <Heading size="2xl" color="meraPalette.primary">
                  Iniciar Sesión
                </Heading>
                {error && <Alert status="error" title={error}></Alert>}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap="25px" align="flex-start" maxW="sm">
                    <Field
                      label="Correo electrónico"
                      invalid={!!errors.email}
                      errorText={errors.email?.message}
                    >
                      <Input
                        className="login-input"
                        type="email"
                        focusRingColor={"green.600"}
                        placeholder="usuario@ejemplo.com"
                        {...register("email", {
                          required: "El correo es obligatorio",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Correo electrónico inválido",
                          },
                        })}
                      />
                    </Field>

                    <Field
                      label="Contraseña"
                      invalid={!!errors.password}
                      errorText={errors.password?.message}
                    >
                      <PasswordInput
                        className="login-input"
                        placeholder="••••••"
                        focusRingColor={"green.600"}
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
                        w="100%"
                        loading={loading}
                        size="md"
                        type="submit"
                        variant={"solid"}
                        colorPalette="meraPrimary"
                      >
                        {" "}
                        Ingresar{" "}
                      </Button>
                    </div>
                  </Stack>
                </form>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </div>
    </>
  );
}

export default Login;
