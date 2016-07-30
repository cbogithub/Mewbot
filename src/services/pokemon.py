# -*- coding: utf-8 -*-

from workers.pokemon import CatchWorker
from workers.pokemon import TransferWorker

class PokemonAction():
    def catch_pokemon(self, pokemon):
        worker       = CatchWorker(pokemon, self)
        return_value = worker.work()

        if return_value == CatchWorker.BAG_FULL:
            worker = TransferWorker(self)
            worker.work()

        return return_value
