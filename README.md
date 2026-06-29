
  # FindMyAIT (v1)

  This is a code bundle for FindMyAIT (v1). The original project is available at https://www.figma.com/design/xnh3EK5T9uCalzxaKOOIQ1/FindMyAIT--v1-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Supabase Test Page

Route: `/test-supabase`

Use this page to validate Supabase and JSearch integration end-to-end.

- Quick Test
  - Verifies Supabase connection and fetches a small sample of existing jobs.

- Full Test
  - Workflow: API fetch → Insert test job → Fetch → Search.
  - API fetch runs two queries per US state and aggregates results; duplicates are removed by `job_id`.
  - Displays total vs unique counts from the API.

- Populate Test Data
  - Fetches real jobs from JSearch and inserts into Supabase.
  - Runs only the two Texas queries: `administrator in training nursing home Texas` and `AIT skilled nursing Texas`.
  - Aggregates and deduplicates results before inserting all unique jobs.

- Check Data
  - Shows total count of jobs in Supabase and a small sample with key fields.

- Clear Test Data
  - Deletes jobs inserted with `source = 'jsearch'`.

- Debug Tests
  - Inserts minimal and full-field test rows and runs a mapping test to ensure schema compatibility.

- Fix RLS Policies
  - Provides SQL guidance in logs to ensure public read/insert/update access for the `jobs` table if needed.

Notes
- API calls may return overlapping results across queries; deduplication ensures a single record per `job_id`.
- If API fetch fails, verify your JSearch API key in the code.
  