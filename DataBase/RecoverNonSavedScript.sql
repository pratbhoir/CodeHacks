USE [DBName]
GO
SELECT
s.last_execution_time AS [ExecutionTime], 
t.text AS [Statement] 
FROM
sys.dm_exec_query_stats AS s
CROSS APPLY
sys.dm_exec_sql_text(s.sql_handle) AS t
WHERE t.text like '%StorageFee%'
ORDER BY
s.last_execution_time DESC
