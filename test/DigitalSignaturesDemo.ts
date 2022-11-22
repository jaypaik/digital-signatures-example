import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {arrayify, defaultAbiCoder, keccak256} from "ethers/lib/utils";
import {ethers} from "hardhat";

describe("DigitalSignaturesDemo", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const DigitalSignaturesDemo = await ethers.getContractFactory(
      "DigitalSignaturesDemo",
    );
    const contract = await DigitalSignaturesDemo.deploy(owner.address);
    return {
      contract,
      owner,
    };
  }

  async function generateSignature(signer: SignerWithAddress, address: string) {
    const messageToSign = keccak256(
      defaultAbiCoder.encode(["address"], [address]),
    );
    return await signer.signMessage(arrayify(messageToSign));
  }

  describe("Mint", function () {
    it("Should mint given quantity for a valid signature", async function () {
      const {owner, contract} = await loadFixture(deployContractFixture);
      const signature = await generateSignature(owner, owner.address);
      const quantity = 2;
      await contract.mint(quantity, signature);
      expect(await contract.balanceOf(owner.address)).to.equal(quantity);
    });
  });
});
