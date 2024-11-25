import migrationsRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database.js'


export default async function Migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationsSettings = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  }

  if (request.method === 'GET') {
    const migrations = await migrationsRunner(defaultMigrationsSettings);
    await dbClient.end();
    return response.status(200).json(migrations);
  }

  if (request.method === 'POST') {
    const migrations = await migrationsRunner({
      ...defaultMigrationsSettings,
      dryRun: false,
    });
    await dbClient.end();
    return response.status(200).json(migrations);
  }
  return response.status(405).end();
}

