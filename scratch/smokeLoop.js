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

var portAudio = require('../index.js');

var sampleRate = 44100;

// console.log(portAudio.getDevices());

function callback(info, callback) {
  console.log('called!');
  console.log(info);
  callback(1);
}

// try {
var aio = new portAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: sampleRate,
    deviceId: 0
  },
  outOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: sampleRate,
    deviceId: 0
  },
}, callback);

aio.start();

process.on('SIGINT', aio.quit);

// // I feel like all this below shouldn't be necessary
// // ctrl+d to quit
process.stdin.resume();

// }
// catch(err) {
//   console.log(err);
// }