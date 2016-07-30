<p align="center">
  <a href="">
    <img alt="Logo" src="https://www.brooklinelibrary.org/wp-content/uploads/2016/07/2000px-Pok%C3%A9_Ball.svg_-1.png" width="100">
  </a>
</p>

<p align="center">
  <a href="https://pokemongo-bot.herokuapp.com/"><img alt="Slack" src="https://pokemongo-bot.herokuapp.com/badge.svg"></a>
</p>

# Mewbot
The Pokemon Go Bot, baking with community.

## Table of Contents
- [Project Chat](#project-chat)
- [Features](#features)
- [TODO List](#todo-list)
- __Installation__
  - [Requirements](#requirements)
  - [Mac](#installation-mac)
  - [Linux](#installation-linux)
  - [Windows](#installation-windows)
- [Develop PokemonGo-Bot](develop-pokemonGo-bot)
- [Usage](#usage)
- [Docker Usage](#how-to-run-with-docker)
- [FAQ](#faq)
- [Credits](#credits)
- [Donation](#donation)

## Features
 * Search Fort (Spin Pokestop)
 * Catch Pokemon
 * Release low cp pokemon
 * Walking as you
 * Limit the step to farm specific area for pokestops
 * Use the ball you have to catch, don't if you don't have
 * Rudimentary IV Functionality filter
 * Auto switch mode (Full of item then catch, no ball useable then farm)
 * Ignore certain pokemon filter
 * Use superior ball types when necessary
 * When out of normal pokeballs, use the next type of ball unless there are less than 10 of that type, in which case switch to farm mode
 * Drop items when bag is full (In Testing, Document contribute needed)
 * Pokemon catch filter (In Testing, Document contribute needed)
 * Google Map API key setup (Readme update needed)
 * Show all objects on map (In Testing)
 * Evolve pokemons (Code in, Need input, In Testing)

## Installation

### Requirements (click each one for install guide)

- [Python 2.7.x](http://docs.python-guide.org/en/latest/starting/installation/)
- [pip](https://pip.pypa.io/en/stable/installing/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [protobuf 3](https://github.com/google/protobuf) (OS Dependent, see below)

### Protobuf 3 installation

- OS X:  `brew update && brew install --devel protobuf`
- Windows: Download protobuf 3.0: [here](https://github.com/google/protobuf/releases/download/v3.0.0-beta-4/protoc-3.0.0-beta-4-win32.zip) and unzip `bin/protoc.exe` into a folder in your PATH.
- Linux: `apt-get install python-protobuf`

### Installation Linux
```
$ git clone https://github.com/PokemonGoF/PokemonGo-Bot
$ cd PokemonGo-Bot  
$ pip install -r requirements.txt
```

### Installation Mac
```
$ git clone https://github.com/PokemonGoF/PokemonGo-Bot
$ cd PokemonGo-Bot
$ pip install -r requirements.txt
```

### Installation Windows
On Windows, you will need to install PyYaml through the installer and not through requirements.txt.

#### Windows vista, 7, 8:
Go to : http://pyyaml.org/wiki/PyYAML , download the right version for your pc and install it

#### Windows 10:
Go to [this](http://www.lfd.uci.edu/~gohlke/pythonlibs/#pyyaml) page and download: PyYAML-3.11-cp27-cp27m-win32.whl   
(If running 64-bit python or if you get a 'not a supported wheel on this platform' error,
download the 64 bit version instead: PyYAML-3.11-cp27-cp27m-win_amd64.whl )

```
$ cd download-directory
$ pip install PyYAML-3.11-cp27-cp27m-win32.whl
// if you needed to download the 64-bit version)
// (replace PyYAML-3.11-cp27-cp27m-win32.whl with PyYAML-3.11-cp27-cp27m-win_amd64.whl
```

Right after :

```
$ git clone https://github.com/PokemonGoF/PokemonGo-Bot
$ cd PokemonGo-Bot  
$ pip install -r requirements.txt
```

### Google Maps API (in development)
Google Maps API: a brief guide to your own key

This project uses Google Maps. There's one map coupled with the project, but as it gets more popular we'll definitely hit the rate-limit making the map unusable. That said, here's how you can get your own and replace ours:

1. Navigate to this [page](https://console.developers.google.com/flows/enableapi?apiid=maps_backend,geocoding_backend,directions_backend,distance_matrix_backend,elevation_backend,places_backend&keyType=CLIENT_SIDE&reusekey=true)
2. Select 'Create a project' in the dropdown menu.
3. Wait an eternity.
4. Click 'Create' on the next page (optionally, fill out the info)
5. Copy the API key that appears.
6. After the code done, will update here how to replace.

## Update
To update your project do: `git pull` in the project folder

## Usage

---------
## Contributors
 * Leaklessgfy
 
-------
## Credits
- [tejado](https://github.com/tejado) many thanks for the API
- [Mila432](https://github.com/Mila432/Pokemon_Go_API) for the login secrets
- [elliottcarlson](https://github.com/elliottcarlson) for the Google Auth PR
- [AeonLucid](https://github.com/AeonLucid/POGOProtos) for improved protos
- [AHAAAAAAA](https://github.com/AHAAAAAAA/PokemonGo-Map) for parts of the s2sphere stuff

<p align="center">
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WQUXDC54W6EVY"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"></a>
</p>
