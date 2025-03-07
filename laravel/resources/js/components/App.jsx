import React, { useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">React Component</div>

                        <div className="card-body">
                            <p>You clicked {count} times</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setCount(count + 1)}
                            >
                                Click me
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
