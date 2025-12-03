// 导出服务：负责将报告输出为多种格式

use crate::models::Report;
use std::fs;
use std::path::Path;

pub struct ExportService;

impl ExportService {
    /// 导出 Markdown 文件
    pub fn export_markdown(report: &Report, save_path: &str) -> Result<(), String> {
        // 校验路径
        let path = Path::new(save_path);
        if let Some(parent) = path.parent() {
            if !parent.exists() {
                return Err(format!("Directory does not exist: {:?}", parent));
            }
        }

        // 确保使用 .md 扩展名
        let save_path = if !save_path.ends_with(".md") {
            format!("{}.md", save_path)
        } else {
            save_path.to_string()
        };

        // 构建包含元信息的 Markdown 内容
        let mut content = String::new();

        // 元信息头
        content.push_str(&format!(
            "# {}\n\n",
            report_type_to_chinese(&report.report_type)
        ));
        content.push_str(&format!(
            "> **生成时间**: {}\n",
            format_timestamp(report.generated_at)
        ));
        content.push_str(&format!("> **提交数量**: {}\n", report.commits.len()));
        content.push_str(&format!("> **报告 ID**: {}\n\n", report.id));
        content.push_str("---\n\n");

        // 报告正文
        content.push_str(&report.content);

        // 提交详情尾部
        content.push_str("\n\n---\n\n");
        content.push_str("## 📝 提交详情\n\n");
        for commit in &report.commits {
            content.push_str(&format!(
                "- `{}` {} - {} ({})\n",
                &commit.hash[..7.min(commit.hash.len())],
                commit.message,
                commit.author,
                format_timestamp(commit.timestamp)
            ));
        }

        // 写入文件
        fs::write(&save_path, content)
            .map_err(|e| format!("Failed to write markdown file: {}", e))?;

        println!("✅ Markdown report exported to: {}", save_path);
        Ok(())
    }

    /// 导出带样式的 HTML 文件
    pub fn export_html(report: &Report, save_path: &str) -> Result<(), String> {
        use pulldown_cmark::{html, Parser};

        // 校验路径
        let path = Path::new(save_path);
        if let Some(parent) = path.parent() {
            if !parent.exists() {
                return Err(format!("Directory does not exist: {:?}", parent));
            }
        }

        // 确保使用 .html 扩展名
        let save_path = if !save_path.ends_with(".html") {
            format!("{}.html", save_path)
        } else {
            save_path.to_string()
        };

        // 将报告（Markdown）内容转换为 HTML
        let parser = Parser::new(&report.content);
        let mut html_content = String::new();
        html::push_html(&mut html_content, parser);

        // 构建完整 HTML 文档及样式
        let full_html = build_html_document(report, &html_content);

        // 写入文件
        fs::write(&save_path, full_html)
            .map_err(|e| format!("Failed to write HTML file: {}", e))?;

        println!("✅ HTML report exported to: {}", save_path);
        Ok(())
    }
}

/// 将 Unix 时间戳格式化成人类可读日期
fn format_timestamp(timestamp: i64) -> String {
    use chrono::{DateTime, Utc};

    DateTime::<Utc>::from_timestamp(timestamp, 0)
        .map(|dt| dt.format("%Y-%m-%d %H:%M:%S UTC").to_string())
        .unwrap_or_else(|| "Unknown date".to_string())
}

/// 将 ReportType 转为中文展示名称
fn report_type_to_chinese(report_type: &crate::models::ReportType) -> &'static str {
    match report_type {
        crate::models::ReportType::Weekly => "周报",
        crate::models::ReportType::Monthly => "月报",
        crate::models::ReportType::Custom => "自定义报告",
    }
}

/// 构建包含 GitHub 风格 CSS 的完整 HTML 文档
fn build_html_document(report: &Report, html_content: &str) -> String {
    format!(
        r#"<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{} - {}</title>
    <style>
        /* GitHub Markdown 风格 */
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #24292f;
            background-color: #ffffff;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }}

        .header {{
            border-bottom: 1px solid #d0d7de;
            padding-bottom: 16px;
            margin-bottom: 32px;
        }}

        .header h1 {{
            font-size: 32px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #0969da;
        }}

        .metadata {{
            font-size: 14px;
            color: #57606a;
            margin: 8px 0;
        }}

        .metadata strong {{
            font-weight: 600;
            color: #24292f;
        }}

        h1, h2, h3, h4, h5, h6 {{
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }}

        h2 {{
            font-size: 24px;
            border-bottom: 1px solid #d0d7de;
            padding-bottom: 8px;
        }}

        h3 {{
            font-size: 20px;
        }}

        p {{
            margin-top: 0;
            margin-bottom: 16px;
        }}

        ul, ol {{
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 16px;
        }}

        li {{
            margin-bottom: 4px;
        }}

        code {{
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: rgba(175,184,193,0.2);
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        }}

        pre {{
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 6px;
            margin-bottom: 16px;
        }}

        pre code {{
            background-color: transparent;
            padding: 0;
            border-radius: 0;
        }}

        blockquote {{
            padding: 0 1em;
            color: #57606a;
            border-left: 0.25em solid #d0d7de;
            margin: 0 0 16px 0;
        }}

        table {{
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }}

        table th, table td {{
            padding: 6px 13px;
            border: 1px solid #d0d7de;
        }}

        table th {{
            font-weight: 600;
            background-color: #f6f8fa;
        }}

        hr {{
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #d0d7de;
            border: 0;
        }}

        .footer {{
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #d0d7de;
            font-size: 14px;
            color: #57606a;
        }}

        .badge {{
            display: inline-block;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 600;
            line-height: 1;
            color: #ffffff;
            background-color: #0969da;
            border-radius: 12px;
            margin-right: 8px;
        }}

        @media (prefers-color-scheme: dark) {{
            body {{
                color: #c9d1d9;
                background-color: #0d1117;
            }}

            .header h1 {{
                color: #58a6ff;
            }}

            .metadata, .footer {{
                color: #8b949e;
            }}

            .metadata strong {{
                color: #c9d1d9;
            }}

            h2 {{
                border-bottom-color: #21262d;
            }}

            code {{
                background-color: rgba(110,118,129,0.4);
            }}

            pre {{
                background-color: #161b22;
            }}

            blockquote {{
                color: #8b949e;
                border-left-color: #3b434b;
            }}

            table th, table td {{
                border-color: #30363d;
            }}

            table th {{
                background-color: #161b22;
            }}

            hr {{
                background-color: #21262d;
            }}

            .footer {{
                border-top-color: #21262d;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <span class="badge">{}</span>
        <h1>{}</h1>
        <div class="metadata">
            <strong>生成时间:</strong> {} |
            <strong>提交数量:</strong> {} |
            <strong>报告 ID:</strong> {}
        </div>
    </div>

    <div class="content">
        {}
    </div>

    <div class="footer">
        <p>由 <strong>Commitly</strong> 生成</p>
    </div>
</body>
</html>"#,
        report_type_to_chinese(&report.report_type), // 占位 1：标题
        format_timestamp(report.generated_at),       // 占位 2：副标题时间
        report_type_to_chinese(&report.report_type), // 徽章文案
        report_type_to_chinese(&report.report_type), // 一级标题文案
        format_timestamp(report.generated_at),       // 元信息：生成时间
        report.commits.len(),                        // 元信息：提交数量
        report.id,                                   // 元信息：报告 ID
        html_content                                 // 主体内容
    )
}
