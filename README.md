# NodePen

NodePen is a web client for [grasshopper](https://www.rhino3d.com/6/new/grasshopper/), a visual programming language for [Rhino 3D](https://www.rhino3d.com/). Rhino 7 shipped with [Rhino compute](https://www.rhino3d.com/compute), and that powers this 'shallow' wrapper for the same grasshopper you know and love.

The name channels the _goals_ of this project: a place for tinkering with and sharing grasshopper snippets online. But that's a ways off! This is a personal project that has been in development since Winter 2019. You should check out what I'm doing with some other cool people at [Hypar](https://hypar.io) in the meantime.

The project is under active development, but you can tinker with the latest build by visiting [nodepen.io](http://nodepen.io).

The current public beta began with a release of the editor only (no solutions) on August 8, 2021.

The public alpha ([0.5.0](https://github.com/cdriesler/nodepen/releases/tag/0.5.0)) was online between May 7, 2021 and August 8, 2021. Over three months, it delivered 24,765 solutions to 2,501 unique users. It validated the queue-based backend solution infrastructure, but the editor experience left a lot to be desired (especially on mobile devices, which accounted for >70% (!) of all visits).

The first release on this repo ([0.4.1](https://github.com/cdriesler/nodepen/releases/tag/0.4.1)) was the end of an initial [proof-of-concept](https://twitter.com/cdriesler/status/1216726073473490946?s=20) phase.

Yes this project was called glasshopper for a long time and I don't want to talk about it.

## Beta

NodePen is currently available as a public beta! The goal is to refine the graph editor experience on desktop _and_ mobile devices through a series of partial releases.

At the moment, that means NodePen is _severely limited_ in what it can do.

- The editor is _not_ requesting solutions anymore. There will be no results to inspect yet.
- A limited number of components are available to use. Right now, _no parameters_ are available, either.
- ZUI interactions are planned but not yet implemented.

Feedback is appreciated in all forms (github, twitter, etc), even for features that are obviously absent but desired. I am especially interested in:

- Ways you manage to break the graph, or leave parts of it in an un-editable state
- UX decisions that feel cumbersome on mobile
- Any extreme performance degradations (especially on mobile devices)

## Local Development

_To be updated when solutions are re-enabled._
