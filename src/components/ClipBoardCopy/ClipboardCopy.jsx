import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";

export default function ClipboardCopy() {

    const [image, setImage] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier
    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        const start = image.indexOf('d/')+2;
        const end = image.indexOf('/',start);
        
        if(start>=0 && end>start){
            
            copyTextToClipboard("https://drive.google.com/uc?id=" + image.substring(start, end), start, end).then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
                .catch((err) => {
                    console.log(err);
                });;
        }
    }

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            {/* <input type="text" value={copyText} readOnly /> */}
            <TextField
                margin="normal"
                required
                id="title"
                name="title"
                label="Image Link"
                value={image}
                size="small"
                onChange={(e) => setImage(e.target.value)}
                style={{marginRight: '10px'}}
            />
            {/* Bind our handler function to the onClick button property */}
            <Button
                className="create-button"
                variant="contained"
                onClick={handleCopyClick}
            >
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </Button>
        </div>
    );
}