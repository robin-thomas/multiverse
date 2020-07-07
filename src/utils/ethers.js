import { ethers } from 'ethers';

const Ethers = {
  /**
   * create a new ethers provider (returns metamask if already injected)
   *
   * @returns {Object} ethers provider
   */
  getProvider: (ethersProvider = null) => {
    if (ethersProvider !== null) {
      return ethersProvider;
    }

    if (typeof window !== 'undefined' && window.ethereum !== undefined) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    }

    return ethersProvider;
  },

  /**
   * returns ethers signer
   *
   * @returns {Object} ethers signer
   */
  getWallet: (ethersProvider = null) => {
    try {
      return Ethers.getProvider(ethersProvider).getSigner();
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
    return await Ethers.getWallet(ethersProvider).getAddress();
  },
};

export default Ethers;
