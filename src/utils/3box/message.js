import { app } from '../../../config.json';

const Message = {
  threadRequest: null,
  threadResponse: null,

  init: async (box) => {
    Message.threadRequest = await box.joinThread(`${app.name}-threadRequest`);
    Message.threadResponse = await box.joinThread(`${app.name}-threadResponse`);
  },

  request: {
    /*
     * Read by the friend to see all pending requests.
     */
    getAll: async (address, blocked = []) => {
      try {
        const [requests, responses] = await Promise.all([
          Message.threadRequest.getPosts(),
          Message.threadResponse.getPosts(),
        ]);

        const pendingRequests = requests
          .map((e) => e.message)
          .filter((e) => e.friend === address);
        const completed = responses
          .map((e) => e.message)
          .filter((e) => e.address === address)
          .map((e) => e.friend);

        return pendingRequests
          .filter((e) => !blocked.includes(e.address))
          .filter((e) => !completed.includes(e.address));
      } catch (err) {
        throw err;
      }
    },

    /*
     * Create a new friendship request.
     */
    post: async (data) => {
      try {
        await Message.threadRequest.post(data);
      } catch (err) {
        throw err;
      }
    },
  },

  response: {
    /*
     * Read by user to see all completed requests.
     */
    getAll: async (address) => {
      try {
        const [requests, responses] = await Promise.all([
          Message.threadRequest.getPosts(),
          Message.threadResponse.getPosts(),
        ]);

        const pendingRequests = requests
          .map((e) => e.message)
          .filter((e) => e.address === address)
          .map((e) => e.friend);
        const completedResponses = responses.filter(
          (e) => e.message.friend === address
        );

        return completedResponses.reduce((p, c) => {
          const completed = pendingRequests.includes(c.address);

          let status = 'pending';
          if (completed) {
            if (c.message.denied) {
              status = 'denied';
              delete c.message.denied;
            } else {
              status = 'ok';
            }
          }

          p.push({ ...c.message, status, timestamp: c.timestamp });

          return p;
        }, []);
      } catch (err) {
        throw err;
      }
    },
  },
};

export default Message;
