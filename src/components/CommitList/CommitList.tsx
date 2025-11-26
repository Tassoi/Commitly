import type { Commit } from '../../types';

interface CommitListProps {
  commits: Commit[];
  onSelectCommit?: (commit: Commit) => void;
}

const CommitList = ({ commits, onSelectCommit }: CommitListProps) => {
  return (
    <div className="commit-list">
      <h2>Commits</h2>
      {commits.length === 0 ? (
        <p>No commits to display</p>
      ) : (
        <ul>
          {commits.map((commit) => (
            <li key={commit.hash} onClick={() => onSelectCommit?.(commit)}>
              <strong>{commit.hash.substring(0, 7)}</strong> - {commit.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommitList;
