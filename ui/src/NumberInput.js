import React, { Component } from "react"
import { Form } from "react-bootstrap"

function format(num) {
  return num != null ? num.toString() : ""
}
function unformat(str) {
  const val = parseFloat(str, 10)
  return Number.isNaN(val) ? null : val
}
export default class NumInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: format(props.value) }
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { value: prevValue } = prevProps
    const { value: newValue } = this.props
    if (prevValue !== newValue) {
      this.setState({ value: `$${newValue}` })
    }
  }

  onChange({ target: { value = " " } }) {
    // Remove the currency symbol '$'
    const strippedValue = value.substring(1)
    if (strippedValue.match(/^\d*\.?\d*$/)) {
      this.setState({ value: `$${strippedValue}` })
    }
  }

  onBlur(e) {
    const { onChange } = this.props
    const { value } = this.state
    onChange(e, unformat(value.substring(1)))
  }

  render() {
    const { value } = this.state
    const { name } = this.props
    return (
      <Form.Control
        type="text"
        name={name}
        onBlur={this.onBlur}
        onChange={this.onChange}
        value={value}
        placeholder="Enter product price"
      />
    )
  }
}
