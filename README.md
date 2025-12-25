
# CasinoBet - Sistema Web de Apuestas

Esta aplicación es una conversión completa de un sistema C++ de gestión de apuestas estudiantiles a una plataforma web moderna, segura y visualmente atractiva.

## 🚀 Cómo Ejecutar en Local

1. **Clonar el repositorio.**
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar Variables de Entorno:**
   - Copia `.env.example` a `.env` y ajusta tus credenciales.
4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🌐 Despliegue en Netlify

El proyecto está pre-configurado para un despliegue sin problemas:

1. **Crear un nuevo sitio en Netlify** desde tu repositorio Git.
2. **Configuración de Build:**
   - Command: `npm run build`
   - Publish directory: `dist`
3. **Añadir Variables de Entorno:**
   - En el panel de control de Netlify, ve a `Site settings > Build & deploy > Environment` y añade las variables de tu archivo `.env`.
4. **Funciones Serverless:**
   - El backend se desplegará automáticamente desde la carpeta `netlify/functions` (si implementas endpoints externos).

## 🛡️ Características de Seguridad
- **JWT:** Sesiones protegidas mediante JSON Web Tokens.
- **Validación Estricta:** Se respetan todas las longitudes y reglas de negocio del código C++ original.
- **Gestión de Archivos:** Reemplazo de "número de transferencia" por subida de comprobante real (JPG/PNG/PDF).
- **Control Admin:** Límite estricto de 1 administrador (configurable).
