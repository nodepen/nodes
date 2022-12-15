<img src="np-banner.png" >

<div>
<img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/NodePenIO?style=social">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/nodepen/nodes?style=social">
&nbsp;
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/nodepen/nodes/ci?style=flat-square">
<img alt="npm (scoped)" src="https://img.shields.io/npm/v/@nodepen/nodes?style=flat-square">
<img alt="GitHub" src="https://img.shields.io/github/license/nodepen/nodes?style=flat-square">
</div>

---
<br />

Nodepen is a web client for Grasshopper. This monorepo is for the main `@nodepen/nodes` React app library and its supporting packages.

This project is under active development towards a 2.0 release that will:

- Publish useful bits of the [previous release](https://github.com/nodepen/nodes/releases/tag/1.0.0) as independent libraries
- Integrate with Speckle for backend processes and frontend visualization

## Features

- Compose, execute, and view results from your Grasshopper graphs in the browser
- Upload an existing script and continue working on the web
- Easily pin any number of parameters for a quick configurator-like experience
- Open the same graph in multiple browser windows for the "two screen" UX we've come to love with Rhino and Grasshopper
- Download your current graph to continue work in Grasshopper offline

## Project Structure

This monorepo contains the core NodePen libraries (`/packages`) and a collection of example applications (`/apps`) that use them. The applications are meant to be a simple demonstration of how to run a Grasshopper-like environment and how NodePen integrates with Speckle technology.

### Packages

NodePen currently supports three core libraries:

#### @nodepen/nodes

A React component library that exports the main NodePen client-side "app" for interacting with nodes and viewing results. It also exports the individual "views" which may be included and configured as necessary.

#### @nodepen/core

A typescript library that exports types and utilities for NodePen concepts. Useful if you need to perform operations with NodePen-shaped data but do not need to include the client-side logic.

#### NodePen.Converters

A C# library that can be used to serialize/deserialize types to/from the NodePen Document JSON format.

### Apps

#### nodepen-client

A thin next.js client that communicates directly with the Rhino Compute server for Grasshopper solutions and the Speckle server to receive results from Speckle streams.

#### rhino-compute-server

A minimal Rhino Compute server with endpoints for updating a given NodePen document. Writes results directly to the local Speckle server instance it's configured to point to.

#### speckle-server

A git submodule of [specklesystems/speckle-server](https://github.com/specklesystems/speckle-server).

## Local Development

Running NodePen locally required a number of dependencies and, at the moment, a bit of manual work for first-time setup. Please also see the section below about known limitations.

### Dependencies

In order to run all of the example applications, you will need:

- Nodejs 16, 18
- Dotnet CLI
- Docker (or similar CLI)
- Rhino 7+

### Initial Setup

Clone this repo and its speckle-server submodule with:

```
git clone --recurse-submodules git@github.com:nodepen/nodes.git
```

From the root directory, run:

```
npm i
```

This should install dependencies for all of the javascript projects and build them once.

From `/apps/rhino-compute-server` run:

```
dotnet build
```

This should restore dependencies for and build both the example application and NodePen.Converters.

Last, follow Speckle's instructions for how to set up your local development environment for the speckle-server project. Run the server.

Visit your local Speckle server and:

- Create your admin user (the first user on the server)
- Create a new stream
- [Create a personal access token for your account](https://speckle.guide/dev/tokens.html).

In `apps/nodepen-client`, copy `.env.development` to a `.env.development.local` and populate each environment variable with the relevant information from the previous steps.

In `apps/rhino-compute-server`, modify the values at the top of `Endpoints/GrasshopperEndpoints.cs`.

At this point, you may leave your Speckle server running and continue onto the next section.

### Development Environment

We will need to

### Limitations

- Grasshopper script conversion will fail often because several important component types are not yet handled.
- You may only expose number-based input parameters at this time in the HUD inputs window.
- Only curve-based results are being pushed to the Speckle server at this time, and so they are the only geometry you can see in the viewer.

## Attribution

Rhinoceros and Grasshopper are registered trademarks of [Robert McNeel & Associates](https://www.rhino3d.com).

All 3D visuals are powered by the [Speckle Viewer](https://github.com/specklesystems/speckle-server/tree/main/packages/viewer).

Previous drafts of NodePen included the ["RestHopper"](https://github.com/RESThopper/resthopper.grasshopper) headless Grasshopper prototype developed at the [2018 AEC Tech Hackathon](http://core.thorntontomasetti.com/aec-tech-2018/aec-tech-2018-hackathon/2018-aec-tech-hackathon-github-repos/).
