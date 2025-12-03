import crypto from 'node:crypto';
import fs from 'node:fs/promises';

interface FeishuPayload {
  msg_type: 'post';
  content: {
    post: {
      zh_cn: {
        title: string;
        content: Array<Array<{ tag: 'text' | 'a'; text?: string; href?: string }>>;
      };
    };
  };
}

interface PushOptions {
  webhookUrl: string;
  secret?: string;
  title: string;
  summary: string;
  reportPath: string;
}

async function readFileSafe(path: string): Promise<string> {
  try {
    return await fs.readFile(path, 'utf-8');
  } catch (error) {
    throw new Error(`读取周报文件失败: ${path}\n${error}`);
  }
}

function buildFeishuPayload(options: PushOptions, reportSnippet: string): FeishuPayload {
  const lines = reportSnippet.split('\n').slice(0, 20); // 控制消息长度
  const content: FeishuPayload['content']['post']['zh_cn']['content'] = lines.map((line) => [
    { tag: 'text', text: line },
  ]);

  return {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: options.title,
          content,
        },
      },
    },
  };
}

function signRequest(secret: string, timestamp: number): string {
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('sha256', stringToSign);
  const digest = hmac.digest('base64');
  return digest;
}

async function pushToFeishu(options: PushOptions) {
  const reportContent = await readFileSafe(options.reportPath);
  const snippet = options.summary || reportContent.slice(0, 600);
  const payload = buildFeishuPayload(options, snippet);

  const timestamp = Math.floor(Date.now() / 1000);
  const body: Record<string, unknown> = { ...payload };

  if (options.secret) {
    body.timestamp = timestamp.toString();
    body.sign = signRequest(options.secret, timestamp);
  }

  const response = await fetch(options.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`飞书推送失败：${response.status} ${text}`);
  }

  console.log('✅ 飞书推送成功');
}

async function main() {
  const webhookUrl = process.env.FEISHU_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('缺少 FEISHU_WEBHOOK_URL 环境变量');
  }

  const reportPath = process.env.REPORT_FILE ?? 'dist/report-weekly.md';
  const title = process.env.REPORT_TITLE ?? '自动化周报';
  const summary = process.env.REPORT_SUMMARY ?? '';
  const secret = process.env.FEISHU_SECRET;

  await pushToFeishu({
    webhookUrl,
    secret,
    title,
    summary,
    reportPath,
  });
}

main().catch((error) => {
  console.error('❌ 飞书推送失败:', error);
  process.exitCode = 1;
});
