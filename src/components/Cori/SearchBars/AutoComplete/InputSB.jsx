import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

import styled from 'styled-components';

// Styled Components
const Input = styled.input`
    font-weight: 600;
    width: 20em;
    height: 2.5em;
    font-size: 1em;
    padding-left: 1em;
    background: white;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-color: black;
    text-transform: capitalize;
`;

const Ul = styled.ul`
    display: contents;
`;

const Li = styled.ul`
    /* width: 22em; */
    font-weight: 400;
    height: 1.2em;
    padding: 1em;
    background: white;
    display: block;
    border-bottom: 1px solid white;
    transition: 0.3s;
    &:hover {
        cursor: pointer;
        background-color: #faa646;
        transform: scale(1.05);
    }
`;

const SuggestContainer = styled.div`
    height: 240px;
    width: 21.35em;
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

const InputSB = ({ loading, options, requests, onClickFunction, placeholder }) => {
    // loading: Le llega desde su componente Padre (AutoCompleteSB), ésto permite que muestre un mensaje de Cargando mientras se hace el request en la Search Bar
    // options: Es nuestro arreglo de objetos que queremos mostrar como sugerencias
    // requests: Esta es la petición en la que realizaremos la búsqueda. Su padre tiene la función pero este componente hijo la ejecuta
    
    const [inputValue, setInputValue] = useState('');

    // Problema: Cada vez que ingresamos un nuevo valor en nuestro input de búsqueda, envía una petición nueva al Backend
    // Entonces, para resolver ésto se crea una función debouncing que solo se invoca tras esperar cierta cantidad de tiempo en milisegundos
    const debouncedSave = useCallback(
        debounce((newValue) => requests(newValue), 750),
        []
    );

    // updateValue: Esta función es la encargada de setear el nuevo valor del Input y enviar esos valores como peticiones al Backend
    const updateValue = (newValue) => {
        setInputValue(newValue);
        debouncedSave(newValue);
    };

    return (
        <div>
            <Input
                value={inputValue}
                onChange={(input) => updateValue(input.target.value)}
                placeholder={placeholder}
            />
            <SuggestContainer>
                <Ul>
                    {/* Loading = True: */}
                    {loading && <Li>Cargando...</Li>}
                    {/* Loading = False: */}
                    {options?.entries?.length > 0 &&
                        !loading &&
                        options?.entries?.map((value, index) => (
                            <Li
                                key={`${value.API}-${index}`}
                                onClick={() => onClickFunction(value.Link)}
                            >
                                {value.API}
                            </Li>
                        ))}
                </Ul>
            </SuggestContainer>
        </div>
    )
}

export default InputSB