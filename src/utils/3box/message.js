import Request from './request';
import Response from './response';

class Message {
  constructor(box, address) {
    this.address = address;
    this.requestCallback = () => {};
    this.responseCallback = () => {};

    this.request = new Request(box);
    this.response = new Response(box);
  }

  setRequestCallback(callback) {
    this.requestCallback = callback;
    return this;
  }

  setResponseCallback(callback) {
    this.responseCallback = callback;
    return this;
  }

  async load(address) {
    const filter = { address, friend: address };

    await Promise.all([
      this.request.getAll(filter, this.callback.bind(this)),
      this.response.getAll(filter, this.callback.bind(this)),
    ]);
  }

  callback() {
    this.pending();
    this.completed();
  }

  pending() {
    if (this.request && this.response) {
      const requests = this.request.items.filter(
        (e) => e.message.friend.address === this.address
      );
      const completed = this.response.items
        .filter((e) => e.message.me.address === this.address)
        .map((e) => e.message.friend.address);

      const results = requests
        .filter((e) => !completed.includes(e.message.me.address))
        .map((e) => {
          return {
            id: e.postId,
            ...e.message,
            timestamp: e.timestamp,
          };
        })
        .reverse();

      this.requestCallback(results);
    }
  }

  completed() {
    if (this.request && this.response) {
      const requests = this.request.items.filter(
        (e) => e.message.me.address === this.address
      );
      const responses = this.response.items.filter(
        (e) => e.message.friend.address === this.address
      );

      console.log('requests', requests);
      console.log('responses', responses);

      const results = requests.reduce((p, c) => {
        const completed = responses.find(
          (e) => e.message.me.address === c.message.friend.address
        );

        let status = 'pending';
        if (completed) {
          if (completed.message.denied) {
            status = 'denied';
          } else {
            status = 'ok';
          }
        }

        p.unshift({
          id: c.postId,
          ...c.message,
          ...(status === 'ok'
            ? {
                nonce: completed.message.nonce,
                pubKey: completed.message.pubKey,
                encryptedKey: completed.message.encryptedKey,
              }
            : {}),
          ...(status === 'pending'
            ? {
                timestamp: c.timestamp,
              }
            : {
                timestamp: completed.timestamp,
                me: completed.message.friend,
                friend: completed.message.me,
              }),
          status,
        });

        return p;
      }, []);

      console.log('results', results);

      this.responseCallback(results);
    }
  }
}

export default Message;
