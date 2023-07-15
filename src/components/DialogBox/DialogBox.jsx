import * as React from 'react';
import Modal from '@mui/material/Modal';

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