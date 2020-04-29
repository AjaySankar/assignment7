import React, { Component } from "react"
import { Form } from "react-bootstrap"

export default class TextInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.value }
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { value: prevValue } = prevProps
    const { value: newValue } = this.props
    if (prevValue !== newValue) {
      this.setState({ value: newValue })
    }
  }

  onChange({ target: { value = "" } }) {
    this.setState({ value })
  }

  onBlur(e) {
    const { onChange } = this.props
    const { value } = this.state
    onChange(e, value)
  }

  render() {
    const { value } = this.state
    const { name, placeholder } = this.props
    return (
      <Form.Control
        type="text"
        name={name}
        onBlur={this.onBlur}
        onChange={this.onChange}
        value={value}
        placeholder={placeholder}
      />
    )
  }
}
