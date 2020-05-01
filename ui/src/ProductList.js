import React, { Component } from "react"
import { gql } from "apollo-boost"
import { Query } from "@apollo/react-components"
import { Table, Spinner, Toast, Button } from "react-bootstrap"
import ProductForm from "./ProductForm"
import ProductRow from "./ProductRow"
import ProductCounter from "./ProductCount"
import ProductsClient from "./ProductClient"

const getProductsQuery = gql`
  {
    getProducts {
      id
      category
      name
      price
      image
    }
  }
`

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: null,
      showUndoToast: false,
    }
    // Stores the deleted product id. Product id 0 indicates that there is no delete opearation yet (or)
    // the previous delete operation has been committed (cannot be restored).
    this.deletedProductId = 0
    this.showUndoDeleteToast = (deletedProductId) => {
      this.deletedProductId = deletedProductId
      this.setState(({ showUndoToast }) => {
        return { showUndoToast: !showUndoToast }
      })
    }
    this.undoDelete = this.undoDelete.bind(this)
    this.deleteForever = this.deleteForever.bind(this)
  }

  // Undo the last delete operation.
  undoDelete() {
    if (this.deletedProductId > 0) {
      ProductsClient.mutate({
        mutation: gql`
          mutation {
            undoDelete(id: ${parseInt(this.deletedProductId, 10)})
          }
        `
      })
      .then(() => window.console.log(`Restored the item ${this.deletedProductId}`))
      .finally(() => {
        this.deletedProductId = 0
        this.setState(({ showUndoToast }) => {
          return { showUndoToast: !showUndoToast }
        })
      })
    }
  }

  // Commit the last delete operation.
  // This operation is irreversible and triggered when user clicks on 'X' of the toast or after the toast automaically
  // hides after some seconds.
  deleteForever() {
    if (this.deletedProductId > 0) {
      ProductsClient.mutate({
        mutation: gql`
          mutation {
            deleteForever(id: ${parseInt(this.deletedProductId, 10)})
          }
        `
      })
      .then(() => window.console.log(`Deleted forever the item ${this.deletedProductId}`))
      .finally(() => {
        this.deletedProductId = 0
        this.setState(({ showUndoToast }) => {
          return { showUndoToast: !showUndoToast }
        })
      })
    }
  }

  render() {
    return (
      <Query query={getProductsQuery} pollInterval={250}>
        {({ loading, error, data }) => {
          const {
            formData,
            showUndoToast: shouldShowUndoToast = false,
          } = this.state
          if (loading) {
            return (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading Products ...</span>
              </Spinner>
            )
          }
          if (error) {
            return (
              <div>
                <p> Error has occured while fetching products ... </p>
              </div>
            )
          }

          const { getProducts = [] } = data
          return (
            <div>
              <Toast
                show={shouldShowUndoToast}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
                onClose={this.deleteForever}
                delay={3000}
                autohide
              >
                <Toast.Header>
                  <strong className="mr-auto">
                    <h5>Alert</h5>
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  <span> Deleted product !! </span>
                  <Button variant="warning" size="sm" onClick={this.undoDelete}>
                    UNDO
                  </Button>{" "}
                </Toast.Body>
              </Toast>
              <ProductCounter />
              <ProductTable
                products={getProducts}
                onDelete={this.showUndoDeleteToast}
              />
              <h3> Add a new product to inventory </h3>
              <hr />
              <ProductForm
                key={JSON.stringify(formData || {})}
                formInput={formData}
                onSave={this.handleSave}
              />
            </div>
          )
        }}
      </Query>
    )
  }
}

function ProductTable(props) {
  const { products = [], onDelete } = props
  const rows = products.map((productInfo) => {
    return (
      <ProductRow
        key={productInfo.id}
        product={productInfo}
        onDelete={onDelete}
      />
    )
  })
  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th> Product Name </th>
          <th> Price </th>
          <th> Category </th>
          <th> Image </th>
          <th> Edit </th>
          <th> Delete </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export default ProductList
