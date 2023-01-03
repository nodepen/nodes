# NodePen Architecture

This repo houses three libraries critical to running [NodePen](http://nodepen.io):

- `@nodepen/core` `js` Shared types and utilities for the main library and frontend/backend consumers.
- `@nodepen/nodes` `js` React component library and "app" for interacting with scripts.
- `@nodepen/converters` `C#` Utilities for bi-directional conversion between NodePen document structure and native Grasshopper document.

In practice, these libraries require additional infrastructure to run a visual programming environment like Grasshopper from a web browser. This repo provides a minimal suite of example "apps" in the `/apps` directory for local development and testing. Notably, the minimal app uses `@speckle/server` by default for document persistence and 3D visualization.

- `/apps/nodepen-client` A next.js frontend that consumes `@nodepen/nodes` and provides example callbacks.
- `/apps/rhino-compute-server` A Rhino.Compute backend that accepts requests from the client, computes solutions, and writes updates to the given Speckle stream.
- `/apps/speckle-server` A git submodule of `speckle-systems/speckle-server`. Used to run a Speckle server locally.

## Coordinate Systems

**Page Space** - Coordinates that correspond to the browser's `pageX` and `pageY` space. This is regardless of the size or position of the root canvas div on the page (and, as a result, probably doesn't play nicely with scroll right now.)

**World Space** - Coordinates that correspond to the main canvas `svg` element.