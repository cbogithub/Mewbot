#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

def some_function():
    socketio.emit('test', {'data': 42})

@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)

    if message == "hello":
        some_function()

if __name__ == '__main__':
    socketio.run(app)
