import React from "react";

import { CreateButton, HeaderWrapper, BottomLine } from '../AssessmentCreation/AssessmentCreation.styles';
import DialogBox from "../DialogBox/DialogBox";
import SearchBar from "../SearchBar/SearchBar";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DataTable from '../DataTable/DataTable';
import { useEffect, useState } from "react";
import { read } from 'xlsx';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ASSESSMENT, LOAD_ASSESSMENTS } from '../../query';
import { ModelHeader } from "../MainDrawer/MainDrawer.styles";


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

export default function AssessmentCreation() {

    const [assessmentTitle, setAssessmentTitle] = React.useState("");
    const [assessmentNote, setAssessmentNote] = React.useState("");
    const [assessmentQuestion, setassessmentQuestion] = React.useState([]);
    const [createAssessment, { data: createAssesmentData, error: createAssessmentError, isLoading }] = useMutation(CREATE_ASSESSMENT);
    const [assessments, setAssessments] = React.useState([]);
    const { data: allAssessmentData, loading, error } = useQuery(LOAD_ASSESSMENTS);

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
                const workbook = read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const headers = {};
                const rows = [];

                for (const cell in worksheet) {
                    if (cell[0] === '!') continue;
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
                console.log(rows);

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
                        questionsArray.push({
                            question: obj.questionInstruction,
                            options: optionsArray,
                            marks: 5,
                            answer: [{ identifier: obj.correctAnswer }],
                        });
                    }
                }
                setassessmentQuestion(questionsArray);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function handleAssessmentTitleChange(event) {
        setAssessmentTitle(event.target.value);
    }

    async function handleAssessmentCreate() {
        if (assessmentTitle === "") {
            alert("Assessment Name must not be empty");
            return;
        }
        if (assessmentQuestion.length == 0) {
            alert("Assessment Question must be selected");
            return;
        }
        await createAssessment({
            variables: {
                createAssessmentInput: {
                    name: assessmentTitle,
                    questions: assessmentQuestion,
                    notes: assessmentNote,
                    score: 30,
                    totalQuestions: assessmentQuestion.length
                }
            },
        });
        setOpenDialog(false);
    }

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'id', label: 'ID', minWidth: 100 },
        {
            id: 'score',
            label: 'Score',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'totalquestion',
            label: 'Total Question',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'createat',
            label: 'Created At',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
        {
            id: 'action',
            label: 'Action',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(2),
        },
    ];

    function createData(name, id, score, totalquestion, createat) {

        const date = new Date(createat); // create a new Date object with the date '2023-03-17'
        const monthIndex = date.getMonth(); // get the month index (0-11)
        const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[monthIndex];
        const day = date.getDay();

        const fullDate = `${day}, ${monthName}`;

        const button = <Button variant="outlined" size="small" >Peview</Button>

        return { name, id, score, totalquestion, createat: fullDate, action: button };
    }

    useEffect(() => {
        if (createAssesmentData || createAssessmentError) {
            setAssessmentTitle("");
            setassessmentQuestion([]);
            setAssessmentNote("");
        }
    }, [createAssesmentData, createAssessmentError])

    useEffect(() => {
        const rows = [];
        allAssessmentData?.getAllAssessments.forEach((assessment) => {
            rows.push(createData(assessment.name, assessment._id, assessment.score, assessment.totalQuestions, assessment.createdAt));
        });

        setAssessments(rows);
    }, [allAssessmentData])

    const modalContent = <Box sx={style}>
        <ModelHeader>
            <Typography variant="h6" component="h2" style={{ color: "#163356", fontSize: '22px', fontWeight: '600' }}>
                Assignment
            </Typography>
            <CloseIcon onClick={handleDialogClose} style={{ cursor: 'pointer' }} />
        </ModelHeader>
        <BottomLine />
        <Typography sx={{ mt: 2 }} style={{ color: "#000000", fontWeight: "600", fontSize: '14px' }}>
            Assignment Title
        </Typography>
        <TextField
            margin="normal"
            fullWidth
            id="title"
            label="Enter Title"
            autoFocus
            size="small"
            value={assessmentTitle}
            onChange={handleAssessmentTitleChange}
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ color: "#000000", fontWeight: "600", fontSize: '14px' }}>
            Assignment csv
            <Button
                variant="contained"
                color="grey"
                onClick={() => csvRef.current.click()}
                style={{ marginLeft: "15px", color: "#000000", fontWeight: "600", fontSize: '14px' }}
            >
                upload
                <input
                    ref={csvRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />
            </Button>
        </Typography>

        <Typography sx={{ mt: 2 }} style={{ color: "#000000", fontWeight: "600", fontSize: '14px' }}>
            Extra Document
            <Button
                variant="contained"
                color="grey"
                onClick={() => docRef.current.click()}
                style={{ marginLeft: "15px", color: "#000000", fontWeight: "600", fontSize: '14px' }}
            >
                upload
            </Button>
            <input
                ref={docRef}
                type="file"
                style={{ display: 'none' }}
            />
        </Typography>
        <Button variant="contained"
            color="primary"
            style={{ alignSelf: "end" }}
            onClick={handleAssessmentCreate}
        >
            Submit</Button>
    </Box>;
    return (
        <>
            <HeaderWrapper>
                Assessments List
                <Button className="create-button" variant="contained" onClick={handleDialogOpen} >Create Assessment</Button>
            </HeaderWrapper>
            <DialogBox open={openDialog} onClose={handleDialogClose} content={modalContent} />
            <CreateButton >
                <SearchBar />
            </CreateButton>
            <DataTable rows={assessments} columns={columns} />
        </>
    )
}