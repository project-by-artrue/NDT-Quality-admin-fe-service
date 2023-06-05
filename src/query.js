import { gql } from "@apollo/client";


export const LOAD_QUESTION_BY_ASSESSMENT = gql`
  query getQuestionsbyAssessmentId($assessmentId: String!) {
    getQuestionsbyAssessmentId(assessmentId: $assessmentId) {
      _id
    }
  }
`;

export const LOAD_ASSESSMENTS = gql`
  query getAllAssessments {
    getAllAssessments {
      _id
      name
      score
      totalQuestions
      assessmentFees
      timeLimitInMinute
      isAssessmentFree
      isAssessmentLive
      isDemoAssessment
      notes
      icon
      createdAt
      updatedAt
      metaData
    }
  }
`;

export const LOAD_ASSESSMENTS_ADMIN = gql`
  query getAllAssessmentsForAdmin {
    getAllAssessmentsForAdmin {
      _id
      name
      score
      totalQuestions
      assessmentFees
      timeLimitInMinute
      isAssessmentFree
      isAssessmentLive
      isDemoAssessment
      notes
      icon
      createdAt
      updatedAt
      metaData
    }
  }
`;

export const LOAD_DOCUMENTS = gql`
  query getAllDocuments {
    getAllDocuments {
      _id 
      name
      content
    }
  }
`;


export const CREATE_ASSESSMENT = gql`
  mutation createAssessment($createAssessmentInput: CreateAssessmentInput!) {
    createAssessment(createAssessmentInput: $createAssessmentInput) {
      _id
    }
  }
`;

export const UPDATE_ASSESSMENT = gql`
  mutation updateAssessment($id: String!, $updateAssessmentInput: UpdateAssessmentInput!){
    updateAssessment(id: $id, updateAssessmentInput: $updateAssessmentInput){
      name
    }
  }
`;

export const DELETE_ASSESSMENT = gql`
  mutation deleteAssessment($assessmentId: String!){
    deleteByAssessmentId(assessmentId: $assessmentId){
      name
	}
}
`;

export const CREATE_DOCUMENT = gql`
  mutation createDocument($createDocumentInput: CreateDocumentInput!) {
    createDocument(createDocumentInput: $createDocumentInput) {
      _id
      name
      content
    }
  }
`;


export const GET_ALL_DOCUMENTS = gql`
  query getAllDocuments {
    getAllDocuments {
       _id
      name
      content
    }
  }
`

export const UPDATE_DOCUMENT = gql`
  mutation updateDocument($updateDocumentInput: UpdateDocumentInput!){
    updateDocument(updateDocumentInput: $updateDocumentInput){
      name
    }
  }
`

export const GET_ALL_USERS = gql`
query getAllUser{
	getAllUser{
    _id
    firstName
    email
    lastName
    birthDate
    state
    country
    pinCode
    subscribedAssessment
    completedAssessment{
      assessmentId
      completedAt
      markObtain
      totalMark
    }
  }
}
`;
