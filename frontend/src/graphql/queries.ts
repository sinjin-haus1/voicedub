import { gql } from '@apollo/client';

export const GET_VOICES = gql`
  query GetVoices {
    voices {
      id
      name
      language
      gender
      previewUrl
    }
  }
`;

export const CREATE_VOICE = gql`
  mutation CreateVoice($input: CreateVoiceInput!) {
    createVoice(input: $input) {
      id
      name
      language
      gender
      previewUrl
    }
  }
`;

export const GET_VOICE = gql`
  query GetVoice($id: ID!) {
    voice(id: $id) {
      id
      name
      language
      gender
      previewUrl
      audioUrl
      text
      createdAt
    }
  }
`;

export const DELETE_VOICE = gql`
  mutation DeleteVoice($id: ID!) {
    deleteVoice(id: $id)
  }
`;
