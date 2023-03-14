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
