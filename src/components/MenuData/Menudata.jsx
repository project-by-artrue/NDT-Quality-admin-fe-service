import React from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function MenuData(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);


    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <IconButton
                aria-label="more"
                onClick={handleClick}
                aria-haspopup="true"
                aria-controls="long-menu"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                onClose={handleClose}
                open={open}
            >
                {props.optionList.map((option) => (
                    <MenuItem
                        key={option.name}
                        onClick={handleClose}
                        selected={option.name === 'Review'}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )

}