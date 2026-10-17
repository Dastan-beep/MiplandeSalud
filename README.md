# NutriFit Perú 🇵🇪 — Nutrición, Macros y Recetas Criollas

Aplicación web progresiva (PWA) de salud y nutrición deportiva adaptada a la realidad culinaria del Perú (platos típicos, mercados y supermercados como Metro, Plaza Vea, Tottus y Vivanda), con cálculo dinámico de macros, desglose de recetas, escáner de etiquetas y asistente de IA.

---

## 🚀 Cómo subir este proyecto a GitHub

### 1. Archivos que SÍ se suben a GitHub
- Carpeta `src/` (todos tus componentes, tipos, fórmulas y lógica)
- Carpeta `public/` (`manifest.json`, iconos `icon.svg`)
- `index.html`
- `package.json` y `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `server.ts`
- `metadata.json`
- `.env.example`
- `.gitignore`
- `README.md`

### 2. Archivos que NUNCA debes subir (se ignoran automáticamente por `.gitignore`)
- `node_modules/` (se instala automáticamente con `npm install`)
- `dist/` o `build/`
- `.env` (contiene tus llaves secretas de Firebase y Gemini)

### 3. Comandos paso a paso para subirlo a tu GitHub
Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# 1. Iniciar el repositorio git
git init

# 2. Agregar todos los archivos permitidos
git add .

# 3. Hacer el primer commit
git commit -m "feat: NutriFit Perú - PWA con desglose de recetas, macros dinámicos y NutriCoach IA"

# 4. Cambiar a la rama principal 'main'
git branch -M main

# 5. Conectar con tu repositorio de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 6. Subir los archivos
git push -u origin main
```

---

## 📱 Cómo descargarlo / instalarlo como App

### Opción A: Como PWA (Directo desde el navegador sin tiendas)
La aplicación ya está configurada como una **Progressive Web App (PWA)**:
1. Sube tu aplicación a un hosting como **Vercel**, **Netlify**, **Firebase Hosting** o **Render**.
2. Abre la URL en tu celular:
   - **En Android / Chrome / Windows**: Verás el botón verde **"Instalar App"** en la barra superior o en el menú de Chrome de 3 puntos selecciona *"Instalar aplicación"*.
   - **En iPhone / iPad (Safari)**: Presiona el botón de **Compartir** (cuadrado con flecha hacia arriba) y selecciona *"Agregar a la pantalla de inicio"*.
3. La app se instalará con su icono, se abrirá a pantalla completa (sin barra del navegador) y guardará tus datos de forma local.

### Opción B: Convertir a APK nativo de Android (con Capacitor)
Si deseas generar un archivo `.apk` para instalarlo en Android o subirlo a la Google Play Store:
```bash
# 1. Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inicializar Capacitor
npx cap init "NutriFit Peru" "com.nutrifit.peru" --web-dir dist

# 3. Compilar la aplicación web
npm run build

# 4. Agregar plataforma Android
npx cap add android

# 5. Abrir en Android Studio para generar el APK
npx cap open android
```

---

## 🔥 Cómo conectar con Firebase (Firestore & Auth)

El proyecto ya incluye el módulo `src/lib/firebase.ts` listo para usar.

### Paso 1: Crear el proyecto en Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com/) con tu cuenta de Google.
2. Haz clic en **"Crear un proyecto"** (nómbralo por ejemplo `nutrifit-peru`).
3. En el menú izquierdo ve a **Compilación > Authentication** y presiona *Comenzar*:
   - Habilita el método **Google** o **Correo electrónico/Contraseña**.
4. En el menú izquierdo ve a **Compilación > Firestore Database**:
   - Presiona *Crear base de datos* en modo producción o prueba.

### Paso 2: Registrar la app Web y obtener las credenciales
1. En la página principal del proyecto haz clic en el icono **Web `</>`**.
2. Ponle un nombre y copia los valores del objeto `firebaseConfig`:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Paso 3: Configurar tus variables de entorno locales
Crea un archivo llamado `.env` en la raíz de tu proyecto (junto a `.env.example`) y pega tus datos:

```env
# Gemini AI
GEMINI_API_KEY="tu_clave_gemini"

# Firebase Client Keys
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="tu-proyecto"
VITE_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
```

El código en `src/lib/firebase.ts` detectará automáticamente estas variables y sincronizará los perfiles y comidas a Firestore. Si no están configuradas, funcionará sin interrupciones guardando todo en el `localStorage` del dispositivo.

---

## 🛠️ Ejecución Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
