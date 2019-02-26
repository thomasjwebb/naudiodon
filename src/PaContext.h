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

#ifndef PACONTEXT_H
#define PACONTEXT_H

#include <napi.h>
#include <memory>
#include <mutex>
#include <condition_variable>

struct PaStreamParameters;

namespace streampunk {

class AudioOptions;
class Chunk;
class Chunks;

struct CallbackInformation {
  int blockSize;
};

class PaContext {
public:
  PaContext(Napi::Env env, Napi::Object inOptions, Napi::Object outOptions);
  ~PaContext();

  enum class eStopFlag : uint8_t { WAIT = 0, ABORT = 1 };

  bool hasInput() { return mInOptions ? true : false; }
  bool hasOutput() { return mOutOptions ? true : false; }

  void start(Napi::Env env);
  void stop(eStopFlag flag);

  void quit();

  void pushCallbackInfo(int blockSize); // change this to take a lambda so the updating is still happening under mutex lock
  CallbackInformation *pullCallbackInfo();

private:
  std::shared_ptr<AudioOptions> mInOptions;
  std::shared_ptr<AudioOptions> mOutOptions;
  void *mStream;
  std::mutex m;
  std::condition_variable cv;
  std::unique_ptr<CallbackInformation> mReadCallbackInfo;
  std::unique_ptr<CallbackInformation> mWriteCallbackInfo;
  bool writtenIsFresh;

  void setParams(Napi::Env env, bool isInput, 
                 std::shared_ptr<AudioOptions> options, 
                 PaStreamParameters &params, double &sampleRate, uint32_t &framesPerBuffer);
};

} // namespace streampunk

#endif
