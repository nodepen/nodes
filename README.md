# NodePen

NodePen is a web client for [Grasshopper](https://www.rhino3d.com/6/new/grasshopper/), a visual programming language for [Rhinoceros 3D](https://www.rhino3d.com/). Rhino 7 shipped with ["headless" API capabilities](https://developer.rhino3d.com/guides/compute/) that power this shallow wrapper for the same Grasshopper you know and love.

The project is under active development, but you can tinker with the latest build by visiting [nodepen.io](http://nodepen.io). Work will continue marching along on nights and weekends! You should check out what I'm doing with some other cool people at [Hypar](https://hypar.io) in the meantime.

## Features

- Compose, execute, and view results from your Grasshopper graphs in the browser
- Open the same graph in multiple browser windows for the "two screen" UX we've come to love with Rhino and Grasshopper
- Edit graphs from your desktop or from your touchscreen devices
- Download your current graph to continue work in Grasshopper offline

## Feedback

Thank you for trying NodePen! This project continues to be a place where I improve my craft as a software developer with the serious veneer of product considerations.

If you found a bug, felt a common Grasshopper feature was blatantly missing, or just have some thoughts you'd like to share, please open an issue or reach out (@cdriesler) on twitter!

## Running Locally

NodePen has grown well beyond its early days as an single page app. It's currently not possible to run the entire app locally without also including shims for dependencies on Google Cloud products or a locally running instance of Redis. I'm actively working on what to do about this.

## Release History

### Third Iteration

After about two and a half years of development, NodePen released with user accounts, sharing, and script persistence on January 10, 2022. This marked a symbolic "1.0" release, but there was still a lot to do! Most of the native Grasshopper library was not yet supported, and there was no way to browse scripts on the platform.

The 1.0 editor (no solutions or profiles or sharing) was released on August 8, 2021. The Rhino Compute backend was brought back online and solutions were re-enabled on November 5, 2021.

### Second Iteration

The public test ([release](https://github.com/cdriesler/nodepen/releases/tag/0.5.0)) was online between May 7, 2021 and August 8, 2021. Over three months, it delivered 24,765 solutions to 2,501 unique users. It validated the queue-based backend solution infrastructure, but the editor experience left a lot to be desired (especially on mobile devices, which accounted for >70% (!) of all visits).

### First Iteration

The first release on this repo ([release](https://github.com/cdriesler/nodepen/releases/tag/0.4.1)) was the end of an initial [proof-of-concept](https://twitter.com/cdriesler/status/1216726073473490946?s=20) phase that started with isolated viability tests and sketches in Winter 2019.

Yes this project was called "glasshopper" for a long time and I don't want to talk about it.

## Attribution

Rhinoceros and Grasshopper are registered trademarks of [Robert McNeel & Associates](https://www.rhino3d.com).

Serialized Rhino geometry is converted to three.js objects with [rhino3dm.js](https://www.npmjs.com/package/rhino3dm) and snippets from the [3DMLoader](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/3DMLoader.js) by [Luis Fraguada](https://twitter.com/luisfraguada) and contributors.

The current `/gh/compute` Rhino compute configuration is based off of an early 2020 fork of McNeel's public implementation at [mcneel/compute.rhino3d](https://github.com/mcneel/compute.rhino3d).

Previous drafts of NodePen included the ["RestHopper"](https://github.com/RESThopper/resthopper.grasshopper) headless Grasshopper prototype developed at the [2018 AEC Tech Hackathon](http://core.thorntontomasetti.com/aec-tech-2018/aec-tech-2018-hackathon/2018-aec-tech-hackathon-github-repos/). The current execution model has been re-written several times in the years since then, but it's still fun to go back and see how we were abusing .ghx and component group labels.
