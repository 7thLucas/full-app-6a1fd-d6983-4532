// reflect-metadata must be imported before any Typegoose models are loaded.
// tsx/esbuild does not emit decorator metadata, so this polyfill is required.
import "reflect-metadata";

// Import global routes
import routes from "./routes";
import { initializeModels } from "./models";

// Initialize models
await initializeModels();

export default routes;
