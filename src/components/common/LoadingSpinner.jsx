// ============================================================
// LoadingSpinner.jsx
// ============================================================
// import LoadingSpinner from './LoadingSpinner';

const LoadingSpinner = ({ message = 'Loading...' }) => (
    <div className="flex flex-col items-center justify-center p-8">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-500 text-sm">{message}</p>
    </div>
);

export default LoadingSpinner;

// ============================================================
// ErrorBoundary.jsx — NOTE: Create this as a SEPARATE file!
// ============================================================
/*
import { Component } from 'react';
 
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
 
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
 
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
 
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
 
export default ErrorBoundary;
*/