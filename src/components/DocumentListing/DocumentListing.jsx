import React, { useEffect, useState } from "react";
import { CKEditor } from 'ckeditor4-react';
import { TextField } from "@mui/material";
import { DocumentContainer, HeaderWrapper } from "./DocumentListing.styles";
import Button from "@mui/material/Button";
import { useMutation } from "@apollo/client";
import { CREATE_DOCUMENT } from "../../query";


export default function DocumentListing() {

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [
        createDocument,
        { data: createDocumentData, error: createDocumentError, isLoading },
    ] = useMutation(CREATE_DOCUMENT);
    console.log({ createDocumentData })
    const changeEvent = (event) => {
        const dataHtlm = event.editor.getData()
        setContent(String(dataHtlm))
    }

    const handleCreateDocument = async () => {
        await createDocument({
            variables: {
                createDocumentInput: {
                    name: title,
                    content,
                }
            }
        })
    }

    return (
        <>
        <HeaderWrapper>
            <h2>Add Document</h2>
            <Button
                className="create-button"
                variant="contained"
                onClick={handleCreateDocument}
            >
                Create Document
            </Button>

        </HeaderWrapper>
        <DocumentContainer>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                name="title"
                autoFocus
                label="Title"
                value={title}
                size="small"
                onChange={(e) => setTitle(e.target.value)}
            />
        <CKEditor
            config={{
                extraPlugins: [
                    'justify',
                    'colordialog',
                    'bidi'
                ]
            }}
            onChange={changeEvent}
        />
            </DocumentContainer>
        </>
    )

} 