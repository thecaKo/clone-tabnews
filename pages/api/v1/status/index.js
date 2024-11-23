import database from "infra/database.js";
import { version } from "react";

async function Status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;
  const resultDatabaseVersion = await database.query("SHOW server_version;");
  const resultDatabaseMaxConnection = await database.query("SHOW max_connections;");
  const resultDatabaseOpenedConnections = await database.query({
    text: "SELECT count(*)::int from pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });


  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: resultDatabaseVersion.rows[0].server_version,
        max_connections: parseInt(resultDatabaseMaxConnection.rows[0].max_connections),
        opened_connections: resultDatabaseOpenedConnections.rows[0].count
      }
    }
  });
}

export default Status;
