# Onboarding a new project

Everything a project needs on day one, in the order it needs it.

## Before the first deploy

1. Pick a name that survives a rename of the team.
2. Create the repository, then the environment — not the other way round.
3. Add two reviewers. One is a bus factor of one.

## Environments

| Name | Who can deploy | Data |
| --- | --- | --- |
| preview | anyone with a pull request | synthetic |
| staging | the team | a copy, a week old |
| production | the on-call | the real thing |

Staging is not a rehearsal for production; it is where the migration runs
first. Treat a failure there as a failure.
