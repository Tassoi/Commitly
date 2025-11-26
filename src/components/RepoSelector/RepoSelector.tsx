import { useState } from 'react';

const RepoSelector = () => {
  const [repoPath, _setRepoPath] = useState<string>('');

  const handleSelectRepo = async () => {
    // TODO: Implement Tauri file dialog
    console.log('Select repository');
  };

  return (
    <div className="repo-selector">
      <h2>Select Git Repository</h2>
      <button onClick={handleSelectRepo}>Browse...</button>
      {repoPath && <p>Selected: {repoPath}</p>}
    </div>
  );
};

export default RepoSelector;
