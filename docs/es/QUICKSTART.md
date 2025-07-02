# Guía de Inicio Rápido 🚀

<div align="center">

**Comienza con GitHub Mastery en minutos**

_Get started with GitHub Mastery in minutes_

🇪🇸 Español | [🇺🇸 English](../en/QUICKSTART.md) | [🇧🇷 Português](../pt-br/QUICKSTART.md)

</div>

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** o **yarn** (viene con Node.js)
- **Git** ([Descargar](https://git-scm.com/))
- **Cuenta de GitHub** con Personal Access Token

## 🔑 Configuración del Token de GitHub

### 1. Crear Personal Access Token

1. Ve a [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Haz clic en **"Generate new token (classic)"**
3. Dale un nombre descriptivo: `GitHub Mastery CLI`
4. Selecciona los scopes necesarios:
    - ✅ `repo` (Control total de repositorios privados)
    - ✅ `user` (Actualizar datos del usuario)
    - ✅ `notifications` (Acceder a notificaciones)
    - ✅ `workflow` (Actualizar flujos de trabajo de GitHub Actions)
5. Haz clic en **"Generate token"**
6. **Copia el token inmediatamente** (¡no lo verás de nuevo!)

### 2. Permisos del Token Explicados

| Scope           | Propósito                                             | Requerido   |
| --------------- | ----------------------------------------------------- | ----------- |
| `repo`          | Operaciones de repositorio (crear, listar, gestionar) | ✅ Sí       |
| `user`          | Información del perfil del usuario                    | ✅ Sí       |
| `notifications` | Acceso a notificaciones                               | 🔶 Opcional |
| `workflow`      | Gestión de GitHub Actions                             | 🔶 Opcional |
| `gist`          | Gestión de gists                                      | 🔶 Opcional |

## 🚀 Instalación

### Opción 1: Configuración Rápida (Recomendada)

```bash
# Clonar el repositorio
git clone https://github.com/NEO-SH1W4/GITHUB_MASTERY.git
cd GITHUB_MASTERY

# Instalar dependencias
npm install

# Configurar el entorno
cp .env.example .env
```

### Opción 2: Fork y Clonar

```bash
# Haz fork del repositorio en GitHub primero, luego:
git clone https://github.com/TU_USUARIO/GITHUB_MASTERY.git
cd GITHUB_MASTERY
npm install
cp .env.example .env
```

## ⚙️ Configuración

### 1. Variables de Entorno

Edita tu archivo `.env`:

```bash
# Configuración de GitHub
GITHUB_TOKEN=ghp_tu_personal_access_token_aqui
GITHUB_USERNAME=tu_usuario_github

# Configuración de Webhook (opcional)
WEBHOOK_SECRET=tu_webhook_secret_aqui
WEBHOOK_PORT=3000

# Configuración de la API
API_BASE_URL=https://api.github.com
RATE_LIMIT_THRESHOLD=100
```

### 2. Verificar Instalación

```bash
# Probar instalación de CLI
npm start -- --help

# Debería mostrar:
# Usage: gh-mastery [options] [command]
# GitHub Mastery CLI - Ferramenta para operações GitHub
```

## 🎯 Primeros Pasos

### 1. Autenticar

```bash
# Verificar autenticación de GitHub
node cli-tools/gh-cli.js auth

# Salida esperada:
# ✅ Authentication successful!
# 👤 User: tu-usuario
# 🔑 Rate limit: 5000/5000
```

### 2. Verificar Estado de la Cuenta

```bash
# Obtener resumen de la cuenta
node cli-tools/gh-cli.js status

# Muestra:
# - Información del usuario
# - Conteo de repositorios
# - Límites de velocidad
# - Conectividad de la API
```

### 3. Listar tus Repositorios

```bash
# Listar tus repositorios
node cli-tools/gh-cli.js repos --limit 10

# Con filtros
node cli-tools/gh-cli.js repos --type public --sort updated
```

## 💡 Casos de Uso Comunes

### Gestión de Repositorios

```bash
# Obtener detalles del repositorio
node cli-tools/gh-cli.js repo owner nombre-repo

# Crear nuevo repositorio (interactivo)
node cli-tools/gh-cli.js create-repo
```

### Gestión de Issues

```bash
# Listar issues de un repositorio
node cli-tools/gh-cli.js issues owner nombre-repo

# Filtrar solo issues abiertas
node cli-tools/gh-cli.js issues owner nombre-repo --state open
```

### Servidor de Webhook

```bash
# Iniciar servidor de webhook para eventos en tiempo real
npm run webhook

# En modo desarrollo (auto-reload)
npm run dev
```

## 🔧 Comandos de Desarrollo

### Scripts Disponibles

```bash
# Iniciar CLI
npm start

# Ejecutar servidor de webhook
npm run webhook

# Modo desarrollo
npm run dev

# Ejecutar ejemplo
npm run example

# Calidad de código
npm run lint
npm run format
npm run validate
```

### Referencia de Comandos CLI

| Comando       | Descripción              | Ejemplo                       |
| ------------- | ------------------------ | ----------------------------- |
| `auth`        | Verificar autenticación  | `npm start auth`              |
| `status`      | Resumen de la cuenta     | `npm start status`            |
| `repos`       | Listar repositorios      | `npm start repos --limit 10`  |
| `repo`        | Detalles del repositorio | `npm start repo owner nombre` |
| `issues`      | Listar issues            | `npm start issues owner repo` |
| `create-repo` | Crear repositorio        | `npm start create-repo`       |

## 🐛 Solución de Problemas

### Problemas Comunes

#### ❌ Fallo en la Autenticación

```bash
# Error: Request failed with status code 401
```

**Solución**: Verifica tu token de GitHub en el archivo `.env`

#### ❌ Límite de Velocidad Excedido

```bash
# Error: API rate limit exceeded
```

**Solución**: Espera a que se restablezca el límite de velocidad o usa solicitudes autenticadas

#### ❌ Comando No Encontrado

```bash
# Error: node: command not found
```

**Solución**: Instala Node.js desde [nodejs.org](https://nodejs.org/)

#### ❌ Permiso Denegado

```bash
# Error: EACCES: permission denied
```

**Solución**: Verifica los permisos de archivo o ejecuta con privilegios apropiados

### Modo Debug

```bash
# Habilitar logging detallado
DEBUG=* node cli-tools/gh-cli.js auth

# Verificar variables de entorno
node -e "console.log(process.env.GITHUB_TOKEN ? 'Token configurado' : 'Token faltante')"
```

## 📚 Próximos Pasos

Ahora que estás configurado, explora más funcionalidades:

1. 📖 [**Referencia de Comandos CLI**](./CLI.md)
2. 🔗 [**Guía de Configuración de Webhooks**](./WEBHOOKS.md)
3. 🔌 [**Ejemplos de Uso de la API**](../../examples/)
4. 🤝 [**Guía de Contribución**](../../CONTRIBUTING.md)

## 💬 ¿Necesitas Ayuda?

- 🐛 [Reportar problemas](https://github.com/NEO-SH1W4/GITHUB_MASTERY/issues)
- 💬 [Iniciar una discusión](https://github.com/NEO-SH1W4/GITHUB_MASTERY/discussions)
- 📖 [Verificar documentación](../../README.md)
- 🔍 [Buscar issues existentes](https://github.com/NEO-SH1W4/GITHUB_MASTERY/issues?q=is%3Aissue)

---

<div align="center">

**¿Listo para dominar la automatización de GitHub?** 🚀

[🏠 Homepage](https://github.com/NEO-SH1W4/GITHUB_MASTERY) • [📖 Documentación Completa](../../README.md)

</div>
