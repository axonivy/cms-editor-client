#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/cms-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/cms-editor-protocol@${1}" --registry $REGISTRY
