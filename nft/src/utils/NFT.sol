//SPDX-License-Identifier: MIT

pragma solidity =0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage{
    constructor(string memory name, string memory symbol, uint number, string memory uri) ERC721 (name, symbol) {
        _safeMint(msg.sender, number);
        _setTokenURI(number, uri);
    }
}