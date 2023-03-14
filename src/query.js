import { gql } from "@apollo/client";


export const LOAD_QUESTION = gql`
  query getQuestionsbyAssessmentId($assessmentId: String!) {
    getQuestionsbyAssessmentId(assessmentId: $assessmentId) {
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
