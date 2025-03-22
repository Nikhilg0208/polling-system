import { pollRouter } from "./polling.js";
export const Routes = (app) => {
  app.use("/api/polls", pollRouter);
  return app;
};
