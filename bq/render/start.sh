#!/bin/bash

Xvfb :99 -screen 0 400x300x8 &
DISPLAY=:99.0 node --max-old-space-size=6000 dist/server.js