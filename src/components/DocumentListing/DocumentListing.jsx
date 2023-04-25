import React, { useEffect, useState } from "react";
import { CKEditor } from 'ckeditor4-react';
import { TextField } from "@mui/material";
import { useCKEditor } from 'ckeditor4-react';
import { DocumentContainer, HeaderWrapper, DocumentSumary } from "./DocumentListing.styles";
import Button from "@mui/material/Button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_DOCUMENT, GET_ALL_DOCUMENTS, UPDATE_DOCUMENT } from "../../query";
import DataTable from "../DataTable/DataTable";
import MenuData from "../MenuData/Menudata";

export default function DocumentListing(props) {
  const [noteId, setNoteId] = useState("")
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [initialContent, setInitialContent] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  const [allAssessmentNotes, setAllAssessmentNotes] = useState([])
  const [
    createDocument,
    { data: createDocumentData, error: createDocumentError, isLoading },
  ] = useMutation(CREATE_DOCUMENT);
  const changeEvent = (event) => {
    const dataHtlm = event.editor.getData()
    setContent(String(dataHtlm))
  }
  const {
    data: assessmentNotesData,
    loading,
    error,
  } = useQuery(GET_ALL_DOCUMENTS);


  useEffect(() => {
    if (assessmentNotesData?.getAllDocuments.length > 0) {

      const rows = [];

      assessmentNotesData?.getAllDocuments.forEach((assessmentNote) => {

        rows.push(
          createData(
            assessmentNote.name,
            assessmentNote._id
          )
        );

      });
      setAllAssessmentNotes(rows)
    }

  }, [assessmentNotesData])

  const [
    updateDocument,
    { data: updateNoteData, error: updateAssessmentNoteError, isLoading: loadUpdateAssessmentNote },
  ] = useMutation(UPDATE_DOCUMENT);

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

  const columns = [
    { id: "name", label: "Assessment Name", minWidth: 170 },
    { id: "id", label: "Assessment Id", minWidth: 170 },
    {
      id: "action",
      label: "Action",
      minWidth: 170,
      align: "right",
      format: (value) => value.toFixed(2),
    },
  ];

  const handleDialogOpen = ({ name }, id, setAnchorEl) => {
    if (name === "Edit") {
      setIsEdit(true)
      setAnchorEl(null)
      const note = assessmentNotesData?.getAllDocuments.find((assessmentNote) => assessmentNote._id === String(id))
      setNoteId(note?._id)
      setTitle(note?.name)
      setInitialContent(note?.content)
    }

  }

  const optionList = [
    {
      name: "Review",
    },
    {
      name: "Edit",
    },
  ];

  function createData(name, id) {

    const more = <MenuData id={id} handleDialogOpen={handleDialogOpen} optionList={optionList} />;
    return { name, id, action: more };
  }
  const handleEditDocument = async () => {
    await updateDocument({
      variables: {
        updateDocumentInput: {
          id: String(noteId) ,
          name: title,
          content: content,
        }
      }
    }).then(({ data }) => {
      console.log("data");
      if (data) {
        setTitle("")
        setContent("")
        setNoteId("")
      }
    })
  }


  return (
    <>
      <HeaderWrapper>
        {!isEdit ? <h2>Add Document</h2> : <h2>Edit Document</h2>}
        {!isEdit ? <Button
          className="create-button"
          variant="contained"
          onClick={handleCreateDocument}
        >
          Create Document
        </Button> : <Button
          className="create-button"
          variant="contained"
          onClick={handleEditDocument}
        >
          Edit Document
        </Button>}

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
          initData={initialContent}
          data={initialContent ? "<p>02020202020</p>" : "jay"}
          config={{
            extraPlugins: [
              'justify',
              'colordialog',
              'bidi'
            ],
          }}
          onChange={changeEvent}
        />

      </DocumentContainer>
      <h4 style={{ margin: "8px 0px 0px 0px" }}>Content Preview</h4>
      <DocumentSumary dangerouslySetInnerHTML={{ __html: content }} />
      <DataTable rows={allAssessmentNotes} columns={columns} />
    </>

  )

} 