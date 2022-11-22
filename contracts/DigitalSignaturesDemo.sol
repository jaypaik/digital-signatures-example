// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "erc721a/contracts/ERC721A.sol";

contract DigitalSignaturesDemo is Ownable, ERC721A {
  using ECDSA for bytes32;

  address public signer;

  constructor(address _signer) ERC721A("Alchemists", "GOLD") {
    setSigner(_signer);
  }

  function mint(uint256 _quantity, bytes calldata _signature) external payable {
    if (!_verifySignature(msg.sender, _signature)) {
      revert InvalidSignature();
    }
    _safeMint(msg.sender, _quantity);
  }

  function setSigner(address _signer) public onlyOwner {
    signer = _signer;
  }

  function _verifySignature(address _addr, bytes calldata _signature)
    internal
    view
    returns (bool _isValid)
  {
    bytes32 digest = keccak256(
      abi.encodePacked(
        "\x19Ethereum Signed Message:\n32",
        keccak256(abi.encode(_addr))
      )
    );
    _isValid = signer == digest.recover(_signature);
  }

  error InvalidSignature();
}
