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
    getAll: async (address) => {
      try {
        const [requests, responses] = await Promise.all([
          Message.threadRequest.getPosts(),
          Message.threadResponse.getPosts(),
        ]);

        const pendingRequests = requests
          .map((e) => JSON.parse(e.message))
          .filter((e) => e.friend === address);
        const completed = responses
          .map((e) => JSON.parse(e.message))
          .filter((e) => e.address === address)
          .map((e) => e.friend);

        return pendingRequests.filter((e) => !completed.includes(e.address));
      } catch (err) {
        throw err;
      }
    },

    /*
     * Create a new friendship request.
     */
    post: async (data) => {
      try {
        await Message.threadRequest.post(JSON.stringify(data));
      } catch (err) {
        throw err;
      }
    },
  },
};

export default Message;
