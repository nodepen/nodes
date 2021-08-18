# NodePen

NodePen is a web client for [Grasshopper](https://www.rhino3d.com/6/new/grasshopper/), a visual programming language for [Rhinoceros 3D](https://www.rhino3d.com/). Rhino 7 shipped with ["headless" API capabilities](https://developer.rhino3d.com/guides/compute/) that power this shallow wrapper for the same Grasshopper you know and love.

The name hand-waves the _goals_ of this project: a place for tinkering with and sharing Grasshopper snippets online. But that's a ways off! This is a personal project that has been in development since Winter 2019. You should check out what I'm doing with some other cool people at [Hypar](https://hypar.io) in the meantime.

The project is under active development, but you can tinker with the latest build by visiting [nodepen.io](http://nodepen.io).

## Beta

NodePen is currently available as a public beta! The goal is to refine the graph editor experience on desktop _and_ mobile devices through a series of partial releases.

At the moment, that means NodePen is _severely limited_ in what it can do.

- The editor is _not_ requesting solutions anymore. There will be no results from Grasshopper to inspect yet.
- A limited number of components are available to use.
- ZUI interactions are planned but not yet implemented.

Feedback is appreciated in all forms (github, twitter, etc), even for features that are obviously absent but desired. I am especially interested in:

- Ways you manage to break the graph, or leave parts of it in an un-editable state
- UX decisions that feel cumbersome on mobile
- Any extreme performance degradations (especially on mobile devices)

## Project Architecture

_To be updated when solutions are re-enabled._

## Running Locally

_To be updated when solutions are re-enabled._

## Release History

### Public "Beta"

The current public beta began with a release of the editor only (no solutions) on August 8, 2021. See current note above.

### Public "Alpha"

The public "alpha" ([0.5.0](https://github.com/cdriesler/nodepen/releases/tag/0.5.0)) was online between May 7, 2021 and August 8, 2021. Over three months, it delivered 24,765 solutions to 2,501 unique users. It validated the queue-based backend solution infrastructure, but the editor experience left a lot to be desired (especially on mobile devices, which accounted for >70% (!) of all visits).

### Proof of Concept

The first release on this repo ([0.4.1](https://github.com/cdriesler/nodepen/releases/tag/0.4.1)) was the end of an initial [proof-of-concept](https://twitter.com/cdriesler/status/1216726073473490946?s=20) phase.

Yes this project was called "glasshopper" for a long time and I don't want to talk about it.

## Attribution

Rhinoceros and Grasshopper are registered trademarks of [Robert McNeel & Associates](https://www.rhino3d.com).

Previous drafts of NodePen included the ["RestHopper"](https://github.com/RESThopper/resthopper.grasshopper) headless Grasshopper prototype developed at the [2018 AEC Tech Hackathon](http://core.thorntontomasetti.com/aec-tech-2018/aec-tech-2018-hackathon/2018-aec-tech-hackathon-github-repos/). The current execution model has been re-written several times in the years since then, but it's still fun to go back and see how we were abusing .ghx and component group labels.

The current `/gh/compute` execution model is based off of an early 2020 fork of McNeel's public implementation at [mcneel/compute.rhino3d](https://github.com/mcneel/compute.rhino3d).
