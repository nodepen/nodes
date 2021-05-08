import { gql } from '@apollo/client'

export const QUEUE_STATUS = gql`
  query($depth: Int!) {
    getQueueStatus(depth: $depth) {
      jobs
      active_count
      total_count
      session_count
      latest_created
    }
  }
`
