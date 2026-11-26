# 0003 Build and publish docs after a pull request merges

Status: Proposed (2026-11-26)

## Context

The docs workflow built on pull request updates and on pushes to `master`.
Each push to `master` could also create a commit on `gh_docs_deploy`.
The deployment should build once per pull request merged into `master`.

## Decision

Use `pull_request_target` for pull requests closed against `master` and run
the build and deployment job only when GitHub reports that the PR merged.
The event runs in the base repository context, giving merges from forks the
same publishing permissions as merges from branches in the base repository.

Check out the SHA GitHub records for the completed merge. It identifies the
landed revision for merge commits, squash merges, and rebase merges. Record
the same SHA in the deployment commit so it identifies the revision built.

## Consequences

Direct pushes to `master` and PRs closed without merging skip docs builds and
deployments. Doc build failures now surface after merge. The test workflow
continues to run during PR review, and deployment snapshots continue to
accumulate on `gh_docs_deploy` when the generated files change.
