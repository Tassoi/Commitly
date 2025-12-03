use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Arc;

use anyhow::{anyhow, bail, Context, Result};
use chrono::{NaiveDate, NaiveDateTime, NaiveTime};
use clap::{Parser, ValueEnum};
use gitlog_ai_reporter_lib::models::{AppConfig, RepoGroup, ReportType};
use gitlog_ai_reporter_lib::services::{GitService, LLMService, ReportService};

#[derive(Parser, Debug)]
#[command(
    name = "report-cli",
    about = "Generate reports via existing Rust services"
)]
struct CliArgs {
    /// Git 仓库路径，可多次传入 --repo
    #[arg(long = "repo", required = true)]
    repo_paths: Vec<PathBuf>,

    /// 报告起始日期 (YYYY-MM-DD)
    #[arg(long = "from", value_name = "DATE", required = true)]
    range_from: String,

    /// 报告结束日期 (YYYY-MM-DD)
    #[arg(long = "to", value_name = "DATE", required = true)]
    range_to: String,

    /// 报告类型（weekly 或 monthly）
    #[arg(long = "type", value_enum, default_value = "weekly")]
    report_type: ReportTypeArg,

    /// 生成的周报输出文件（Markdown）
    #[arg(long, value_name = "FILE", required = true)]
    output: PathBuf,

    /// AppConfig JSON 路径（含 LLM 配置）
    #[arg(long, value_name = "FILE", required = true)]
    config: PathBuf,

    /// 模板 ID（CLI 模式暂不支持，预留参数）
    #[arg(long = "template-id")]
    template_id: Option<String>,
}

#[derive(Copy, Clone, Debug, ValueEnum)]
enum ReportTypeArg {
    Weekly,
    Monthly,
}

impl From<ReportTypeArg> for ReportType {
    fn from(value: ReportTypeArg) -> Self {
        match value {
            ReportTypeArg::Weekly => ReportType::Weekly,
            ReportTypeArg::Monthly => ReportType::Monthly,
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = CliArgs::parse();

    if args.template_id.is_some() {
        bail!("CLI 模式暂不支持自定义模板 (--template-id)");
    }

    let from_ts = parse_date_start(&args.range_from)
        .with_context(|| format!("无法解析开始日期: {}", args.range_from))?;
    let to_ts = parse_date_end(&args.range_to)
        .with_context(|| format!("无法解析结束日期: {}", args.range_to))?;

    if from_ts > to_ts {
        bail!("开始日期不能大于结束日期");
    }

    let app_config = load_config(&args.config)?;
    let llm_service = Arc::new(LLMService::new(
        app_config.llm_provider,
        Some(app_config.proxy_config),
    ));
    let report_service = ReportService::new(llm_service);

    let mut repo_groups = Vec::new();
    for repo_path in &args.repo_paths {
        let group = collect_repo_group(repo_path, from_ts, to_ts)?;
        repo_groups.push(group);
    }

    if repo_groups.is_empty() {
        bail!("选定的仓库在指定时间范围内没有提交");
    }

    let report = match args.report_type {
        ReportTypeArg::Weekly => report_service
            .generate_weekly(repo_groups, None, None)
            .await
            .map_err(anyhow::Error::msg)?,
        ReportTypeArg::Monthly => report_service
            .generate_monthly(repo_groups, None, None)
            .await
            .map_err(anyhow::Error::msg)?,
    };

    if let Some(parent) = args.output.parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent)
                .with_context(|| format!("创建输出目录失败: {}", parent.display()))?;
        }
    }

    fs::write(&args.output, &report.content)
        .with_context(|| format!("写入报告失败: {}", args.output.display()))?;

    println!(
        "✅ 报告生成成功：{} (提交 {} 条)",
        args.output.display(),
        report.commits.len()
    );

    Ok(())
}

fn parse_date_start(value: &str) -> Result<i64> {
    let date = NaiveDate::parse_from_str(value, "%Y-%m-%d")?;
    let datetime = NaiveDateTime::new(date, NaiveTime::from_hms_opt(0, 0, 0).unwrap());
    Ok(datetime.and_utc().timestamp())
}

fn parse_date_end(value: &str) -> Result<i64> {
    let date = NaiveDate::parse_from_str(value, "%Y-%m-%d")?;
    let datetime = NaiveDateTime::new(date, NaiveTime::from_hms_opt(23, 59, 59).unwrap());
    Ok(datetime.and_utc().timestamp())
}

fn load_config(path: &Path) -> Result<AppConfig> {
    let config_str = fs::read_to_string(path)
        .with_context(|| format!("读取配置文件失败: {}", path.display()))?;
    let config: AppConfig = serde_json::from_str(&config_str)
        .with_context(|| format!("解析配置文件失败: {}", path.display()))?;
    Ok(config)
}

fn collect_repo_group(path: &Path, from_ts: i64, to_ts: i64) -> Result<RepoGroup> {
    let repo_path_str = path
        .to_str()
        .ok_or_else(|| anyhow!("无法解析仓库路径"))?
        .to_string();

    let git_service = GitService::open_repo(&repo_path_str).map_err(anyhow::Error::msg)?;
    let repo_info = git_service
        .get_repo_info()
        .map_err(anyhow::Error::msg)?;
    let commits = git_service
        .get_commits(from_ts, to_ts)
        .map_err(anyhow::Error::msg)?;

    Ok(RepoGroup {
        repo_id: repo_info.path.clone(),
        repo_name: repo_info.name,
        repo_path: repo_info.path,
        commits,
    })
}
