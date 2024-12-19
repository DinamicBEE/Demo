import { 
    HStack, 
    Box, 
    VStack,
    Heading,
    Stack 
} from "@chakra-ui/react";
import { Field  } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input"
import { Alert } from "../../components/ui/alert"
import { Button } from "../../components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { loginUser } from "../../services/authService";
import './login.css'
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { fetcUser } = useUser();
    const [loading, setloading] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, } = useForm();
    
    const onSubmit = async (data) => {
        setError("");
        setloading(true);

        try {
            const token = await loginUser(data.email, data.password);
            
            if(token) {
                const userData = await fetcUser(token);
                setloading(false);

                console.log(userData);
                login({
                    ...userData,
                    role: 1
                });
                navigate('/home');
            }
        } catch (error) {
            setloading(false);
            setError(error.message);
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
                                    <Button loading={loading} size="md" type="submit" colorPalette="teal" variant="surface">Login</Button>
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