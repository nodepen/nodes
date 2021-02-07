import { gql } from '@apollo/client'

export const COMPUTE_CONFIGURATION = gql`
  query {
    getComputeConfiguration {
      guid
      name
      nickname
      description
      icon
      libraryName
      category
      subcategory
      isObsolete
      isVariable
      inputs {
        name
        nickname
        description
        type
        isOptional
      }
      outputs {
        name
        nickname
        description
        type
        isOptional
      }
    }
  }
`
