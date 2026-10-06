import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page on this site renders fresh on each request (force-dynamic,
// so admin edits show up immediately), so no incremental cache is needed.
export default defineCloudflareConfig({});
