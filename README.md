# nodepen

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/cdriesler/glasshopper.io/cd?style=flat-square)
![GitHub milestone](https://img.shields.io/github/milestones/progress/cdriesler/glasshopper.io/1?label=alpha%20release&style=flat-square)

Nodepen is a web client for grasshopper! Very literally! [Rhino compute](https://www.rhino3d.com/compute) powers this 'shallow' wrapper for the same grasshopper you know and love.

Short term goals include stable-but-limited parity with vanilla grasshopper behavior. I don't plan on supporting a 3d modeling interface alongside this, for example. What does that leave me? Still unsure. Long term goals include a codepen-style infrastructure for light code sharing, previewing, and poking. (Long ways off.) You should check out what I'm doing with some other cool people at [Hypar](https://hypar.io) in the meantime.

I'm still finishing a second 'proof-of-concept' phase after the [first prototype](https://twitter.com/cdriesler/status/1216726073473490946?s=20). But this one is going much better. Hopeful that I can share a public link to the latest versions soon.

Yes this project was called glasshopper for a long time I don't want to talk about it.

## Project structure

- `/app` - next.js client delivering a stylized version of the canvas
- `/api` - graphql service keeping you in sync with a redis database and rhino compute results
- `/compute` - graph creation and execution courtesy of a rhino.compute server
- `/dispatch` - a [bee-queue](https://github.com/bee-queue/bee-queue) service that catches and runs solution jobs scheduled by the api
