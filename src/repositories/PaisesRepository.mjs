import paises from '../models/paises.mjs';
import IRepository from './IRepository.mjs';

class PaisesRepository extends IRepository{
    
    async obtenerTodos(){
        return await paises.find({});
    }

     async obtenerPorId(id) {
        return await paises.findById(id); // Ajusta esto según tu ORM
    }

     async actualizar(id, paisData) {
       

        if (paisData.gini && typeof paisData.gini === 'string') {
            const año = "2024"; // O el año que desees asociar al valor (puedes hacerlo dinámico si lo deseas)
            paisData.gini = {
                [año]: parseFloat(paisData.gini)  // Convertimos el texto a número y lo guardamos en un objeto con el año como clave
            };
        }
        console.log(paisData)
       return await paises.findByIdAndUpdate(id, paisData, { new: true });
    }

    async eliminar(id){
        return await paises.findByIdAndDelete(id);
    }

    async obtenerPorCreador(nombreCreador) {
        // Filtra los países donde el campo 'creator' coincida con 'nombreCreador'
        // console.log(nombreCreador)
        return await paises.find({ creador: nombreCreador, "languages.spa": "Spanish" });
    }



    async todosEspañol() {
        // Filtra los países donde el campo 'creator' coincida con 'nombreCreador'
        // console.log(nombreCreador)
        return await paises.find({ "languages.spa": "Spanish" });
    }
}

export default new PaisesRepository(); 