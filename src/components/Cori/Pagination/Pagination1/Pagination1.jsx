import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

// Styled Components
const NumbersContainer = styled.ul`
    list-style: none;
    display: flex;
`
const PageNumbers = styled.li`
    padding: 10px;
    border: 1px solid black;
    cursor: pointer;
    &.active {
        background-color: #ff1744;
        color: black
    }
`
const Button = styled.button`
    background-color: transparent;
    border: 1px solid black;
    color: black;
    cursor: pointer;
    &:hover {
        background-color: #ff1744;
    }
    &:focus {
        outline: none;
    }
`
const LoadMoreButton = styled.button`
    padding: 1rem;
    background-color: #ff1744;
    color: black;
    font-size: 1.2em;
    border: 1px solid black;
`

// Cards que voy a renderizar
const renderData = data => {
    return(
        <ul>
            {data.map((todo, index) => {
                return <li>{todo.title}</li>
            })}
        </ul>
    )
}

const Pagination1 = () => {
    
    // Cargo un arreglo de Objetos inicialmente
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => response.json())
        .then((json) => setData(json))
    }, [])

    // Guardo la información en un estado
    const [data, setData] = useState([])

    // Página actual, inicializada en 1
    const [currentPage, setCurrentPage] = useState(1)
    // Cards o Items que voy a mostrar por página
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Número de páginas que quiero mostrar
    const [pageNumberLimit, setPageNumberLimit] = useState(5)
    // Máximo de páginas
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5)
    // Mínimo de páginas
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0)


    // En cada página voy a insertar las cards
    const pages = [];
    for(let i = 1; i <= Math.ceil(data.length/itemsPerPage); i++) {
        pages.push(i)
    }

    // Información de los items que voy a mostrar en cada página
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id))
    }
    const handleNextBtn = () => {
        setCurrentPage(currentPage + 1)
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
        }
    }
    const handlePrevBtn = () => {
        setCurrentPage(currentPage - 1)
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit)
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit)
        }
    }
    const handleMoreBtn = () => {
        setItemsPerPage(itemsPerPage + 5)
    }

    let pageIncrementBtn = null
    if (pages.length > maxPageNumberLimit) {
        pageIncrementBtn = <Button onClick={handleNextBtn}>&hellip;</Button>
    }

    let pageDecrementBtn = null
    if (minPageNumberLimit >= 1) {
        pageDecrementBtn = <Button onClick={handlePrevBtn}>&hellip;</Button>
    }

    // Renderizamos los números de las páginas como (<Li>)
    const renderPageNumbers = pages.map(number => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return(
                <PageNumbers 
                className={currentPage === number ? 'active' : null} key={number} id={number} onClick={handleClick}>
                    {number}
                </PageNumbers>
            ) 
        } else {
            return null;
        }
    })

    return (
        <>
            <h1>Todo List</h1> <br/>

            {renderData(currentItems)}

            <NumbersContainer>

                <Button onClick={handlePrevBtn} disabled={currentPage === pages[0] ? true : false}>Prev</Button>                    
                {pageDecrementBtn}
                {renderPageNumbers}
                {pageIncrementBtn}
                <Button onClick={handleNextBtn} disabled={currentPage === pages[pages.length - 1] ? true : false}>Next</Button>
            
            </NumbersContainer>

            <LoadMoreButton onClick={handleMoreBtn}>Load More</LoadMoreButton>
            
        </>
    )
}

export default Pagination1
