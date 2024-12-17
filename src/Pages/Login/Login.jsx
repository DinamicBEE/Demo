import { 
    HStack, 
    Box, 
    Button,
    VStack,
    Heading,
    Stack 
} from "@chakra-ui/react";
import { Field  } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input"
import { Alert } from "../../components/ui/alert"
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import './login.css'

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, } = useForm();
    
    const onSubmit = (data) => {
        setError("");

        if(data.email === 'user@example.com' && data.password === 'password') {
            navigate('/home');
        } else {
            setError('Credenciales incorrectas');
        }
    }

    return(
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
                    <VStack spacing={4} align="stretch">
                        <Heading size="lg" textAlign="center" color="teal.500">
                            Iniciar Sesión
                        </Heading>
                        { error && (
                            <Alert status="error" title={error}>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack gap="4" align="flex-start" maxW="sm">
                                <Field
                                    label="Email"
                                    invalid={!!errors.email}
                                    errorText={errors.email?.message}
                                >
                                    <input 
                                        type="email"
                                        placeholder="correo@ejemplo.com" 
                                        {...register("email",{
                                            required: "El correo es obligatorio",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Correo electrónico inválido"
                                            }
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
                                                message: "La contraseña debe tener al menos 6 caracteres",
                                              },
                                        })}
                                    />
                                </Field>

                                <div className="buttonContainer">
                                    <Button size="md" type="submit" colorPalette="teal" variant="surface">Login</Button>
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