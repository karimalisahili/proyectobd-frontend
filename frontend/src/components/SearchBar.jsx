
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes añadir la lógica para manejar la búsqueda, como filtrar datos o llamar a una API
        console.log(`Buscando: ${searchTerm}`);
    };

    return (
        <Box sx={{ display: 'flex', width:'100%'}} >
            <form onSubmit={handleSubmit} className='search_bar_container'
            style={{ display: 'flex', alignItems: 'center', marginLeft:'250px'}}>
                <TextField
                    id="search"
                    label="Buscar"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='search_bar'
                    sx={{
                        borderRadius: '10px',
                        display: 'flex',
                        mt:2,
                    }}
                />
                <Button type="submit" variant="contained" sx={{ ml: 2, mt: 2, bgcolor: 'transparent' }}>Buscar</Button>
            </form>
        </Box>
    );
}

export default SearchBar;