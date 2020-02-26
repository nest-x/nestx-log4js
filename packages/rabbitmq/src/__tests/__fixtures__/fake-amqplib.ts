import { EventEmitter } from 'events';
import * as sinon from 'sinon';

export class FakeAMQP {
  private connection;
  private url;
  private failConnections;
  private deadServers;

  constructor() {
    this.reset();
  }

  kill() {
    const err = new Error('Died in a fire');
    this.connection.emit('error', err);
    this.connection.emit('close', err);
  }

  simulateRemoteClose() {
    this.connection.emit('close', new Error('Connection closed'));
  }

  simulateRemoteBlock() {
    this.connection.emit('blocked', new Error('Connection blocked'));
  }

  simulateRemoteUnblock() {
    this.connection.emit('unblocked');
  }

  connect() {}

  reset() {
    this.connection = null;
    this.url = null;
    this.failConnections = false;
    this.deadServers = [];
    this.connect = sinon.spy((url) => {
      if (this.failConnections) {
        return Promise.reject(new Error('No'));
      }

      let allowConnection = true;
      this.deadServers.forEach((deadUrl) => {
        if (url.startsWith(deadUrl)) {
          allowConnection = false;
        }
      });
      if (!allowConnection) {
        return Promise.reject(new Error(`Dead server ${url}`));
      }

      this.connection = new exports.FakeConnection(url);
      return Promise.resolve(this.connection);
    });
  }
}

export class FakeConfirmChannel extends EventEmitter {
  constructor() {
    super();
    this.publish = sinon.spy((exchange, routingKey, content, options, callback) => {
      this.emit('publish', content);
      callback(null);
      return true;
    });

    this.sendToQueue = sinon.spy((queue, content, options, callback) => {
      this.emit('sendToQueue', content);
      callback(null);
      return true;
    });

    this.ack = sinon.spy(function(message, allUpTo) {});

    this.ackAll = sinon.spy(function() {});

    this.nack = sinon.spy(function(message, allUpTo, requeue) {});

    this.nackAll = sinon.spy(function(requeue) {});

    this.assertQueue = sinon.spy(function(queue, options) {});

    this.bindQueue = sinon.spy(function(queue, source, pattern, args) {});

    this.assertExchange = sinon.spy(function(exchange, type, options) {});

    this.close = sinon.spy(() => this.emit('close'));
  }

  publish() {}
  ack() {}
  ackAll() {}
  nack() {}
  nackAll() {}
  assertQueue() {}
  bindQueue() {}
  sendToQueue() {}
  assertExchange() {}
  close() {}
}

export class FakeConnection extends EventEmitter {
  private url;
  private _closed;

  constructor(url) {
    super();
    this.url = url;
    this._closed = false;
  }

  createConfirmChannel() {
    return Promise.resolve(new exports.FakeConfirmChannel());
  }

  close() {
    this._closed = true;
    return Promise.resolve();
  }
}

export class FakeAmqpConnectionManager extends EventEmitter {
  private connected;
  private _currentConnection;

  constructor() {
    super();
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }

  simulateConnect() {
    const url = 'amqp://localhost';
    this._currentConnection = new exports.FakeConnection(url);
    this.connected = true;
    this.emit('connect', {
      connection: this._currentConnection,
      url
    });
  }

  simulateDisconnect() {
    this._currentConnection = null;
    this.connected = false;
    this.emit('disconnect', {
      err: new Error('Boom!')
    });
  }
}
