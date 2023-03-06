import * as React from 'react';
import { TextField, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';


function SearchBar() {
    return (
        <TextField
            variant="outlined"
            placeholder="Search by Assessment Name"
            style={{
                width: '100%',
                maxWidth: '500px'
            }}
            InputProps={{
                endAdornment: (
                    <IconButton>
                        <Search />
                    </IconButton>
                )
            }}
        />
    );
}

export default SearchBar;

