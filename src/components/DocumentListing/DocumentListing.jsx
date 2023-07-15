import React, { useEffect, useState } from "react";
import { CKEditor } from 'ckeditor4-react';
import { TextField } from "@mui/material";
import { DocumentContainer, HeaderWrapper, DocumentSumary } from "./DocumentListing.styles";
import Button from "@mui/material/Button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_DOCUMENT, GET_ALL_DOCUMENTS, UPDATE_DOCUMENT } from "../../query";
import DataTable from "../DataTable/DataTable";
import ClipboardCopy from "../ClipBoardCopy/ClipboardCopy";
import MenuData from "../MenuData/Menudata";
import { toast } from "react-toastify";

export default function DocumentListing(props) {
  const [noteId, setNoteId] = useState("")
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [allAssessmentNotes, setAllAssessmentNotes] = useState([]);
  const [rerenderkey, setRerenderKey] = useState(Math.random().toString());
  const [
    createDocument,
    { data: createDocumentData, error: createDocumentError, isLoading },
  ] = useMutation(CREATE_DOCUMENT);

  const {
    data: assessmentNotesData,
    loading,
    error,
    refetch
  } = useQuery(GET_ALL_DOCUMENTS);

  const [
    updateDocument,
    { data: updateNoteData, error: updateAssessmentNoteError, isLoading: loadUpdateAssessmentNote },
  ] = useMutation(UPDATE_DOCUMENT);

  const changeEvent = (event) => {
    const dataHtml = event.editor.getData()
    setContent(String(dataHtml))
  }

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

  useEffect(() => {
    if (createDocumentData || createDocumentError || updateNoteData || updateAssessmentNoteError) {
      refetch();
    }
  }, [createDocumentData, createDocumentError, updateNoteData, updateAssessmentNoteError, refetch]);

  const handleCreateDocument = async () => {

    if (!title && !content) {
      toast.error("Please enter Assessment name.");
    }

    if (!content) {
      toast.error("Please enter the content.");
    }

    await createDocument({
      variables: {
        createDocumentInput: {
          name: title,
          content,
        }
      }
    }).then((data) => {
      if (data) {
        toast.success("Document successfully created!")
      }
      setTitle('');
      setContent('');
    })
  }

  const handleEditDocument = async () => {
    await updateDocument({
      variables: {
        updateDocumentInput: {
          id: String(noteId),
          name: title,
          content: content,
        }
      }
    }).then(({ data }) => {

      if (data) {
        toast.success("Document updated successfully!")
        setTitle("")
        setContent("")
        setNoteId("")
        setRerenderKey(Math.random().toString())
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
      setContent(note?.content)
      setRerenderKey(Math.random().toString());
    }


  }

  const optionList = [
    {
      name: "Edit",
    },
    {
      name: "Delete",
    },
  ];

  function createData(name, id) {

    const more = <MenuData id={id} handleDialogOpen={handleDialogOpen} optionList={optionList} />;
    return { name, id, action: more };
  }

  return (
    <>
      <HeaderWrapper>
        {!isEdit ? <h4>Add Document</h4> : <h4>Edit Document</h4>}
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
        <ClipboardCopy />
        <CKEditor
          key={rerenderkey}
          initData={content}
          data={content}
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