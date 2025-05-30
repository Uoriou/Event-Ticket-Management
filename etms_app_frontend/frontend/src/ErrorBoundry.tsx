import React, { useEffect, useState } from 'react';

class ErrorBoundary extends React.Component {
    
    constructor(props:any) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error:any, info:any) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
    }

    
}
function logErrorToMyService(error: any, info: any) {
    // Example implementation: Log the error to the console
    console.error('Logged Error:', error);
    console.error('Error Info:', info);

    // Optionally, send the error to a remote logging service
    fetch('https://example.com/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            error: error.toString(),
            info,
            timestamp: new Date().toISOString(),
        }),
    }).catch((err) => console.error('Failed to log error to service:', err));
}
