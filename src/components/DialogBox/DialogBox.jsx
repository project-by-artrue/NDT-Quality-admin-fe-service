import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    p: 4,
    display: "flex",
    flexDirection: "column",
    borderRadius: "2%",
};

export default function DialogBox(props) {

    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.onClose}
            >
                {props.content}
            </Modal>
        </div>
    );
}