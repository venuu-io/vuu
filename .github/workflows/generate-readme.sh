#!/bin/sh

printf '[//]: # (This file is auto-generated by GitHub Actions. Please do not edit manually.)\n\n' > README_AUTO.md
{ cat $(cat ./docs/readme_contents.txt) ; } >> README_AUTO.md
