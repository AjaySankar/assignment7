import React, { Component } from "react"
import { graphql } from "react-apollo"
import { gql } from "apollo-boost"
import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const deleteProductMutation = gql`
  mutation removeProduct($id: Int!) {
    removeProduct(id: $id)
  }
`

class ProductRow extends Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.state = {
      product: props.product,
    }
  }

  handleDelete() {
    const { deleteProduct, onDelete } = this.props
    const {
      product: { id },
    } = this.state
    deleteProduct({
      variables: {
        id,
      },
    })
      .then(() => {
        onDelete(id)
      })
      .catch((error) => {
        window.console.error(
          `Error occured while deleting product with id ${id}: ${error || ""}`
        )
      })
  }

  render() {
    const {
      product: { id = "", price = "", name = "", category = "" },
    } = this.state

    return (
      <tr>
        <td> {name} </td>
        <td> ${price} </td>
        <td> {category} </td>
        <td>
          <LinkContainer to={`/product/${id}`}>
            <Button variant="link">View</Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer to={`/edit/product/${id}`}>
            <Button variant="link">Edit</Button>
          </LinkContainer>
        </td>
        <td>
          <Button variant="danger" onClick={this.handleDelete}>
            {" "}
            Delete{" "}
          </Button>
        </td>
      </tr>
    )
  }
}

export default graphql(deleteProductMutation, { name: "deleteProduct" })(
  ProductRow
)
