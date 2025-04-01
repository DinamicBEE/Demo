# Mera Frontend

Mera Corte de Caja es un proyecto diseñado para proporcionar una interfaz de usuario moderna y eficiente para realizar la validación de los diversos tipos de metodos de pago que Mera utiliza en sus transacciones, asi como para efectuar la gestion del proceso de registro de esta infomraciíon: cortes de caja, cierre de lotes, procesos de reaperturas y repotes. Este proyecto está construido utilizando React v18 basdo en TypeScrip y Chakra-ui.

## Características

- Cortes de caja
   - Sección efectivo
   - Sección TDC
   - Sección Clientes
   - Sección Clientes especiales
   - Sección Prepagos
   - Sección Empleados
   - Sección Intercompañias
- Cierres de lotes
- Solicitudes de reaperturas
- Aprobaciones de reapertura
- Reportes

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js v16.14.0 o superior
- Proyecto Mera (Backend) desplegado
   - Java 17
   - Maven
   - Docker

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

1. Desplegar el proyecto de backend (Consultar documentación del proyecto)

2. Clona este repositorio:
   ```
   git clone https://user@bitbucket.org/beexponential/mera-frontend.git
   ```

3. Navega al directorio del proyecto donde se descargo:
   ```
   cd mera-frontend
   ```

4. Instala las dependencias:
   ```
   npm install
   ```

5. Inicia el servidor de desarrollo:
   ```
   npm run dev:back
   ```

6. Abre tu navegador en `http://localhost:5173`.

## Estructura del Proyecto

La estructura del proyecto sigue una organización modular para facilitar el mantenimiento y la escalabilidad. A continuación, se describe la estructura principal:

```
mera-frontend/
├── config/
│   ├── ssl/            # Certificados para comunicación y autenticación con el Backend
├── public/             # Archivos estáticos públicos (HTML, imágenes, etc.)
├── src/                # Código fuente principal
│   ├── api/            # Lógica de configuración para comunicacióna APIs
│   ├── assets/         # Recursos como imágenes, fuentes, estilos globales
│   ├── components/     # Componentes reutilizables de la interfaz de usuario
│   ├── context/        # Lógica de persistencia de datos de las paginas
│   ├── hooks/          # Lógica de negocio
│   ├── indexedDB/      #
│   ├── models/         # Modelado de entidades utilizadas
│   ├── pages/          # Páginas principales de la aplicación
│   ├── routes/         # Lógica y configuración de rutas de la aplicación 
│   ├── services/       # Lógica de llamadas a APIs
│   ├── styles/         # Definiciones de estilos para componentes personalizados 
│   ├── theme/          # Configuración de estilos globales Chakra-UI
│   ├── utils/          # Funciones utilitarias y helpers
│   ├── App.tsx         # Componente raíz de la aplicación
│   ├── main.tsx        # Punto de entrada principal
│   ├── vite-env.d.ts   # Configuración de variables de entorno
├── package.json        # Configuración del proyecto y dependencias
└── README.md           # Documentación del proyecto
```

## Uso

[Instrucciones sobre cómo usar la aplicación, ejemplos de flujo de trabajo o capturas de pantalla.]

## Licencia

Este proyecto está licenciado bajo la [Licencia que uses]. Consulta el archivo `LICENSE` para más detalles.