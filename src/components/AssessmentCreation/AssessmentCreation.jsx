import React from "react";

import {
  CreateButton,
  HeaderWrapper,
  BottomLine,
} from "../AssessmentCreation/AssessmentCreation.styles";
import DialogBox from "../DialogBox/DialogBox";
import SearchBar from "../SearchBar/SearchBar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DataTable from "../DataTable/DataTable";
import { useEffect, useState } from "react";
import { read } from "xlsx";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ASSESSMENT, UPDATE_ASSESSMENT, LOAD_ASSESSMENTS_ADMIN, LOAD_DOCUMENTS, DELETE_ASSESSMENT } from "../../query";
import { ModelHeader } from "../MainDrawer/MainDrawer.styles";
import MenuData from "../MenuData/Menudata";
import { toast } from "react-toastify";
import Dropdown from "../Dropdown/Dropdown";
import { Search } from '@mui/icons-material';
import Loader from "../Loader/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  p: 4,
  display: "flex",
  flexDirection: "column",
  borderRadius: "2%",
};

export default function AssessmentCreation() {
  const [totalScore, setTotalScore] = React.useState();
  const [assessmentTitle, setAssessmentTitle] = React.useState("");
  const [assessmentImage, setAssessmentImage] = React.useState("");
  const [time, setTime] = React.useState('')
  const [price, setPrice] = React.useState('');
  var numbers = /^[0-9]+$/;
  // const [promoCode, setPromoCode] = React.useState("");
  const [live, setLive] = React.useState(false);
  const [assessmentId, setAssessmentId] = useState('');
  const [subscription, setSubscription] = React.useState(false);
  const [demoAssessment, setDemoAssessment] = React.useState(false);
  const [assessmentQuestion, setassessmentQuestion] = React.useState([]);
  const [updateButton, setUpdateButton] = React.useState(false);
  const [editButton, setEditButton] = React.useState(false);
  const [
    createAssessment,
    { data: createAssesmentData, error: createAssessmentError, isLoading },
  ] = useMutation(CREATE_ASSESSMENT);
  const [
    updateAssessment,
    { data: updateAssessmentData, error: updateAssessmentError, updateloading },
  ] = useMutation(UPDATE_ASSESSMENT);
  const [
    deleteByAssessmentId,
    { data: deleteAssessmentData, error: deleteAssessmentError, deleteloading },
  ] = useMutation(DELETE_ASSESSMENT);
  const [assessments, setAssessments] = React.useState([]);
  const [documentId, setDocumentId] = React.useState('');
  const [name, setName] = useState('');


  const {
    data: allAssessmentData,
    loading,
    error,
    refetch
  } = useQuery(LOAD_ASSESSMENTS_ADMIN);

  const {
    data: allDocumentsData,
    loading: assessmentLoading,
  } = useQuery(LOAD_DOCUMENTS);

  const [openDialog, setOpenDialog] = React.useState(false);
  const csvRef = React.useRef();
  const docRef = React.useRef();

  const handleDialogOpen = () => {
    setOpenDialog(true);
    setUpdateButton(false);
    setEditButton(false);
    setDocumentId("");
    setAssessmentImage("");
    setDemoAssessment(false);
  };

  const handleDialogOpenAction = ({ name }, id, setAnchorEl) => {
    if (name === "Edit") {
      setEditButton(true);
      setAnchorEl(null);
      setOpenDialog(true);
      setUpdateButton(true);
      const newValue = allAssessmentData?.getAllAssessmentsForAdmin.find(
        (assessment) => assessment._id === String(id)
      );
      setAssessmentId(newValue._id);
      setAssessmentTitle(newValue.name);
      setPrice(newValue.assessmentFees);
      setSubscription(newValue.isAssessmentFree);
      setTime(newValue.timeLimitInMinute);
      setDocumentId(newValue.notes);
      setAssessmentImage(newValue.icon);
      setLive(newValue.isAssessmentLive);
      setDemoAssessment(newValue.isDemoAssessment);
      console.log(newValue)
    } else if (name === "Delete") {
      setAnchorEl(null);
      setOpenDialog(false);
      // TODO Review
      const newValue = allAssessmentData?.getAllAssessments.find(
        (assessment) => assessment._id === String(id)
      );
      setAssessmentId(newValue._id);
      handleAssessmentDelete();

    }
  }

  const handleDialogClose = () => {
    setAssessmentTitle("");
    setassessmentQuestion([]);
    setPrice("");
    setTime("");
    setSubscription(false);
    setLive(false);
    setAssessmentImage("");
    setDemoAssessment(false);
    setOpenDialog(false);
  };

  const handleTime = (e) => {
    if (e.target.value.match(numbers) || e.target.value === "") {
      setTime(e.target.value)
    }
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const data = event.target.result;
        const workbook = read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers = {};
        const rows = [];

        for (const cell in worksheet) {
          if (cell[0] === "!") continue;
          const col = cell.substring(0, 1);
          const row = parseInt(cell.substring(1));
          const value = worksheet[cell].v;

          if (row === 1) {
            headers[col] = value;
            continue;
          }

          if (!rows[row]) rows[row] = {};
          rows[row][headers[col]] = value;
        }

        resolve(rows);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsBinaryString(file);
    });
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    readFile(file)
      .then((rows) => {
        var totalScore = 0;
        const questionsArray = [];
        for (let i = 0; i < rows?.length; i++) {
          let optionsArray = [];
          const obj = rows[i];
          if (obj !== null && obj !== undefined && obj !== '' && obj !== {}) {
            for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (key.startsWith('option')) {
                  optionsArray.push({ value: obj[key], identifier: key });
                }
              }
            }
            totalScore += Number(obj.mark);
            questionsArray.push({
              question: obj.questionInstruction,
              options: optionsArray,
              marks: obj.mark,
              answer: [{ identifier: `${obj.answer}`.toLowerCase() }],
              category: obj.category,
              subCategory: obj.subCategory,
            });
          }
        }
        setassessmentQuestion(questionsArray);
        setTotalScore(totalScore);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleAssessmentTitleChange(event) {
    setAssessmentTitle(event.target.value);
  }

  function handleAssessmentImageChange(event) {
    setAssessmentImage(event.target.value);
  }

  function handlePriceChange(e) {
    if (e.target.value.match(numbers) || e.target.value === "") {
      setPrice(e.target.value);
    }
  }

  // function handlePromocodeChange(event) {
  //   setPromoCode(event.target.value);
  // }

  function handleExtraDocChange(event) {
    (event.target.value);
  }

  function handleLiveChange(event) {
    if (event.target.checked) {
      setLive(true);
    } else {
      setLive(false);
    }
  }

  function handleSubscriptionChange(event) {
    if (event.target.checked) {
      setSubscription(true);
    } else {
      setSubscription(false);
    }
  }

  function handleDemoAssessmentChange(event) {
    if (event.target.checked) {
      setDemoAssessment(true);
    } else {
      setDemoAssessment(false);
    }
  }

  // async function handleAssessmentDelete() {

  //   await deleteByAssessmentId(
  //     {
  //       variables: {
  //         assessmentId: String(assessmentId),
  //       }
  //     }).then((data) => {
  //       handleDialogClose()
  //       if (data) {
  //         toast.success("Assessment Deleted successfully.")
  //       }
  //     })
  // }

  async function handleAssessmentUpdate() {

    await updateAssessment(
      {
        variables: {
          id: String(assessmentId),
          updateAssessmentInput: {
            name: assessmentTitle,
            notes: documentId,
            assessmentFees: Number(price),
            isAssessmentFree: subscription,
            timeLimitInMinute: Number(time),
            icon: assessmentImage,
            isAssessmentLive: live,
            isDemoAssessment: demoAssessment,
          }
        }
      }).then((data) => {
        handleDialogClose()
        if (data) {
          toast.success("Assessment updated successfully.")
          setAssessmentId("")
          setssessmentTitle("")
          setTime("")
          setDocumentId("")
          setLive(false)
          setSubscription(false)
          setAssessmentImage("")
          setDemoAssessment(false)
        }
      })
  }

  async function handleAssessmentCreate() {
    setUpdateButton(false);
    if (assessmentTitle === "") {
      toast.error("Assessment Name must not be empty");
      return;
    }
    if (assessmentQuestion.length === 0) {
      toast.error("Assessment Question must be selected");
      return;
    }
    if (time.length === 0) {
      toast.error("Time filed must not be empty");
      return;
    }

    await createAssessment({
      variables: {
        createAssessmentInput: {
          name: assessmentTitle,
          questions: assessmentQuestion,
          notes: documentId,
          score: totalScore,
          totalQuestions: assessmentQuestion.length,
          assessmentFees: Number(price),
          isAssessmentFree: subscription,
          timeLimitInMinute: Number(time),
          icon: assessmentImage,
          isAssessmentLive: live,
          isDemoAssessment: demoAssessment,
        }
      },
    }).then((data) => {
      handleDialogClose()
      if (data) {
        <Loader />
        toast.success("Assessment successfully created!")
      }
    })
  }

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "id", label: "ID", minWidth: 100 },
    {
      id: "score",
      label: "Score",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "totalQuestion",
      label: "Total Question",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "createAt",
      label: "Created At",
      minWidth: 170,
      align: "right",
      format: (value) => value.toFixed(2),
    },
    {
      id: "action",
      label: "Action",
      minWidth: 170,
      align: "right",
      format: (value) => value.toFixed(2),
    },
  ];

  const optionList = [
    {
      name: "Edit",
    },
  ];

  function createData(name, id, score, totalQuestion, createAt) {
    const more = <MenuData id={id} handleDialogOpen={handleDialogOpenAction} optionList={optionList} />;
    return { name, id, score, totalQuestion, createAt, action: more };
  }

  useEffect(() => {
    if (createAssesmentData || createAssessmentError || updateAssessmentData || updateAssessmentError) {
      setAssessmentTitle("");
      setassessmentQuestion([]);
      refetch();
    }
  }, [createAssesmentData, createAssessmentError, updateAssessmentData, updateAssessmentError]);

  useEffect(() => {
    const rows = [];
    allAssessmentData?.getAllAssessmentsForAdmin.forEach((assessment) => {
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };

      const date = new Date(assessment.createdAt)
      const formattedDate = date.toLocaleString('en-US', options);

      rows.push(
        createData(
          assessment.name,
          assessment._id,
          assessment.score,
          assessment.totalQuestions,
          formattedDate
        )
      );
    });
    setAssessments(rows);
  }, [allAssessmentData]);

  const changeEvent = (event) => {
    console.log(event.editor.getData())
  }

  let fillterAssessmentData = assessments?.filter(assessment => {
    // if search is empty and if "all" or nothing is selected return the entire array
    if (name === "") {
      return assessment
      // if the filter is not selected, return whats included with the search term 
    } else if (assessment.name.toLowerCase().includes(name.toLowerCase())) {
      return assessment
    }
  })

  const modalContent = (
    <Box sx={style}>
      <ModelHeader>
        <Typography
          variant="h6"
          component="h2"
          style={{ color: "#163356", fontSize: "22px", fontWeight: "600" }}
        >
          Assignment
        </Typography>
        <CloseIcon onClick={handleDialogClose} style={{ cursor: "pointer" }} />
      </ModelHeader>
      <BottomLine />
      <Typography
        sx={{ mt: 2 }}
        style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
      >
        Assignment Title
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        id="title"
        autoFocus
        size="small"
        value={assessmentTitle}
        onChange={handleAssessmentTitleChange}
      />
      {editButton ? (<></>) : (
        <Typography
          id="modal-modal-description"
          sx={{ m: 2 }}
          style={{ marginLeft: 0, color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Assignment csv
          <Button
            variant="contained"
            color="grey"
            onClick={() => csvRef.current.click()}
            style={{
              marginLeft: "15px",
              color: "#000000",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            upload
            <input
              ref={csvRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </Button>
        </Typography>
      )}
      {/* <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Extra Document
        </Typography>
        <TextField
          sx={{ width: "50%", ml: "15px" }}
          margin="normal"
          id="extra_doc"
          size="small"
          value={}
          onChange={handleExtraDocChange}
        />
      </div> */}
      <Dropdown
        items={allDocumentsData?.getAllDocuments}
        setSelection={setDocumentId}
        selectedItem={documentId}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Time
        </Typography>
        <TextField
          margin="normal"
          id="time"
          size="small"
          value={time}
          sx={{ width: "50%", ml: "40px" }}
          onChange={handleTime}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Price
        </Typography>
        <TextField
          margin="normal"
          id="price"
          size="small"
          value={price}
          sx={{ width: "50%", ml: "40px" }}
          onChange={handlePriceChange}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Assessment Image
        </Typography>
        <TextField
          margin="normal"
          id="price"
          size="small"
          value={assessmentImage}
          sx={{ width: "50%", ml: "40px" }}
          onChange={handleAssessmentImageChange}
        />
      </div>
      {/* <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
        Promocode
        </Typography>
        <TextField
          margin="normal"
          id="promocode"
          size="small"
          value={promoCode}
          sx={{ width: "50%", ml: "45px" }}
          onChange={handlePromocodeChange}
        />
      </div> */}
      <div style={{ display: "flex" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Live
          <Checkbox checked={live} onChange={handleLiveChange} />
        </Typography>

        <Typography
          sx={{ mt: 2 }}
          style={{
            color: "#000000",
            fontWeight: "600",
            fontSize: "14px",
            marginLeft: "40px",
          }}
        >
          Subscription
          <Checkbox checked={subscription} onChange={handleSubscriptionChange} />
        </Typography>

        <Typography
          sx={{ mt: 2 }}
          style={{
            color: "#000000",
            fontWeight: "600",
            fontSize: "14px",
            marginLeft: "40px",
          }}
        >
          DemoAssessment
          <Checkbox checked={demoAssessment} onChange={handleDemoAssessmentChange} />
        </Typography>
      </div>

      {updateButton ? (<Button
        variant="contained"
        color="primary"
        style={{ alignSelf: "end" }}
        onClick={handleAssessmentUpdate}
      >
        Update
      </Button>) :
        (<Button
          variant="contained"
          color="primary"
          style={{ alignSelf: "end" }}
          onClick={handleAssessmentCreate}
        >
          Submit
        </Button>)}
    </Box>
  );

  return (
    <>
      {assessmentLoading ? (<Loader assessmentLoading={assessmentLoading} />) : (
        <>
          <HeaderWrapper>
            <h4>Assessments List</h4>
            <Button
              className="create-button"
              variant="contained"
              onClick={handleDialogOpen}
            >
              Create Assessment
            </Button>
          </HeaderWrapper>
          <DialogBox
            open={openDialog}
            onClose={handleDialogClose}
            content={modalContent}
          />
          <CreateButton>
            <TextField
              variant="outlined"
              placeholder="Search by Assessment Name"
              style={{
                width: '100%',
                maxWidth: '500px'
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <Search />
                  </IconButton>
                )
              }}
            />
          </CreateButton>
          {<DataTable rows={fillterAssessmentData} columns={columns} />}
        </>)}
    </>
  );
}
