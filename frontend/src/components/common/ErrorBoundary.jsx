import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="card max-w-md w-full p-8 text-center border border-border">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-error mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-text mb-2">
              Something went wrong
            </h2>
            <p className="text-text-muted text-sm mb-6">
              An unexpected error occurred while rendering this section. You can try refreshing the page.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" size="sm" onClick={this.handleReset}>
                Try again
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={this.handleReload}
              >
                Reload page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

