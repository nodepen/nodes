#!/bin/bash

Xvfb :99 -screen 0 1200x1200x16 &
DISPLAY=:99.0 node dist/server.js