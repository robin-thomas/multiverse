import { ethers } from 'ethers';

const Ethers = {
  /**
   * create a new ethers provider (returns metamask if already injected)
   *
   * @returns {Object} ethers provider
   */
  getProvider: async (ethersProvider = null) => {
    if (ethersProvider !== null) {
      return ethersProvider;
    }

    if (typeof window !== 'undefined' && window.ethereum !== undefined) {
      // TODO: enable only on mainnet network.
      window.ethereum.autoRefreshOnNetworkChange = false;
      await window.ethereum.enable();
      ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      throw new Error('No metamask detected!');
    }

    return ethersProvider;
  },

  /**
   * returns ethers signer
   *
   * @returns {Object} ethers signer
   */
  getSigner: async (ethersProvider = null) => {
    try {
      return (await Ethers.getProvider(ethersProvider)).getSigner();
    } catch (err) {
      return null;
    }
  },

  /**
   * checks if an address is valid
   *
   * @param {string} address
   * @returns {Boolean} returns true if input is an address
   */
  isAddress: (address) => {
    try {
      ethers.utils.getAddress(address);
      return true;
    } catch (err) {
      return false;
    }
  },

  /**
   * return the address based on provider
   *
   * @param {Object} ethersProvider
   * @returns {string} returns account address
   */
  getAccount: async (ethersProvider = null) => {
    return await (await Ethers.getSigner(ethersProvider)).getAddress();
  },
};

export default Ethers;
