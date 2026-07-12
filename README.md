# 🏐 PlayMatch - Frontend Angular

Este es el frontend de **PlayMatch**, una aplicación para la gestión de reservas deportivas. Está desarrollado con [Angular](https://angular.io/), [TypeScript](https://www.typescriptlang.org/) y estilizado con [Tailwind CSS](https://tailwindcss.com/). Se conecta a una API backend protegida con autenticación JWT.

🔗 **Repositorio del backend**:  
[PlayMatch Api](https://github.com/luisgomezadev/backend-playmatch)

---

## 🎯 Características

- Inicio de sesión y registro de usuarios
- Gestión de reservas de canchas deportivas
- Autenticación con JWT
- Interfaz moderna y responsiva
- Diferentes vistas según el rol del usuario (jugador/admin)
- Consumo de API REST (PlayMatch Backend)

---

## 🚀 Tecnologías utilizadas

- 🅰️ [Angular 17+](https://angular.io/)
- 🔐 JWT (manejo en frontend)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- ⚙️ RxJS y servicios para consumo de API
- 🧩 FormBuilder, Guards, Interceptors, Lazy Loading

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/luisgomezadev/frontend-playmatch.git
cd frontend-playmatch
```

2. Instala las dependencias:

```bash
npm install
```

3. Levanta el proyecto:

```bash
ng serve
```

---

## 🌐 Demo en producción

Puedes ver la aplicación desplegada aquí: [PlayMatch](https://projectplaymatch.vercel.app)

---

## 🧪 Usuarios de prueba

Para propósitos de demo, puedes ingresar con las siguientes credenciales:

#### 👨‍💼 Administrador
- **Correo:** `luis@gmail.com`
- **Contraseña:** `Contra-12345`

#### 👤 Jugadores
- **Jugador 1:** `daniel@gmail.com` / `Contra-12345`
- **Jugador 2:** `angelo@gmail.com` / `Contra-12345`

🔒 Estos usuarios tienen acceso limitado según su rol.
