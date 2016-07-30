# -*- coding: utf-8 -*-

import logging
import googlemaps
import json
import random
import threading
import datetime
import sys
import yaml
import logger
import re

from src.api import PGoApi
#from cell_workers import PokemonCatchWorker, SeenFortWorker, MoveToFortWorker, InitialTransferWorker, EvolveAllWorker
#from cell_workers.utils import distance
#from human_behaviour import sleep
#from stepper import Stepper
#from geopy.geocoders import GoogleV3
from math import radians, sqrt, sin, cos, atan2
#from item_list import Item

data_dir       = "../data/"
pokemons_file  = "pokemon.json"
items_file     = "items.json"

class PokeBot(object):
    def __init__(self, config):
        self.config          = config
        self.pokemon_list    = json.load(open(data_dir +  pokemons_file))
        self.item_list       = json.load(open(data_dir + items_file))
        self.pokemon_service = PokemonService()
        self.player_service  = PlayerService()
        self.api             = PGoApi()

    def start(self):
        self._setup_logging()

        if self._try_connexion() === False:
            logger.log('Login Error, server busy', 'red')
            exit(0)

        self._setup_position()
        self._setup_player()

        #self.player_service.get_player_info()

        #if self.config.initial_transfer:
        #    worker = InitialTransferWorker(self)
        #    worker.work()

        #self.inventory = self.get_inventory()
        #self.stepper = Stepper(self)
        #random.seed()

    def _setup_logging(self):
        self.log = logging.getLogger(__name__)
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s [%(module)10s] [%(levelname)5s] %(message)s')

        if self.config.debug:
            logging.getLogger("requests").setLevel(logging.DEBUG)
            logging.getLogger("pgoapi").setLevel(logging.DEBUG)
            logging.getLogger("rpc_api").setLevel(logging.DEBUG)
        else:
            logging.getLogger("requests").setLevel(logging.ERROR)
            logging.getLogger("pgoapi").setLevel(logging.ERROR)
            logging.getLogger("rpc_api").setLevel(logging.ERROR)

    def _try_connexion(self):
        credentials = self.config["credentials"]

        if not self.api.login(credentials.auth_service,
                              str(credentials.username),
                              str(credentials.password)):
            return False

        return True

    def _setup_position(self):
        if self.config.test:
            # TODO: Add unit tests
            return

        if self.config.location:
            try:
                location_str = str(self.config.location)
                location = (self._get_pos_by_name(location_str.replace(" ", "")))
                self.position = location
                self.api.set_position(*self.position)
                logger.log('')
                logger.log(u'[x] Address found: {}'.format(self.config.location.decode(
                    'utf-8')))
                logger.log('[x] Position in-game set as: {}'.format(self.position))
                logger.log('')
                return
            except:
                logger.log('[x] The location given using -l could not be parsed. Checking for a cached location.')
                pass

    def _setup_player():
        self.api.get_player()

        response_dict = self.api.call()
        currency_1 = "0"
        currency_2 = "0"

        player = response_dict['responses']['GET_PLAYER']['player_data']

        # @@@ TODO: Convert this to d/m/Y H:M:S
        creation_date = datetime.datetime.fromtimestamp(
            player['creation_timestamp_ms'] / 1e3)

        pokecoins = '0'
        stardust = '0'
        balls_stock = self.pokeball_inventory()

        if 'amount' in player['currencies'][0]:
            pokecoins = player['currencies'][0]['amount']
        if 'amount' in player['currencies'][1]:
            stardust = player['currencies'][1]['amount']

        logger.log('[#] Username: {username}'.format(**player))
        logger.log('[#] Acccount Creation: {}'.format(creation_date))
        logger.log('[#] Bag Storage: {}/{}'.format(
            self.get_inventory_count('item'), player['max_item_storage']))
        logger.log('[#] Pokemon Storage: {}/{}'.format(
            self.get_inventory_count('pokemon'), player[
                'max_pokemon_storage']))
        logger.log('[#] Stardust: {}'.format(stardust))
        logger.log('[#] Pokecoins: {}'.format(pokecoins))
        logger.log('[#] PokeBalls: ' + str(balls_stock[1]))
        logger.log('[#] GreatBalls: ' + str(balls_stock[2]))
        logger.log('[#] UltraBalls: ' + str(balls_stock[3]))

    def take_step(self):
        self.stepper.take_step()

    def work_on_cell(self, cell, position, include_fort_on_path):
        if self.config.evolve_all:
            # Run evolve all once. Flip the bit.
            print('[#] Attempting to evolve all pokemons ...')
            worker = EvolveAllWorker(self)
            worker.work()
            self.config.evolve_all = []

        self._filter_ignored_pokemons(cell)

        if (self.config.mode == "all" or self.config.mode ==
                "poke") and 'catchable_pokemons' in cell and len(cell[
                    'catchable_pokemons']) > 0:
            logger.log('[#] Something rustles nearby!')
            # Sort all by distance from current pos- eventually this should
            # build graph & A* it
            cell['catchable_pokemons'].sort(
                key=
                lambda x: distance(self.position[0], self.position[1], x['latitude'], x['longitude']))

            user_web_catchable = 'web/catchable-%s.json' % (self.config.username)
            for pokemon in cell['catchable_pokemons']:
                with open(user_web_catchable, 'w') as outfile:
                    json.dump(pokemon, outfile)

                if self.catch_pokemon(pokemon) == PokemonCatchWorker.NO_POKEBALLS:
                    break
                with open(user_web_catchable, 'w') as outfile:
                    json.dump({}, outfile)

        if (self.config.mode == "all" or self.config.mode == "poke"
            ) and 'wild_pokemons' in cell and len(cell['wild_pokemons']) > 0:
            # Sort all by distance from current pos- eventually this should
            # build graph & A* it
            cell['wild_pokemons'].sort(
                key=
                lambda x: distance(self.position[0], self.position[1], x['latitude'], x['longitude']))
            for pokemon in cell['wild_pokemons']:
                if self.catch_pokemon(pokemon) == PokemonCatchWorker.NO_POKEBALLS:
                    break
        if (self.config.mode == "all" or
                self.config.mode == "farm") and include_fort_on_path:
            if 'forts' in cell:
                # Only include those with a lat/long
                forts = [fort
                         for fort in cell['forts']
                         if 'latitude' in fort and 'type' in fort]
		gyms = [gym for gym in cell['forts'] if 'gym_points' in gym]

                # Sort all by distance from current pos- eventually this should
                # build graph & A* it
                forts.sort(key=lambda x: distance(self.position[
                           0], self.position[1], x['latitude'], x['longitude']))
                for fort in forts:
                    worker = MoveToFortWorker(fort, self)
                    worker.work()

                    worker = SeenFortWorker(fort, self)
                    hack_chain = worker.work()
                    if hack_chain > 10:
                        #print('need a rest')
                        break

    def _get_pos_by_name(self, location_name):
        # Check if the given location is already a coordinate.
        if ',' in location_name:
            possibleCoordinates = re.findall("[-]?\d{1,3}[.]\d{6,7}", location_name)
            if len(possibleCoordinates) == 2:
                # 2 matches, this must be a coordinate. We'll bypass the Google geocode so we keep the exact location.
                logger.log(
                    '[x] Coordinates found in passed in location, not geocoding.')
                return (float(possibleCoordinates[0]), float(possibleCoordinates[1]), float("0.0"))

        geolocator = GoogleV3(api_key=self.config.gmapkey)
        loc = geolocator.geocode(location_name, timeout=10)

        #self.log.info('Your given location: %s', loc.address.encode('utf-8'))
        #self.log.info('lat/long/alt: %s %s %s', loc.latitude, loc.longitude, loc.altitude)

        return (loc.latitude, loc.longitude, loc.altitude)

    def _filter_ignored_pokemons(self, cell):
        process_ignore = False
        try:
            with open("./data/catch-ignore.yml", 'r') as y:
                ignores = yaml.load(y)['ignore']
                if len(ignores) > 0:
                    process_ignore = True
        except Exception, e:
            pass

        if process_ignore:
            #
            # remove any wild pokemon
            try:
                for p in cell['wild_pokemons'][:]:
                    pokemon_id = p['pokemon_data']['pokemon_id']
                    pokemon_name = filter(
                        lambda x: int(x.get('Number')) == pokemon_id,
                        self.pokemon_list)[0]['Name']

                    if pokemon_name in ignores:
                        cell['wild_pokemons'].remove(p)
            except KeyError:
                pass

            #
            # remove catchable pokemon
            try:
                for p in cell['catchable_pokemons'][:]:
                    pokemon_id = p['pokemon_id']
                    pokemon_name = filter(
                        lambda x: int(x.get('Number')) == pokemon_id,
                        self.pokemon_list)[0]['Name']

                    if pokemon_name in ignores:
                        cell['catchable_pokemons'].remove(p)
            except KeyError:
                pass

    def heartbeat(self):
        self.api.get_player()
        self.api.get_hatched_eggs()
        self.api.get_inventory()
        self.api.check_awarded_badges()
        self.api.call()
