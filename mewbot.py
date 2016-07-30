#!/usr/bin/env python
# -*- coding: utf-8 -*-

import ssl
import sys
import codecs

from src.core import config_handler
from src.core import logger
from src.core import PokeBot

if sys.version_info >= (2, 7, 9) and hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

def main():
    sys.stdout = codecs.getwriter('utf8')(sys.stdout)
    sys.stderr = codecs.getwriter('utf8')(sys.stderr)

    logger.log('[i] MewBot - v1.0', 'green')

    config = config_handler.init()
    if not config:
        logger.log('[x] Config file not found', 'red')
        return

    logger.log('[i] Configuration initialized', 'yellow')

    try:
        logger.log('[i] Starting PokemonGo Bot....', 'green')

        bot = PokeBot.PokeBot(config)
        bot.start()

        while True:
            bot.take_step()
    except KeyboardInterrupt:
        logger.log('[x] Exiting PokemonGo Bot', 'red')

if __name__ == '__main__':
    main()
