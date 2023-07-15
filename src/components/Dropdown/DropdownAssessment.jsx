import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function DropdownAssessment({ itemsTitle, items, setSelection, selectedItem }) {

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        setSelection(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl sx={{ m: 0, width: 300 }}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedItem}
                    onChange={handleChange}
                    renderValue={(selected) => itemsTitle.join(', ')}
                    MenuProps={MenuProps}
                    multiple
                >
                    {items?.map((item) => (
                        <MenuItem
                            key={item._id}
                            value={item._id}
                        >
                            <Checkbox checked={selectedItem.includes(item._id)} onChange={item._id} />
                            <ListItemText primary={item.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}