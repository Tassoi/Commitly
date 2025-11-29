import { useRepoStore } from '@/store/repoStore';
import { useGitRepo } from '@/hooks/useGitRepo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FolderGit2, FolderOpen, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { RepoInfo, Commit, RepoHistoryItem } from '@/types';

export function TopBar() {
  const { activeRepos, repoHistory, addRepoToHistory, addActiveRepo, removeActiveRepo } = useRepoStore();
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

  const handleSelectFromHistory = async (path: string, name: string) => {
    try {
      const loadingToast = toast.loading(`正在打开：${name}...`);
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

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        {activeRepos.size === 0 ? (
          <span className="text-sm text-muted-foreground">No repository selected</span>
        ) : activeRepos.size === 1 ? (
          <>
            <span className="text-sm text-muted-foreground">Current Repo:</span>
            <span className="font-medium">{Array.from(activeRepos.values())[0].repoInfo.name}</span>
          </>
        ) : (
          <span className="font-medium">{activeRepos.size} repositories active</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderGit2 className="w-4 h-4 mr-2" />
              仓库管理
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <div className="space-y-4">
              <Button onClick={handleOpenRepo} className="w-full" size="sm">
                <FolderOpen className="w-4 h-4 mr-2" />
                打开新仓库
              </Button>

              {activeRepos.size > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">活动仓库 ({activeRepos.size})</h4>
                    <ScrollArea className="max-h-[200px]">
                      <div className="space-y-2">
                        {Array.from(activeRepos.entries()).map(([repoId, { repoInfo, commits }]) => (
                          <div key={repoId} className="flex items-center justify-between p-2 rounded-md border text-sm">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{repoInfo.name}</div>
                              <div className="text-xs text-muted-foreground">{commits.length} commits</div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeActiveRepo(repoId)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}

              {repoHistory.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      最近使用
                    </h4>
                    <ScrollArea className="max-h-[200px]">
                      <div className="space-y-2">
                        {repoHistory.map((repo: RepoHistoryItem) => {
                          const isActive = Array.from(activeRepos.values()).some(
                            (r) => r.repoInfo.path === repo.path
                          );
                          return (
                            <div
                              key={repo.path}
                              className="flex items-center justify-between p-2 rounded-md border hover:bg-accent cursor-pointer text-sm"
                              onClick={() => !isActive && handleSelectFromHistory(repo.path, repo.name)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{repo.name}</div>
                              </div>
                              {isActive && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
      </div>
    </header>
  );
}
