const app = require("./app");
const connectDb = require("./config/db");
const { port } = require("./config/env");
const logger = require("./utils/logger");

async function bootstrap() {
  await connectDb();
  app.listen(port, () => logger.info(`MedAssist API running on port ${port}`));
}

bootstrap().catch((e) => {
  logger.error(e);
  process.exit(1);
});
