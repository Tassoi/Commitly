import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepoStore } from '@/store/repoStore';
import CommitList from '@/components/CommitList';
import { EmptyState } from '@/components/EmptyState';
import { type DateRange } from 'react-day-picker';
import { Commit } from '@/types';


export function Commits() {
  const navigate = useNavigate();
  const { commits, repoInfo, activeRepos } = useRepoStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRepoFilter, setSelectedRepoFilter] = useState<string>('all');

  const filteredCommits = commits.filter((c:Commit) => {
    // Search filter
    if (searchKeyword) {
      if (searchKeyword.startsWith('EXACT:')) {
        const exactAuthor = searchKeyword.substring(6);
        if (c.author !== exactAuthor) return false;
      } else {
        const keyword = searchKeyword.toLowerCase();
        const matchesSearch = (
          c.author.toLowerCase().includes(keyword) ||
          c.email.toLowerCase().includes(keyword) ||
          c.message.toLowerCase().includes(keyword)
        );
        if (!matchesSearch) return false;
      }
    }

    // Repo filter
    const repoId = (c as any).repoId;
    if (selectedRepoFilter !== 'all' && repoId !== selectedRepoFilter) {
      return false;
    }

    // Date range filter
    if (dateRange?.from || dateRange?.to) {
      const commitDate = new Date(c.timestamp * 1000);
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        if (commitDate < fromDate) return false;
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (commitDate > toDate) return false;
      }
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {activeRepos.size === 0 ? (
        <EmptyState
          title="No Repository Selected"
          description="Open a repository to view commit history"
          action={{ label: "Open Repository", onClick: () => navigate('/repos') }}
        />
      ) : (
        <CommitList
          commits={filteredCommits}
          allCommits={commits}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          repoFilter={selectedRepoFilter}
          onRepoFilterChange={setSelectedRepoFilter}
        />
      )}
    </div>
  );
}
