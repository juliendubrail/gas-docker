# gas-dev - Dockerized Google App Script Development Environment

## Introduction

This repository is a development environment for Google App Script using VSCode and Dev Container. It provides an easy way to set up a local Google App Script environment.

## Prerequisite

Before using this repository, you need to have the following installed on your system:

- Docker Desktop
- VSCode with Dev Container extension installed
- Alternative: Remote Repositories extension of VSCode

## How to use

To use this repository, follow the steps below:

1. Create new repository by clicking the Use this template button above.
2. Open your duplicated repository in VSCode using the command ">Dev Containers: Clone Repositories in Named Container Volume". You can name your container for easy referencing.

## Google App Script Quick Start

Login the user
```
clasp login
```

Create a new Project
```
mkdir src && clasp create --title "Title" --type standalone --rootDir ./src
mkdir src && clasp create --title "Title" --type forms --rootDir ./src
mkdir src && clasp create --title "Title" --parentId "*******" --rootDir ./src
```

Clone and work on an existing project
```
mkdir src && clasp clone "*******" --rootDir ./src
```

Watch and push code when saved
```
clasp push --watch
```

### other useful commands

Open in the script editor
```
clasp open
```

## Clasp

- https://github.com/google/clasp
- https://developers.google.com/apps-script/guides/clasp
