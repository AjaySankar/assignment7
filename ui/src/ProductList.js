import React, { Component } from "react"
import { gql } from "apollo-boost"
import { Query } from "@apollo/react-components"
import { Table } from "react-bootstrap"
import ProductForm from "./ProductForm"
import ProductRow from "./ProductRow"
import ProductCounter from "./ProductCount"

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
    }
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave() {
    this.setState((prevState) => ({ ...prevState }))
  }

  render() {
    return (
      <Query query={getProductsQuery} pollInterval={250}>
        {({ loading, error, data }) => {
          const { formData } = this.state
          if (loading) {
            return (
              <div>
                <p> Loading Products... </p>
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

          const { getProducts = [] } = data
          return (
            <div>
              <ProductCounter />
              <ProductTable products={getProducts} onSave={this.handleSave} />
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
  const { products = [], onSave } = props
  const rows = products.map((productInfo) => {
    return (
      <ProductRow key={productInfo.id} product={productInfo} onSave={onSave} />
    )
  })
  return (
    <Table striped bordered hover>
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
