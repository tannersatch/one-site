import { format } from "sql-formatter";

export type SqlDialect = "sql" | "postgresql" | "mysql" | "transactsql" | "sqlite" | "bigquery";
export type SqlKeywordCase = "upper" | "lower" | "preserve";
export type SqlIndentation = "2" | "4" | "tab";

export const sqlDialects: { label: string; value: SqlDialect }[] = [
  { label: "Standard SQL", value: "sql" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "SQL Server", value: "transactsql" },
  { label: "SQLite", value: "sqlite" },
  { label: "BigQuery", value: "bigquery" },
];

export const sqlExamples: Record<SqlDialect, string> = {
  sql:
    "select u.id,u.name,count(o.id) as order_count from users u left join orders o on o.user_id = u.id where u.active = 1 group by u.id,u.name order by order_count desc;",
  postgresql:
    "select id,email,created_at::date as joined_on from users where active = true order by created_at desc limit 10;",
  mysql: "select `id`,`name`,count(*) as total from `orders` where `status` = 'paid' group by `id`,`name` limit 10;",
  transactsql:
    "select top (10) [Id],[Name],[CreatedAt] from [dbo].[Users] where [Active] = 1 order by [CreatedAt] desc;",
  sqlite: "select id,name,datetime(created_at) as created from users where active = 1 order by created desc limit 10;",
  bigquery:
    "select user_id,count(*) as events from `project.analytics.events` where event_name = 'page_view' group by user_id order by events desc limit 10;",
};

export function formatSql(source: string, options: {
  dialect?: SqlDialect;
  keywordCase?: SqlKeywordCase;
  indentation?: SqlIndentation;
} = {}): string {
  if (!source.trim()) return "";

  return format(source, {
    language: options.dialect ?? "sql",
    keywordCase: options.keywordCase ?? "upper",
    tabWidth: options.indentation === "4" ? 4 : 2,
    useTabs: options.indentation === "tab",
  });
}
