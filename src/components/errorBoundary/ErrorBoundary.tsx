import React, { Component, ReactNode, ErrorInfo } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

interface IErrorBoundaryProps {
  children: ReactNode
}

interface IErrorBoundaryState {
  error: boolean
}

class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {

  state: IErrorBoundaryState = {
    error: false
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: true
    });
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;