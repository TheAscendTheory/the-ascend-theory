<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Production continuity — mandatory
Main is the integrated production source. Never deploy an earlier branch wholesale or replace the three standalone applications with brochure routes. Website-only edits must not change standalone/**, app gateways, or application hosting rewrites. Run npm run check:apps and npm run build before release. The approved app blob manifest is a release lock: modify it only when an explicitly requested app change is reviewed, not to bypass a failed build. Keep full product names, Shop, and new-tab app navigation. Verify all four live surfaces after release. Record changes in docs.
