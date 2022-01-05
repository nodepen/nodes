#!/bin/bash

Xvfb :99 -screen 0 400x300x16 &
DISPLAY=:99.0 node dist/server.js