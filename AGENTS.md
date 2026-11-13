# Repository Guidelines

## Project Structure & Module Organization

This repository is in its initial setup stage. It currently contains Codex skill resources; no sales application source code, test suite, or application assets have been added.

- `skills/professor-mode/SKILL.md`: Portuguese instructions for the teaching skill.
- `skills/professor-mode/agents/openai.yaml`: skill display metadata.
- `skills/professor-mode.zip`: packaged skill archive.
- `.skill-build/problem-interviewer/`: skill preparation files, including instructions and agent metadata.

Keep each skill's instructions and metadata together. When adding application code, document its directory layout and setup commands here. Do not assume a framework or introduce empty source directories solely to match a template.

## Build, Test, and Development Commands

No dependency manifest, build script, development server, formatter, or test runner is currently configured. Commands such as `npm install` and `npm test` are therefore not established workflows.

Useful repository checks, run from the root:

- `git status --short --branch`: review the active branch and pending changes.
- `git diff --check`: detect whitespace errors in tracked changes.
- `git diff -- AGENTS.md skills/ .skill-build/`: review contributor guidance and skill edits before staging.

## Coding Style & Naming Conventions

Use descriptive Markdown headings and short, actionable instructions. Preserve the Portuguese language of existing skill content unless translation is requested. Use two spaces for YAML indentation and preserve valid YAML front matter in `SKILL.md` files. Name new skill directories in lowercase kebab-case, such as `professor-mode`, and retain the `SKILL.md` and `agents/openai.yaml` filenames.

## Testing Guidelines

There is no automated testing framework or coverage threshold yet. For skill changes, review front matter, metadata, referenced paths, and example instructions manually. If updating a packaged ZIP, verify that its contents match the corresponding skill directory. When adding executable code, include appropriate tests and document their naming conventions and exact execution command.

## Commit & Pull Request Guidelines

There is no commit history from which to infer conventions. Use concise, imperative commit messages, for example `docs: clarify professor skill activation`. Keep unrelated changes in separate commits.

Pull requests should describe the change, its purpose, and validation performed. Link relevant issues when available. Include screenshots for future UI changes and explain archive updates or newly introduced dependencies.

## Security & Configuration

Never commit credentials, tokens, local environment files, or customer sales data. Use sanitized examples and document required configuration without including secret values.
