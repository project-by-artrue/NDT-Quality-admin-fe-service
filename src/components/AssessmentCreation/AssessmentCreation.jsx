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
import { TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DataTable from "../DataTable/DataTable";
import { useEffect, useState } from "react";
import { read } from "xlsx";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ASSESSMENT, LOAD_ASSESSMENTS } from "../../query";
import { ModelHeader } from "../MainDrawer/MainDrawer.styles";
import MenuData from "../MenuData/Menudata";
import { toast } from "react-toastify";

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
  const [assessmentNote, setAssessmentNote] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [live, setLive] = React.useState(false);
  const [subscription, setSubscription] = React.useState(false);
  const [assessmentQuestion, setassessmentQuestion] = React.useState([]);
  const [
    createAssessment,
    { data: createAssesmentData, error: createAssessmentError, isLoading },
  ] = useMutation(CREATE_ASSESSMENT);
  const [assessments, setAssessments] = React.useState([]);
  console.log("🚀 ~ file: AssessmentCreation.jsx:52 ~ AssessmentCreation ~ assessments:", assessments)
  const {
    data: allAssessmentData,
    loading,
    error,
  } = useQuery(LOAD_ASSESSMENTS);

  const [openDialog, setOpenDialog] = React.useState(false);
  const csvRef = React.useRef();
  const docRef = React.useRef();

  const handleDialogOpen = () => {
    setAssessmentTitle("");
    setassessmentQuestion([]);
    setAssessmentNote("");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setAssessmentTitle("");
    setassessmentQuestion([]);
    setAssessmentNote("");
    setOpenDialog(false);
  };

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
              answer: [{ identifier: `${obj.correctAnswer}`.toLowerCase() }],
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

  function handlePriceChange(event) {
    setPrice(event.target.value);
  }
  function handleExtraDocChange(event) {
    setAssessmentNote(event.target.value);
  }

  function handleLiveChange(event) {
    if (event == "false") {
      setLive(true);
    } else {
      setLive(false);
    }
  }
  function handleSubscriptionChange(event) {
    if (event == "false") {
      setSubscription(true);
    } else {
      setSubscription(false);
    }
  }

  async function handleAssessmentCreate() {
    if (assessmentTitle === "") {
      toast.error("Assessment Name must not be empty");
      return;
    }
    if (assessmentQuestion.length === 0) {
      toast.error("Assessment Question must be selected");
      return;
    }
    if (assessmentNote.length === 0) {
      toast.error("Extra document filed must not be empty");
      return;
    }
    await createAssessment({
      variables: {
        createAssessmentInput: {
          name: assessmentTitle,
          questions: assessmentQuestion,
          notes: assessmentNote,
          score: totalScore,
          totalQuestions: assessmentQuestion.length,
          assessmentFees: price,
          isAssessmentFree: subscription
        }
      },
    });
    handleDialogClose()
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
      name: "Review",
    },
    {
      name: "Edit",
    },
  ];

  function createData(name, id, score, totalQuestion, createAt) {
    const more = <MenuData optionList={optionList} />;
    return { name, id, score, totalQuestion, createAt, action: more };
  }

  useEffect(() => {
    if (createAssesmentData || createAssessmentError) {
      setAssessmentTitle("");
      setassessmentQuestion([]);
      setAssessmentNote("");
    }
  }, [createAssesmentData, createAssessmentError]);

  useEffect(() => {
    const rows = [];
    allAssessmentData?.getAllAssessments.forEach((assessment) => {
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
    console.log("8520", rows);
    setAssessments(rows);
  }, [allAssessmentData]);

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
      <Typography
        id="modal-modal-description"
        sx={{ mt: 2 }}
        style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
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
      <div style={{ display: "flex", alignItems: "center" }}>
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
          value={assessmentNote}
          onChange={handleExtraDocChange}
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
          sx={{ width: "50%", ml: "89px" }}
          onChange={handlePriceChange}
        />
      </div>
      <div style={{ display: "flex" }}>
        <Typography
          sx={{ mt: 2 }}
          style={{ color: "#000000", fontWeight: "600", fontSize: "14px" }}
        >
          Live
          <Checkbox value={live} onChange={handleLiveChange} />
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
          <Checkbox value={subscription} onChange={handleSubscriptionChange} />
        </Typography>
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{ alignSelf: "end" }}
        onClick={handleAssessmentCreate}
      >
        Submit
      </Button>
    </Box>
  );
  return (
    <>
      <HeaderWrapper>
        Assessments List
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
        <SearchBar />
      </CreateButton>
      <DataTable rows={assessments} columns={columns} />
    </>
  );
}
