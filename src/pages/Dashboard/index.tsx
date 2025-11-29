import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useRepoStore } from '@/store/repoStore';
import { useGitRepo } from '@/hooks/useGitRepo';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { AuthorRadialChart, CommitTrendChart, CommitTypeChart } from './Charts';
import { FolderOpen, FileText, GitCommit, Users, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const { repoInfo, commits, activeRepos, addRepoToHistory, addActiveRepo } = useRepoStore();
  const { selectRepository, openRepository, getCommits } = useGitRepo();

  const handleOpenRepo = async () => {
    try {
      const path = await selectRepository();
      if (!path) return;

      const loadingToast = toast.loading('正在打开仓库...');
      const info = await openRepository(path);
      const repoId = addRepoToHistory(info);

      const now = Date.now();
      const from = Math.floor((now - 30 * 24 * 60 * 60 * 1000) / 1000);
      const to = Math.floor(now / 1000);
      const fetchedCommits = await getCommits(path, from, to);

      addActiveRepo(repoId, info, fetchedCommits);
      toast.dismiss(loadingToast);
      toast.success(`已添加 ${info.name}，加载了 ${fetchedCommits.length} 个提交`);
    } catch (error) {
      toast.error(`打开仓库失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const uniqueAuthors = useMemo(() => new Set(commits.map((c:any) => c.author)).size, [commits]);

  const last7Days = useMemo(
    () =>
      commits.filter((c:any) => {
        const commitDate = new Date(c.timestamp * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return commitDate >= sevenDaysAgo;
      }).length,
    [commits]
  );

  const hasData = repoInfo && commits.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview and quick actions</p>
        </div>
        {repoInfo && (
          <div className="flex gap-2">
            <Button onClick={() => navigate('/commits')}>
              <GitCommit className="w-4 h-4 mr-2" />
              View Commits
            </Button>
            <Button variant="outline" onClick={() => navigate('/reports/new')}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        )}
      </div>

      {activeRepos.size === 0 ? (
        <EmptyState
          title="No Repository Selected"
          description="Open a repository to get started"
          action={{ label: "Open Repository", onClick: handleOpenRepo }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-sm">
              <CardHeader>
                <CardDescription>Total Commits</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">{commits.length}</CardTitle>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline">
                    <GitCommit className="w-3 h-3 mr-1" />
                    All Time
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  Repository activity <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-muted-foreground">Total commit history</div>
              </CardFooter>
            </Card>

            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-sm">
              <CardHeader>
                <CardDescription>Contributors</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">{uniqueAuthors}</CardTitle>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  Team collaboration <Users className="w-4 h-4" />
                </div>
                <div className="text-muted-foreground">Unique contributors</div>
              </CardFooter>
            </Card>

            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-sm">
              <CardHeader>
                <CardDescription>Recent Activity</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">{last7Days}</CardTitle>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    7 Days
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  Last week commits <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-muted-foreground">Recent development pace</div>
              </CardFooter>
            </Card>

            <Card className="relative bg-gradient-to-t from-primary/5 to-card shadow-sm">
              <CardHeader>
                <CardDescription>Repository</CardDescription>
                <CardTitle className="text-xl font-semibold truncate">{repoInfo?.name}</CardTitle>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    激活
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="flex gap-2 font-medium">
                  Current workspace <FolderOpen className="w-4 h-4" />
                </div>
                <div className="text-muted-foreground truncate w-full">{repoInfo?.path}</div>
              </CardFooter>
            </Card>
          </div>

          {hasData && (
            <div className="space-y-4">
              <CommitTrendChart commits={commits} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <AuthorRadialChart commits={commits} />
                <CommitTypeChart commits={commits} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
