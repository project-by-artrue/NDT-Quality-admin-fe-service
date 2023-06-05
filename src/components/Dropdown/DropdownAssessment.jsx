import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_ASSESSMENTS } from "../../query";

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

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function DropdownAssessment({ items, setSelection, selectedItem }) {

    const [assessmentName, setAssessmentName] = React.useState([]);

    const {
        data: allAssessmentData,
        loading,
        error,
    } = useQuery(LOAD_ASSESSMENTS);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value);
        setSelection(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    console.log({ selectedItem, items })
    return (
        <div>
            <FormControl sx={{ m: 0, width: 300 }}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={selectedItem}
                    onChange={handleChange}
                    renderValue={(selected) => selected.join(', ')}
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