import { logger } from "./src/application/logging";
import { web } from "./src/application/web";

web.listen(3000, () => {
  logger.info("App Start");
});
