'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils';

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

const mdStyles =
  'max-w-none text-sm leading-6 text-foreground space-y-4 ' +
  // 标题
  '[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:mt-8 [&_h1]:mb-4 ' +
  '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 ' +
  '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 ' +
  // 段落与列表
  '[&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 ' +
  // 链接
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 ' +
  // 行内代码
  '[&_code:not(pre_*)]:bg-muted [&_code:not(pre_*)]:px-1.5 [&_code:not(pre_*)]:py-0.5 [&_code:not(pre_*)]:rounded ' +
  '[&_code:not(pre_*)]:font-mono [&_code:not(pre_*)]:text-[0.9em] ' +
  // 代码块
  '[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:font-mono ' +
  // 引用
  '[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/30 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:rounded ' +
  // 水平线
  '[&_hr]:border-border [&_hr]:my-8 ' +
  // 表格
  '[&_table]:w-full [&_table]:border [&_table]:border-border [&_table]:rounded-md [&_table]:border-collapse ' +
  '[&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold ' +
  '[&_td]:border-t [&_td]:border-border [&_td]:px-3 [&_td]:py-2 ' +
  // 图片
  '[&_img]:rounded-md [&_img]:max-w-full ' +
  // 暗色微调
  'dark:[&_blockquote]:bg-muted/20';

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(mdStyles, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
