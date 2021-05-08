import React, { useState } from 'react';
import InputSB from './InputSB'
import axios from 'axios'

const url = axios.create({
    baseURL: 'https://api.publicapis.org/',
});

// Función encargada de hacer Request
const getApiSuggestions = (word) => {
    let result = url
        .get(`/entries?title=${word}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return result;
};

const AutoCompleteSB = () => {

    // Options será nuestro arreglo de objetos con la lista que va a mostrar nuestro componente hijo en la página
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Esta función primero valida los valores en la búsqueda, en el caso de que no haya nada escrito se limpiarán las opciones para no mostrar sugerencias
    const getSuggestions = async (word) => {
        if (word) {
            setLoading(true);
            let response = await getApiSuggestions(word);
            setOptions(response);
            setLoading(false);
        } else {
            setOptions([]);
        }
    };

    // Nosotros pasaremos esta función hacia nuestro componente hijo, que básicamente abre en otra pestaña alguna url
    const getApiUrl = (url) => {
        window.open(url, '_blank');
    };

    return (
        <>
            <InputSB
                loading={loading}
                options={options}
                requests={getSuggestions}
                onClickFunction={getApiUrl}
                placeholder="🔍 Buscar Handlers ..."
            />
        </>
    );
}

export default AutoCompleteSB
