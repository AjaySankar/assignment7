import React, { Component } from "react"
import { graphql } from "react-apollo"
import { gql } from "apollo-boost"
import { Link } from "react-router-dom"
import { Button, Form, Col } from "react-bootstrap"
import TextInput from "./TextInput"
import NumInput from "./NumberInput"
import ProductsClient from "./ProductClient"

const RESET_VALUES = { name: "", price: "$", category: "Shirts", image: "" }

const updateProductMutation = gql`
  mutation updateProduct(
    $id: Int!
    $category: Category!
    $name: String!
    $price: Float!
    $image: String!
  ) {
    updateProduct(
      product: {
        id: $id
        category: $category
        name: $name
        price: $price
        image: $image
      }
    ) {
      id
      category
      name
      price
      image
    }
  }
`

class UpdateForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.getProductInfo = this.getProductInfo.bind(this)
    const {
      match: {
        params: { id },
      },
    } = this.props
    this.state = {
      product: { ...RESET_VALUES, ...{}, ...{ id: parseInt(id, 10) } },
    }
  }

  componentDidMount() {
    this.getProductInfo()
  }

  getProductInfo() {
    const {
      match: {
        params: { id },
      },
    } = this.props
    ProductsClient.query({
      query: gql`
        query {
          getProductInfo(
            id: ${parseInt(id, 10)}
          ) {
            id
            category
            name
            price
            image
          }
        }
      `,
    })
      .then(({ data = {} }) =>
        this.setState({
          product: data.getProductInfo,
        })
      )
      .catch((error) => window.console.log(error))
  }

  handleChange({ target }, naturalValue) {
    const { name, value: textValue } = target
    const value = naturalValue === undefined ? textValue : naturalValue
    this.setState(({ product: prevProduct }) => {
      return { product: { ...prevProduct, ...{ [name]: value } } }
    })
  }

  handleSave(e) {
    const { product } = this.state
    const { id, category, name, image, price } = product
    const { updateProduct } = this.props
    updateProduct({
      variables: {
        id,
        category,
        name,
        price,
        image,
      },
    })
      // eslint-disable-next-line no-unused-vars
      .then(({ data = {} }) => {
        // reset the form values to blank after submitting
        this.setState({
          product: { ...RESET_VALUES },
        })
      })
      .catch((error) => {
        window.console.error(
          `Error occured while update product: ${error || ""}`
        )
      })
      .finally(() => e.preventDefault()) // prevent the form submit event from triggering an HTTP Post
  }

  render() {
    const {
      product: { category, price, name, image },
    } = this.state
    return (
      <Form onSubmit={this.handleSave}>
        <Form.Row>
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={category}
              onChange={this.handleChange}
            >
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <NumInput name="price" onChange={this.handleChange} value={price} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <TextInput
              name="name"
              onChange={this.handleChange}
              value={name}
              placeholder="Enter product name"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="image">
            <Form.Label>Image URL</Form.Label>
            <TextInput
              name="image"
              onChange={this.handleChange}
              value={image}
              placeholder="Enter image URL"
            />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Button variant="primary" type="submit">
              Update Product
            </Button>
          </Form.Group>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              type="submit"
              onClick={this.getProductInfo}
            >
              Reset Product
            </Button>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Link to="/"> Go to Home </Link>
          </Form.Group>
        </Form.Row>
      </Form>
    )
  }
}

export default graphql(updateProductMutation, { name: "updateProduct" })(
  UpdateForm
)
