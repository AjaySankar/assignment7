import React from "react"
import { Query } from "react-apollo"
import { gql } from "apollo-boost"

const getProductInfo = gql`
  query getProductInfo($id: Int) {
    getProductInfo(id: $id) {
      id
      category
      name
      price
      image
    }
  }
`
function ProductView({ match }) {
  const productId = parseInt(match.params.id, 10)
  return (
    <Query query={getProductInfo} variables={{ id: productId }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div>
              <p> Loading Product ... </p>
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
        const {
          getProductInfo: { image: imageURL, name },
        } = data
        return (
          <img src={imageURL} alt={name} style={{ height: 500, width: 500 }} />
        )
      }}
    </Query>
  )
}

export default ProductView
