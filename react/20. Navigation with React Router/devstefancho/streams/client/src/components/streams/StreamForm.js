import React from "react";
import { Field, reduxForm } from 'redux-form';

class StreamForm extends React.Component {
  renderError = ({ error, touched }) => {
    if (error && touched) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      )
    }
  }

  renderInput = ({ input, label, meta }) => {
    // console.log(meta);
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    )
  }

  onSubmit = (formValues) => {
    this.props.onSubmit(formValues);
  }

  render() {
    // console.log('props', this.props);
    return (
      <form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="title" component={this.renderInput} label="Enter Title" />
        <Field name="description" component={this.renderInput} label="Enter Description" />
        <button className="ui button primary">Submit</button>
      </form>
    )
  }
};

const formValidate = (formValues) => {
  const err = {};

  if (!formValues.title) {
    err.title = "Enter your title!";
  }

  if (!formValues.description) {
    err.description = "You must enter a description";
  }
  
  return err;
}

export default reduxForm({
  form: 'streamForm',
  validate: formValidate
})(StreamForm);