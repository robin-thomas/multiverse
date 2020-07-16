import fetch from 'node-fetch';

const Audio = {
  init: () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new window.AudioContext();
    const created = new Date();

    const node = context.createScriptProcessor(2048, 1, 1);

    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const gainNode = context.createGain();

    return { context, analyser, gainNode, dataArray, node, created };
  },

  loadSong: async (url) => {
    try {
      const _response = await fetch(url);

      let played = 0;
      let playing = false;

      const start = new Date();
      const response = _response.clone();
      const total = parseInt(response.headers.get('content-length'));

      const stream = new ReadableStream({
        start(controller) {
          const reader = response.body.getReader();

          const read = () => {
            reader
              .read()
              .then(({ done, value }) => {
                if (done) {
                  playing = true;
                  reader.releaseLock();
                  controller.close();
                  return;
                }

                played += value.byteLength;
                controller.enqueue(value);

                read();
              })
              .catch((err) => {
                console.error(err);
                controller.error(err);
              });
          };

          read();
        },
      });

      return new Response(stream).arrayBuffer();
    } catch (err) {
      throw err;
    }
  },
};

export default Audio;
