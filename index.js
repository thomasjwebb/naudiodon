/* Copyright 2019 Streampunk Media Ltd.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const EventEmitter = require('events');
const Timer = require('timers');
const portAudioBindings = require("bindings")("naudiodon.node");

var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler("crash.log");

exports.SampleFormat8Bit = 8;
exports.SampleFormat16Bit = 16;
exports.SampleFormat24Bit = 24;
exports.SampleFormat32Bit = 32;

exports.getDevices = portAudioBindings.getDevices;
exports.getHostAPIs = portAudioBindings.getHostAPIs;

function AudioIO(options, callback) {
  const audioIOAdon = new portAudioBindings.AudioIO(options);
  let ioStream = new EventEmitter();

  write = (response) => {
    console.log('response');
    console.log(response);
    readLoop(3);
  }
  
  readLoop = (timeout) => {
    Timer.setTimeout(() => {
      audioIOAdon.read((callbackInfo) => {
        if (callbackInfo) callback(callbackInfo, write);
        else readLoop(3);
      });
    }, timeout);
  }

  ioStream.start = () => {
    audioIOAdon.start();
    readLoop(3);
  }

  ioStream.quit = cb => {
  audioIOAdon.quit('WAIT', () => {
    if (typeof cb === 'function')
      cb();
    });
  }

  ioStream.abort = cb => {
    audioIOAdon.quit('ABORT', () => {
      if (typeof cb === 'function')
        cb();
    });
  }

  ioStream.on('close', () => {
    console.log('AudioIO close');
  });
  ioStream.on('finish', () => {
    console.log('AudioIO finish');
  });
  ioStream.on('end', () => console.log('AudioIO end'));
  ioStream.on('error', err => console.error('AudioIO:', err));

  return ioStream;
}
exports.AudioIO = AudioIO;
