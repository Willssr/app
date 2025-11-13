import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '../constants';

const LimitedModeBanner: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-yellow-900/50 border-b-2 border-yellow-600 text-yellow-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-6 w-6 mr-3 text-yellow-400 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Limited Functionality Mode</p>
                            <p className="text-sm">Cannot connect to the database due to a permissions error. App data cannot be saved or loaded.</p>
                        </div>
                    </div>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold underline hover:text-white ml-4 flex-shrink-0">
                        {isExpanded ? 'Hide Details' : 'Show Fix'}
                    </button>
                </div>
                {isExpanded && (
                    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="text-lg font-bold text-white mb-2">How to Fix Firestore Permissions</h3>
                         <ol className="list-decimal list-inside ml-2 mt-2 space-y-2 text-gray-300">
                            <li>
                                Click the button below to open your Firestore security rules.
                                <a
                                href={`https://console.firebase.google.com/project/ninoviskapp/firestore/rules`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center my-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors max-w-xs"
                                >
                                Open Firestore Rules
                                </a>
                            </li>
                            <li>
                                Replace the entire content of the rules editor with the following code:
                                <pre className="mt-2 p-3 bg-gray-700 rounded-md text-sm text-purple-300 overflow-x-auto">
                                <code>
{`rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow logged-in users to read any user profile
    // Allow users to create/update only their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // NOTE: You'll need to add rules for other collections 
    // (e.g., posts) as you build out your app.
  }
}`}
                                </code>
                                </pre>
                            </li>
                            <li>
                                Click the <strong>"Publish"</strong> button at the top of the editor.
                            </li>
                             <li>
                                After publishing, please <button onClick={() => window.location.reload()} className="text-purple-400 underline hover:text-purple-300">refresh this page</button>.
                            </li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LimitedModeBanner;
