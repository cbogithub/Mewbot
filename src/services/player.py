
class PlayerService():
    def __init__():


    def drop_item(self, item_id, count):
        self.api.recycle_inventory_item(item_id=item_id, count=count)
        inventory_req = self.api.call()

        # Example of good request response
        #{'responses': {'RECYCLE_INVENTORY_ITEM': {'result': 1, 'new_count': 46}}, 'status_code': 1, 'auth_ticket': {'expire_timestamp_ms': 1469306228058L, 'start': '/HycFyfrT4t2yB2Ij+yoi+on778aymMgxY6RQgvrGAfQlNzRuIjpcnDd5dAxmfoTqDQrbz1m2dGqAIhJ+eFapg==', 'end': 'f5NOZ95a843tgzprJo4W7Q=='}, 'request_id': 8145806132888207460L}
        return inventory_req

    def get_inventory(self):
        self.api.get_inventory()
        response = self.api.call()
        inventory = list()

        if 'responses' in response:
            if 'GET_INVENTORY' in response['responses']:
                if 'inventory_delta' in response['responses']['GET_INVENTORY']:
                    if 'inventory_items' in response['responses'][
                            'GET_INVENTORY']['inventory_delta']:
                        for item in response['responses']['GET_INVENTORY'][
                                'inventory_delta']['inventory_items']:
                            if not 'inventory_item_data' in item:
                                continue
                            if not 'item' in item['inventory_item_data']:
                                continue
                            if not 'item_id' in item['inventory_item_data'][
                                    'item']:
                                continue
                            if not 'count' in item['inventory_item_data'][
                                    'item']:
                                continue
                            inventory.append(item['inventory_item_data'][
                                'item'])

        return inventory

    def pokeball_inventory(self):
        self.api.get_player().get_inventory()

        inventory_req = self.api.call()
        inventory_dict = inventory_req['responses']['GET_INVENTORY']['inventory_delta']['inventory_items']

        user_web_inventory = 'web/inventory-%s.json' % (self.config.username)
        with open(user_web_inventory, 'w') as outfile:
            json.dump(inventory_dict, outfile)

        # get player balls stock
        # ----------------------
        balls_stock = {1: 0, 2: 0, 3: 0, 4: 0}

        for item in inventory_dict:
            try:
                # print(item['inventory_item_data']['item'])
                item_id = item['inventory_item_data']['item']['item_id']
                item_count = item['inventory_item_data']['item']['count']

                if item_id == Item.ITEM_POKE_BALL.value:
                    # print('Poke Ball count: ' + str(item_count))
                    balls_stock[1] = item_count
                if item_id == Item.ITEM_GREAT_BALL.value:
                    # print('Great Ball count: ' + str(item_count))
                    balls_stock[2] = item_count
                if item_id == Item.ITEM_ULTRA_BALL.value:
                    # print('Ultra Ball count: ' + str(item_count))
                    balls_stock[3] = item_count
            except:
                continue

        return balls_stock

    def item_inventory_count(self, id):
        self.api.get_player().get_inventory()

        inventory_req = self.api.call()
        inventory_dict = inventory_req['responses'][
            'GET_INVENTORY']['inventory_delta']['inventory_items']

        item_count = 0

        for item in inventory_dict:
            try:
                if item['inventory_item_data']['item']['item_id'] == int(id):
                    item_count = item[
                        'inventory_item_data']['item']['count']
            except:
                continue

        return item_count

        def get_inventory_count(self, what):
            self.api.get_inventory()
            response_dict = self.api.call()
            if 'responses' in response_dict:
                if 'GET_INVENTORY' in response_dict['responses']:
                    if 'inventory_delta' in response_dict['responses'][
                            'GET_INVENTORY']:
                        if 'inventory_items' in response_dict['responses'][
                                'GET_INVENTORY']['inventory_delta']:
                            pokecount = 0
                            itemcount = 1
                            for item in response_dict['responses'][
                                    'GET_INVENTORY']['inventory_delta'][
                                        'inventory_items']:
                                #print('item {}'.format(item))
                                if 'inventory_item_data' in item:
                                    if 'pokemon_data' in item[
                                            'inventory_item_data']:
                                        pokecount = pokecount + 1
                                    if 'item' in item['inventory_item_data']:
                                        if 'count' in item['inventory_item_data'][
                                                'item']:
                                            itemcount = itemcount + \
                                                item['inventory_item_data'][
                                                    'item']['count']
            if 'pokemon' in what:
                return pokecount
            if 'item' in what:
                return itemcount

            return '0'

    def get_player_info(self):
        self.api.get_inventory()
        response_dict = self.api.call()
        if 'responses' in response_dict:
            if 'GET_INVENTORY' in response_dict['responses']:
                if 'inventory_delta' in response_dict['responses'][
                        'GET_INVENTORY']:
                    if 'inventory_items' in response_dict['responses'][
                            'GET_INVENTORY']['inventory_delta']:
                        pokecount = 0
                        itemcount = 1
                        for item in response_dict['responses'][
                                'GET_INVENTORY']['inventory_delta'][
                                    'inventory_items']:
                            #print('item {}'.format(item))
                            if 'inventory_item_data' in item:
                                if 'player_stats' in item[
                                        'inventory_item_data']:
                                    playerdata = item['inventory_item_data'][
                                        'player_stats']

                                    nextlvlxp = (
                                        int(playerdata.get('next_level_xp', 0)) -
                                        int(playerdata.get('experience', 0)))

                                    if 'level' in playerdata:
                                        logger.log(
                                            '[#] -- Level: {level}'.format(
                                                **playerdata))

                                    if 'experience' in playerdata:
                                        logger.log(
                                            '[#] -- Experience: {experience}'.format(
                                                **playerdata))
                                        logger.log(
                                            '[#] -- Experience until next level: {}'.format(
                                                nextlvlxp))

                                    if 'pokemons_captured' in playerdata:
                                        logger.log(
                                            '[#] -- Pokemon Captured: {pokemons_captured}'.format(
                                                **playerdata))

                                    if 'poke_stop_visits' in playerdata:
                                        logger.log(
                                            '[#] -- Pokestops Visited: {poke_stop_visits}'.format(
                                                **playerdata))
