# Proyecto Contable - Guía de Colaboración (GEMINI.md)

Este documento sirve como una guía para el desarrollo y la colaboración en el Proyecto Contable, asegurando que mantengamos un código consistente, limpio y escalable. Refleja el estado actual del proyecto, incluyendo su arquitectura y funcionalidades.

## 1. Resumen del Proyecto

- **Propósito**: Aplicación web en formato de asistente multi-paso que guía al usuario a través de una serie de preguntas para determinar si debe declarar renta y, posteriormente, identificar a qué beneficios fiscales podría acceder.
- **Framework**: [Angular](https://angular.io/)
- **Componentes Principales**: Angular Material para la UI.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: CSS.

## 2. Tech Stack y Dependencias Clave

- **@angular/core, @angular/common, @angular/forms, @angular/router**: El núcleo de Angular para componentes, directivas, formularios y enrutamiento.
- **@angular/material**: Librería de componentes de UI que implementa Material Design. Se utiliza para:
    - `mat-form-field`, `matInput`: Campos de formulario.
    - `mat-radio-group`: Preguntas de opción múltiple.
    - `mat-progress-bar`: Barra de progreso para guiar al usuario.
    - `mat-icon`, `mat-tooltip`: Iconos de ayuda con información contextual.
- **rxjs**: Para la programación reactiva (manejo de eventos y operaciones asíncronas).
- **TypeScript**: Superset de JavaScript que añade tipado estático.

## 3. Estructura del Proyecto

La estructura sigue el estándar de un proyecto Angular CLI.

```
app-contable/
├── src/
│   ├── app/
│   │   ├── formulario-contable/  # Componente principal de la aplicación
│   │   │   ├── formulario-contable.ts       # Lógica del componente
│   │   │   ├── formulario-contable.html     # Estructura HTML
│   │   │   ├── formulario-contable.css      # Estilos específicos del componente
│   │   │   └── formulario-contable.spec.ts  # Pruebas unitarias
│   │   ├── app.component.ts, .html, .css # Componente raíz que carga el formulario
│   │   └── ...
│   ├── assets/                   # Recursos estáticos como imágenes (si se añaden)
│   ├── custom-theme.scss         # Tema personalizado de Angular Material
│   ├── styles.css                # Estilos globales
│   └── main.ts                   # Punto de entrada de la aplicación
├── angular.json                  # Configuración del workspace de Angular
├── package.json                  # Dependencias y scripts del proyecto
└── tsconfig.json                 # Configuración de TypeScript
```

## 4. Scripts de Desarrollo

Los siguientes scripts están definidos en `package.json` y se ejecutan con `npm run <script>` o `ng <script>`:

- `npm start` o `ng serve`: Inicia el servidor de desarrollo en `http://localhost:4200/`.
- `npm run build` o `ng build`: Compila la aplicación para producción.
- `npm test` o `ng test`: Ejecuta las pruebas unitarias con Karma y Jasmine.
- `npm run watch`: Compila en modo de desarrollo y vigila los cambios.

## 5. Convenciones y Buenas Prácticas

- **Componentes**: Seguir el principio de Single Responsibility. El componente `FormularioContable` actualmente maneja la lógica y la presentación del formulario, lo cual es adecuado para su tamaño. Si crece, se podría modularizar.
- **Nomenclatura**: Usar `camelCase` para propiedades y métodos en TypeScript, y `kebab-case` para nombres de archivos y selectores de componentes (`app-formulario-contable`).
- **Tipado**: Aprovechar el tipado estático de TypeScript. Las propiedades del componente `FormularioContable` ya están tipadas (`campo1: number | undefined;`). Mantener esta práctica.
- **Estilos**:
    - Usar `custom-theme.scss` para definir colores y tipografía de Angular Material.
    - Usar `styles.css` para estilos globales que afecten a toda la aplicación.
    - Usar archivos `.css` específicos de cada componente para estilos que solo apliquen a ese componente. Esto encapsula los estilos y previene conflictos.
- **Formularios**: El proyecto utiliza "Template-Driven Forms" de Angular (`[(ngModel)]`). Para formularios más complejos en el futuro, se podría considerar migrar a "Reactive Forms".
- **Enrutamiento**: Las rutas se definen en `src/app/app.routes.ts`. Actualmente está vacío. A medida que la aplicación crezca, se añadirán aquí las nuevas vistas/componentes.
- **Pruebas**: El CLI de Angular genera archivos `.spec.ts` para pruebas unitarias. Es una buena práctica crear pruebas para la lógica de negocio que se vaya añadiendo.

## 6. Pasos a Futuro y Colaboración

- **Implementar Lógica de Cálculo**: La lógica para procesar los valores de los campos y determinar si el usuario debe declarar renta necesita ser implementada en `formulario-contable.ts`.
- **Modularización**: Si la aplicación crece, crear nuevos componentes para diferentes funcionalidades (ej. un componente para mostrar resultados, otro para la cabecera, etc.).
- **Enrutamiento**: Implementar el enrutamiento para navegar entre diferentes vistas si es necesario.
- **Gestión de Estado**: Para aplicaciones más complejas, considerar una solución de gestión de estado como NgRx o servicios de Angular con `BehaviorSubject`.

Siguiendo estas pautas, aseguraremos que el proyecto se mantenga organizado y sea fácil de mantener a largo plazo.
