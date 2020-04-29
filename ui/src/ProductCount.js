import React from "react"
import { gql } from "apollo-boost"
import { Query } from "@apollo/react-components"

const getProductCountQuery = gql`
  {
    getProductCount
  }
`

export default function ProductCount() {
  return (
    <Query query={getProductCountQuery} pollInterval={250}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div>
              <p> Loading Product Count... </p>
            </div>
          )
        }
        if (error) {
          return (
            <div>
              <p> Error has occured while fetching products ... </p>
            </div>
          )
        }
        const { getProductCount = 0 } = data
        return <h3>Showing {getProductCount} available products </h3>
      }}
    </Query>
  )
}
