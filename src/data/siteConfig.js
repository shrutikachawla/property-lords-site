// This file just re-exports from content/site-content.json, which is the
// real source of truth (and what the dashboard app edits). Edit values
// either by hand here pointing at the JSON, or via the dashboard.
import content from "../../content/site-content.json";

export const siteConfig = content.siteConfig;
