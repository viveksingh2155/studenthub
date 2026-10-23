# Student Hub

Student Hub is a browser-based student management dashboard built with HTML,
CSS, and vanilla JavaScript. It supports student records, course batch views,
spreadsheet imports, CSV exports, and read-only queries against an in-memory
copy of the roster. Student records and demo accounts are stored in the
browser's `localStorage`; there is no backend or build step.

The current extended version is in `swproject1/update 1/`. The earlier version
is kept separately in `swproject1/` and does not include the import and SQL
studio features.

## Features

- **Authentication:** Demo login, account registration, and password reset
  with a mock OTP flow.
- **Dashboard:** Student totals, active and inactive counts, course summaries,
  import statistics, and an event log.
- **Student roster:** Add, edit, and delete student records; search by name,
  course, or roll number; seed sample records when the roster is empty.
- **Course batches:** View predefined course batches, schedules, enrollment
  counts, and collapsible student lists.
- **Spreadsheet import:** Preview and validate `.xlsx`, `.xls`, and `.csv`
  files before importing rows.
- **SQL Dataset Studio:** Run single `SELECT` or `WITH ... SELECT` queries on
  the in-memory `students` table and export results as CSV.
- **Exports:** Download dashboard summaries, filtered roster data, and batch
  membership as CSV files. Roster CSV files can be opened in spreadsheet apps.
- **Settings and tracker:** Change the accent preset, view a simulated
  connection indicator, and explore the 12-step architecture tracker.

## Run Locally

Python 3 is sufficient; no package installation is required. From the
repository root, start a static server:

```bash
python3 -m http.server 8000 --directory "swproject1/update 1"
```

Then open <http://localhost:8000/>. Stop the server with `Ctrl+C`.

The page loads Tailwind CSS, Google Fonts, SheetJS, and AlaSQL from CDNs, so an
internet connection is required for those resources.

## Demo Account

| Field              | Value                 |
| ------------------ | --------------------- |
| Email              | `admin@studenthub.io` |
| Password           | `admin123`            |
| Password reset OTP | `123456`              |

You can also register another demo administrator from the login screen.

## Importing Students

Upload an `.xlsx`, `.xls`, or `.csv` file from the import panel. Column names
are matched flexibly; for example, `Full Name` and `Student Name` map to
`name`, while `Roll No` maps to `rollNumber`.

| Field        | Required | Validation                                                         |
| ------------ | -------- | ------------------------------------------------------------------ |
| `id`         | No       | Generated when omitted                                             |
| `name`       | Yes      | Must not be blank                                                  |
| `rollNumber` | Yes      | Must not be blank; duplicates within the uploaded file are flagged |
| `email`      | Yes      | Must have a valid email format                                     |
| `course`     | Yes      | Must not be blank                                                  |
| `age`        | Yes      | Number from 16 to 99                                               |
| `status`     | Yes      | `Active` or `Inactive`                                             |

Review the preview, correct or remove rows as needed, then confirm the import.

## SQL Dataset Studio

The studio exposes the current roster as an in-memory table:

```text
students(id, name, rollNumber, email, course, age, status)
```

For example:

```sql
SELECT course, COUNT(*) AS total_students
FROM students
GROUP BY course;

SELECT name, age
FROM students
WHERE status = 'Active'
ORDER BY age DESC;
```

The interface accepts one `SELECT` or `WITH ... SELECT` statement at a time.
Results can be exported as CSV. The query check is client-side and is not a
security boundary.

## Project Layout

```text
README.md
swproject1/
	index.html                 # Earlier standalone version
	css/styles.css
	js/                         # Earlier version's scripts
	update 1/
		index.html               # Current extended version
		css/styles.css
		js/
			config.js              # Tailwind configuration; loaded before the CDN
			state.js               # Browser state and storage keys
			logger.js              # Event log
			auth.js                # Demo authentication
			router.js              # View switching
			students.js            # Student records and localStorage persistence
			dashboard.js           # Dashboard analytics
			batches.js              # Course batch view
			settings.js             # Accent presets and simulated connection status
			tracker.js              # Architecture tracker
			export.js               # CSV exports
			import.js               # Spreadsheet import and validation
			sql-studio.js            # In-browser SQL studio
			main.js                  # Application entry point
```

The scripts use browser globals and are loaded in dependency order by
`index.html`.

## Limitations

- This is a front-end prototype. There is no server, database connection, or
  multi-user synchronization.
- Demo passwords are stored in plaintext in `localStorage`; the reset OTP is
  hardcoded. Do not use real credentials or sensitive student data.
- Data is local to the browser profile and origin. Clearing site storage
  removes it.
- Batch names and schedules are predefined in the client code.
- The SQL restriction is a basic client-side check, not a secure SQL
  permissions system.
