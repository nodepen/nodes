# nodepen

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/cdriesler/glasshopper.io/cd?style=flat-square)

NodePen is a web client for [grasshopper](https://www.rhino3d.com/6/new/grasshopper/), a visual programming language for [Rhino 3D](https://www.rhino3d.com/). Rhino 7 shipped with [Rhino compute](https://www.rhino3d.com/compute), and that powers this 'shallow' wrapper for the same grasshopper you know and love.

The name absolutely channels the goals of this project: a place for tinkering with and sharing grasshopper snippets online. But that's a ways off! This is a personal project that has been in development since Winter 2019. You should check out what I'm doing with some other cool people at [Hypar](https://hypar.io) in the meantime.

The project is under active development, but you can tinker with the latest build by visiting [nodepen.io](http://nodepen.io).

The public pre-release has been online since May 7, 2021. The first release on this repo, [0.4.1](https://github.com/cdriesler/nodepen/releases/tag/0.4.1), was the end of an initial [proof-of-concept](https://twitter.com/cdriesler/status/1216726073473490946?s=20) phase.

Yes this project was called glasshopper for a long time I don't want to talk about it.

## Project summary

I owe you a diagram.

- `/app` - next.js client delivering a stylized version of the canvas
- `/api` - graphql service keeping you in sync with a redis database and rhino compute results
- `/compute` - graph creation and execution courtesy of a rhino.compute server
- `/dispatch` - a [bee-queue](https://github.com/bee-queue/bee-queue) service that catches and runs solution jobs scheduled by the api
- `/lib` - typescript types shared between the `app`, `api`, and `dispatch` projects

## Build and run locally

NodePen requires access to a number of technologies to run locally. I develop on windows and will provide some details about my setup.

- A redis instance running on the default port: 6379 (I use Ubuntu 20.04 on WSL with it installed)
- Node.js installed (I use `v12.18.1`)
- The ability to build and run a .NET Framework 4.6.2 app (The build scripts use [VS2019 Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16))
- A valid installation of Rhino 7+ (Must also have been opened at least once.)

NodePen also references a number of `.env` files for local runs:

- In `\api`, create a `.env` file with:

```
PORT=4000
```

- In `\dispatch`, create a `.env` file with:

```
PORT=4100
NP_DB_PORT=6379
NP_COMPUTE_URL=http://localhost:9900
```

- In `\app`, create a `.env.development.local` file with:

```
NEXT_PUBLIC_NP_API_URL=http://localhost:4000/graphql
```

I owe you a docker-compose script. But for now, this is how I develop locally:

- Open Ubuntu 20.04 on WSL and run `redis-server` to launch the redis instance.
- Wait for the database to be ready for connections.
- Open VS Code and then open a terminal in `\lib`. Build the shared types project:
  - `npm i`
  - `npm run build`
- Open `compute\NodePen.Compute.sln` in VS 2019. Build and then run the project in debug mode.
- In VS Code, replace the open terminal with three parallel terminals:
  - `\app`
  - `\api`
  - `\dispatch`
- In the `api` terminal:
  - `npm i`
  - `npm run dev`
- In the `dispatch` terminal:
  - `npm i`
  - `npm run dev`
- Both `api` and `dispatch` will confirm that they are ready in the console.
- In the `app` terminal:
  - `npm i`
  - `npm run dev`
- Next.js will confirm that the app compiled successfully and can now be tested.
- Visit `localhost:3000` to begin using/testing the app.

All node projects will rebuild and refresh on code saves. The compute project requires the program to be stopped or paused to save and rebuild code changes.
