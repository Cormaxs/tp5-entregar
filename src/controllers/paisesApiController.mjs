import { obtenerPaises } from '../services/paisesServices.mjs';
import { renderizarListaPaises } from '../views/responseView.mjs';
import Pais from '../models/paises.mjs'; // Asegúrate de importar el modelo Pais
import PaisesRepository from '../repositories/PaisesRepository.mjs';
import { body, validationResult } from 'express-validator';
//agregar un nuevo país
export async function addPais(req, res) {
    //console.log('Llegó hasta addPais'); // Confirmación básica en la consola del servidor.
    // Extraer los datos enviados desde el formulario (req.body contiene los datos enviados por POST).
    const { official, capital, area, languages, population, gini, borders, timezones } = req.body;

    // Crear el objeto con el formato esperado para el modelo de la base de datos.
    const nuevoPais = {
        name: { official }, // "name" tiene una subclave "official".
        capital: [capital], // "capital" se guarda como un array, aunque en el formulario es un string.
        area, // Área (número).
        languages: { spa: languages },
        population, // Población (número).
        gini: gini ? { "0": parseFloat(gini) } : {}, // Convierte "gini" a un número flotante o lo deja vacío.
        borders: borders ? borders.split(',').map(b => b.trim()) : [], // Divide por comas y elimina espacios.
        timezones: timezones ? timezones.split(',').map(t => t.trim()) : [], // Similar a "borders".
        creador: "Tomas Barros" // Agrega un valor estático para el creador.
    };
    try {
        // Intentar guardar el nuevo país en la base de datos usando el modelo "Pais".
        await Pais.create(nuevoPais);
        // Redirigir al usuario a la página principal después de agregar el país.
        res.redirect('/dashboard');
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado.
        console.error('Error al agregar el país:', error);
        res.status(500).send('Hubo un problema al agregar el país.');
    }
}

//FUNCION PARA VER TODOS LOS PAISES DE LA API//
export async function cargarPaises(req, res) {
    try {
        const paises = await obtenerPaises(); 
        console.log(paises);
        // Guardar cada país en la base de datos
        for (const pais of paises) {
            // Verificar que el país tenga la propiedad 'subregion'
            if (!pais.subregion) {
                console.warn("El país no tiene subregión:", pais);
                continue; // O manejar esto de otra forma
            }
            const paisConCreador = {
                ...pais,
               // creador: "Jorge Valeri"  Añadiendo la propiedad "creador"
                creador: "Tomas Barros" // Añadiendo la propiedad "creador"
            };
            try {
                await Pais.create(paisConCreador); // Guarda el país en la base de datos
            } catch (dbError) {
                console.error("Error al guardar país:", paisConCreador, dbError);
            }
        }
        //filtrar por nombre de creador
        const paisesFiltrados= await PaisesRepository.obtenerPorCreador("Tomás Barros")
        res.send(paisesFiltrados)
       // res.send(renderizarListaPaises(paisesFiltrados));
    } catch (error) {
        console.error("Error al cargar países:", error);
        res.status(500).send("Error al cargar países");
    }
}

//FILTRO PARA VER LOS PAISES CON IDIOMA ESPAÑOL//
export async function paisesEspanol(req, res) {
    const filtrado = await PaisesRepository.todosEspañol();
    //console.log(filtrado)
    res.render('dashboardPaises', { filtrado });
}



export async function renderPaisEditar(req, res) {
        const {id} = req.params;
        const pais = await PaisesRepository.obtenerPorId(id);
        res.render('editarPais', { pais });
}

export async function editarPaises(req, res) {
       // console.log("llego a editar post")
        const { official, capital, languages, area, population, gini, borders, timezones } = req.body;
        console.log(gini);
        const paisActualizado = {
            name: { official },
            capital: [capital],
            languages: { spa: languages },
            area,
            population,
            gini:  gini ,
            borders: borders ? borders.split(',') : [],
            timezones: timezones ? timezones.split(',') : [],
        };
        console.log(paisActualizado.gini)
        const {id} = req.params;
      await PaisesRepository.actualizar(id, paisActualizado);
       res.redirect('/dashboard');
}

export async function eliminarPais (req, res){
    await PaisesRepository.eliminar(req.params.id);
    res.status(204).send(); // Responde con un estado 204 No Content
}





export async function todosPaises(req, res) {
     const filtrado = await PaisesRepository.obtenerTodos();
       // console.log(filtrado)
        res.render('dashboardPaises', { filtrado });
}






// Middleware de validación
export async function Middleware(req, res, next) {
    // Ejecuta las validaciones
    await Promise.all([
        // Validación para pais (official)
        body('official')
            .trim()
            .notEmpty().withMessage('El nombre del país es requerido')
            .isLength({ min: 3, max: 90 }).withMessage('El nombre del país debe tener entre 3 y 90 caracteres')
            .run(req),

        // Validación para capital
        body('capital')
            .trim()
            .notEmpty().withMessage('El nombre de la capital es requerido')
            .isLength({ min: 3, max: 90 }).withMessage('La capital debe tener entre 3 y 90 caracteres')
            .run(req),

        // Validación para área
        body('area')
            .isFloat({ gt: 0 }).withMessage('El campo "area" debe ser un número positivo.')
            .run(req),

        // Validación para población
        body('population')
            .isInt({ gt: 0 }).withMessage('El campo "población" debe ser un número entero positivo.')
            .run(req),

        // Validación para gini
        body('gini')
            .isFloat({ min: 0, max: 100 }).withMessage('El campo "Índice Gini" debe ser un número entre 0 y 100.')
            .run(req),

        // Validación para borders
        body('borders')
            .custom((value) => {
                // Convierte el string separado por comas en un array, si es necesario
                const bordersArray = Array.isArray(value)
                    ? value
                    : typeof value === 'string'
                    ? value.split(',').map((b) => b.trim())
                    : [];

                // Valida que no esté vacío
                if (bordersArray.length === 0) {
                    throw new Error('El campo "borders" debe ser un array no vacío.');
                }

                // Valida que cada elemento sea una cadena de 3 letras mayúsculas
                for (const border of bordersArray) {
                    if (!/^[A-Z]{3}$/.test(border)) {
                        throw new Error('Cada elemento de borders debe ser una cadena de 3 letras mayúsculas.');
                    }
                }

                return true;
            })
            .run(req),
    ]);

    // Verifica los resultados de las validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Continúa con el siguiente middleware/controlador
    next();
}