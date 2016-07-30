#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json

def init():
    directory   = "config/"
    config_file = directory + "config.json"
    config      = None

    # Load config
    if os.path.isfile(config_file):
        config = {}
        with open(config_file) as data:
            config.update(json.load(data))

    config = check_config(config)

    return config

def check_config(config):
    if config is None or config["credentials"] is None:
        return None

    return config
