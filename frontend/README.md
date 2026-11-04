# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Backend API URL

The frontend reads `VITE_API_URL` to determine the backend server address. For local
development, copy `.env.example` to `.env` in the `frontend` folder. For a hosted
build, set `VITE_API_URL` to the backend's public URL (for example,
`https://your-backend.onrender.com`) in the hosting provider's environment settings.
Do not include `/api` at the end. This value is public and must not contain secrets.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
