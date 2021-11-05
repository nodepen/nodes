# NodePen

NodePen is a web client for [Grasshopper](https://www.rhino3d.com/6/new/grasshopper/), a visual programming language for [Rhinoceros 3D](https://www.rhino3d.com/). Rhino 7 shipped with ["headless" API capabilities](https://developer.rhino3d.com/guides/compute/) that power this shallow wrapper for the same Grasshopper you know and love.

The project is under active development, but you can tinker with the latest build by visiting [nodepen.io](http://nodepen.io). Work will continue marching along on nights and weekends! You should check out what I'm doing with some other cool people at [Hypar](https://hypar.io) in the meantime.

## Features

- Compose, execute, and view results from your Grasshopper graphs in the browser
- Open the same graph in multiple browser windows for the "two screen" UX we've come to love with Rhino and Grasshopper
- Edit graphs from your desktop or from your touchscreen devices
- Download your current graph to continue work in Grasshopper offline

## Feedback

Thank you for trying NodePen! This project continues to be a place where I improve my craft as a software developer with the serious veneer of "product" considerations. As NodePen approaches a moment where it will support user accounts, these considerations are things like "this product should work" and "this product should not break" and so on.

If you found a bug, felt a common Grasshopper feature was blatantly missing, or just have some thoughts you'd like to share, please open an issue or reach out (@cdriesler) on twitter! I'm currently working on a number of features related to hosting and sharing scripts (like the project's namesake) but am much more interested in how people want to use this thing.

## Project Architecture

NodePen is a next.js web application that must shuttle information to and from a Grasshopper instance that may:

- (1) take an inexplicably long time to execute because of accidental tree management errors
- (2) generate an unreasonably large amount of geometry because of accidental tree management errors

Even further, long running processes _can't be stopped gracefully_. Grasshopper completes or Grasshopper dies. The main architectural problem that NodePen tackles is the requirement to recover from these highly likely failure modes. This is further complicated by Rhino Compute's hard dependency on Windows machines.

The project folder structure represents the three core services of the application (and a shared libraries folder):

- `app` is the next.js client-side application that provides the editor experience
- `gh` is the Rhino Compute project that runs NodePen json structures as Grasshopper scripts
- `api` is a GraphQL service that, along with a redis instance for messages, mediates communication between them

The ideal solution loop goes something like:

- User makes some change to their graph that requires a new solution
- The client makes a request to the api, and a new solution is scheduled via redis (using the bee-queue library)
- A `gh/dispatch` service, associated with a `gh/compute` service, consumes and sends the job to Rhino Compute
- Compute creates a Grasshopper graph from NodePen json data
- Compute executes the entire graph and returns the results to `gh/dispatch`
- The `gh/dispatch` service writes _each parameter's results_ to an ephemeral redis key
- The `gh/dispatch` service broadcasts to all clients that the graph is done
- Out-of-date clients request parameter data as-needed

Communication _towards_ Rhino Compute is via these redis queue messages. Communication _away_ from Rhino Compute is via broadcasts to GraphQL subscriptions, also mediated by redis. The subscription-based structure allows multiple windows to watch the same graph. This means that you can have one open for editing and one open for watching the model. Try opening 10 at once, it's fun.

Each service is containerized and deployed to a kubernetes cluster on GKE. The cluster will auto-heal blocked or broken services while maintaining communication pathways between them. It also promises the ability to scale compute with queue depth, but I'm monitoring NodePen to see if this might be overkill. Because it's very expensive.

## Running Locally

Running the entire project locally is unnecessarily difficult at the moment because of recently-added dependencies on GCP for authentication. As the project stabilizes, I'm sketching out what a useful "local slice" of features would look like.

Each service (listed above) includes the `Dockerfile` used for build and deploy. If you are trying something that requires locally running NodePen, please reach out.

## Release History

### Current Release

The current version began with a release of the editor only (no solutions) on August 8, 2021. The Rhino Compute backend was brought back online and solutions were re-enabled on November 5, 2021.

### Public Test

The public test ([0.5.0](https://github.com/cdriesler/nodepen/releases/tag/0.5.0)) was online between May 7, 2021 and August 8, 2021. Over three months, it delivered 24,765 solutions to 2,501 unique users. It validated the queue-based backend solution infrastructure, but the editor experience left a lot to be desired (especially on mobile devices, which accounted for >70% (!) of all visits).

### Proof of Concept

The first release on this repo ([0.4.1](https://github.com/cdriesler/nodepen/releases/tag/0.4.1)) was the end of an initial [proof-of-concept](https://twitter.com/cdriesler/status/1216726073473490946?s=20) phase that started with isolated viability tests and sketches in Winter 2019.

Yes this project was called "glasshopper" for a long time and I don't want to talk about it.

## Attribution

Rhinoceros and Grasshopper are registered trademarks of [Robert McNeel & Associates](https://www.rhino3d.com).

Previous drafts of NodePen included the ["RestHopper"](https://github.com/RESThopper/resthopper.grasshopper) headless Grasshopper prototype developed at the [2018 AEC Tech Hackathon](http://core.thorntontomasetti.com/aec-tech-2018/aec-tech-2018-hackathon/2018-aec-tech-hackathon-github-repos/). The current execution model has been re-written several times in the years since then, but it's still fun to go back and see how we were abusing .ghx and component group labels.

The current `/gh/compute` execution model is based off of an early 2020 fork of McNeel's public implementation at [mcneel/compute.rhino3d](https://github.com/mcneel/compute.rhino3d).
