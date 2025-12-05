[[_TOC_]]
## Description

Mastra beta 1.0.0-beta.5 has a bug, when using LibSQLStore to store workflow snapshot, it will result in a circular structure error.

### Usage
1. copy env/.env.example to .env, and set the environment variables according to the comments
2. run `pnpm install`
3. run `pnpm dev:env`
4. run `curl -X GET "http://localhost:8000/agent/weather2?city=new+york" `


It will result with such error:

```
LibSQLStore: Error during insert into table mastra_workflow_snapshot after 0 retries: TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Socket'
    |     property 'parser' -> object with constructor 'HTTPParser'
    --- property 'socket' closes the circle
Error executing step: TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Socket'
    |     property 'parser' -> object with constructor 'HTTPParser'
    --- property 'socket' closes the circle
    at JSON.stringify (<anonymous>)
    at E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\utils.ts:60:41
    at Array.map (<anonymous>)
    at prepareStatement (E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\utils.ts:52:40)
    at StoreOperationsLibSQL.doInsert (E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\operations\index.ts:130:7)
    at E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\operations\index.ts:143:54
    at executeWriteOperationWithRetry (E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\utils.ts:24:22)
    at StoreOperationsLibSQL.insert (E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\operations\index.ts:143:12)
    at WorkflowsLibSQL.persistWorkflowSnapshot (E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\domains\workflows\index.ts:282:27)
    at LibSQLStore.persistWorkflowSnapshot (E:\kuaipan\code\node-test\mastra-beta-error\node_modules\.pnpm\@mastra+libsql@1.0.0-beta.2_@mastra+core@1.0.0-beta.5\node_modules\@mastra\libsql\src\storage\index.ts:318:34)
```