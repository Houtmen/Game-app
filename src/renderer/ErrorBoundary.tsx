import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error('Uncaught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red', padding: '1em', background: '#fff0f0', border: '1px solid #f00'}}>Something went wrong. Please reload the app.</div>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
