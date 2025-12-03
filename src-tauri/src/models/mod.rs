// 数据模型模块

pub mod commit;
pub mod config;
pub mod report;
pub mod template;

pub use commit::{Commit, RepoInfo, RepoStats};
pub use config::{AppConfig, ExportFormat, LLMConfig, LLMProvider, ProxyConfig};
pub use report::{RepoGroup, Report, ReportType};
pub use template::{ReportTemplate, TemplateType};
