#!/bin/bash

Xvfb :99 -screen 0 400x300x16 &
# ps a | grep Xorg | grep -v grep | awk '{print $6}'
# DISPLAY=:99 glxinfo | grep "OpenGL version"
DISPLAY=:99.0 node dist/server.js