/proyecto-mvc
│
├── config/                       # Configuración de la base de datos y otras configuraciones globales
│   └── dbConfig.mjs              # Configuración de la conexión a la base de datos
│
├── controllers/                  # Controladores que gestionan la lógica de negocio
│   ├── paisesApiController.mjs   # Controlador para APIs de países
│   └── paisesController.mjs      # Controlador para la gestión de países en vistas
│
├── models/                       # Modelos que representan los datos del sistema
│   └── paises.mjs                # Modelo de países (estructura de la base de datos)
│
├── public/                       # Archivos públicos como CSS, JS y otros recursos
│   └── styles.css                # Archivo de estilos CSS
│
├── repositories/                 # Repositorios que abstraen la lógica de acceso a la base de datos
│   ├── IRepository.mjs           # Interfaz base para repositorios
│   └── PaisesRepository.mjs      # Repositorio específico para países
│
├── routes/                       # Rutas de la aplicación
│   ├── paisesRoutes.mjs          # Rutas para las vistas de países
│   └── paisesRoutesApi.mjs       # Rutas para las APIs de países
│
├── services/                     # Servicios con lógica de negocio adicional
│   └── paisesServices.mjs        # Servicio de países
│
├── views/                        # Vistas EJS que renderizan el contenido
│   ├── agregarPais.ejs           # Vista para agregar un país
│   ├── dashboardPaises.ejs       # Vista del dashboard principal
│   ├── editarPais.ejs            # Vista para editar un país
│   ├── home.ejs                  # Página principal
│   ├── layout.ejs                # Plantilla principal (layout)
│   └── responseView.mjs          # Vista para respuestas JSON o estados HTTP
│
├── .gitignore                    # Ignora archivos no necesarios para Git
├── app.mjs                       # Archivo principal de la aplicación
├── estructura.md                 # Documentación de la estructura del proyecto
├── package-lock.json             # Archivo de dependencias de npm
├── package.json                  # Configuración de npm
├── README.md                     # Documentación general del proyecto
└── Recorrido.txt                 # Archivo adicional con descripciones o guías
