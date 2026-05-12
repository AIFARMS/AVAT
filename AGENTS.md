# Repository Guidelines

## Project Structure & Module Organization

AVAT is a Vite React application for video annotation. Main frontend code lives in `src/`: `ui_elements/` holds pages and components, `annotations/` and `fabric_types/` handle canvas behavior, `processing/` contains import/export utilities, `reducer/` stores Redux slices, and `static_data/` contains configuration data. Static files live in `public/`. `backend/` contains a small Flask server for the built app. Conversion helpers are `avat2coco.py` and `avat2voc.py`. Tests live in `test/`. `build/` and `dist/` are generated output; avoid editing them unless deploy artifacts are part of the task.

## Build, Test, and Development Commands

- `npm install`: install frontend dependencies from `package-lock.json`.
- `npm run dev` or `npm start`: start Vite locally.
- `npm run build`: produce the production bundle in `dist/`.
- `npm run preview`: preview the production build locally.
- `cd backend && pip install -r requirements.txt && flask run`: serve the built frontend through Flask.
- `cd test && ./test.sh`: create/update the Python test environment, start Selenium Docker services, and run browser tests.
- `cd test && python3 run_tests.py`: run Selenium tests when browser containers are already available.

## Coding Style & Naming Conventions

Use existing JavaScript/React patterns: ES modules, functional components where practical, and `.js` files that may contain JSX. Keep indentation consistent with nearby code, usually two spaces in React files. Component and page filenames are currently snake_case, for example `fabric_canvas.js` and `selection_screen.js`; follow local naming when adding files. There is no lint or format script, so keep diffs small and manually check formatting.

## Testing Guidelines

Browser workflow coverage is Python/Selenium-based, with test files named `*_test.py`. Add new Selenium coverage beside related tests and keep fixture videos or environment settings in `test/`. `test/jest_test.js` and Babel/Jest dependencies exist, but no `npm test` script is currently defined; document any new command in `package.json` if you add one.

## Commit & Pull Request Guidelines

Recent commits use short imperative messages, sometimes with Conventional Commit prefixes such as `feat:`. Prefer concise subjects like `feat: add video export option` or `fix: handle empty annotation rows`. Pull requests should explain the user-facing change, list verification commands, link relevant issues, and include screenshots or recordings for UI changes.

## Security & Configuration Tips

Do not commit local virtual environments, `node_modules/`, credentials, or machine-specific files. Keep dependency updates intentional and preserve `package-lock.json` when changing frontend packages.
