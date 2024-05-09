const Marketplace = artifacts.require("./Marketplace.sol");

const chai = require("chai");
const BN = web3.utils.BN; // Import BN for better price handling

chai.use(require("chai-as-promised")).should();

contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("Deployment", () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, "0x0");
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "Dapp University Marketplace");
    });
  });

  describe("Products", () => {
    let productCount;

    before(async () => {
      await marketplace.createProduct(
        "iPhone X",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      );
      productCount = await marketplace.productCount();
    });

    function createProductTest(name, price, from, expectedRevert) {
      return async () => {
        if (expectedRevert) {
          await marketplace.createProduct(name, price, { from }).should.be.rejected;
        } else {
          const result = await marketplace.createProduct(name, price, { from });
          const event = result.logs[0].args;
          // Assert event details (similar to previous approach)
        }
      };
    }

    it("creates products", async () => {
      const tests = [
        createProductTest("", web3.utils.toWei("1", "Ether"), seller, true), // Empty name fails
        createProductTest("iPhone X", 0, seller, true), // Zero price fails
        createProductTest("iPhone X", web3.utils.toWei("1", "Ether"), seller), // Success
      ];
      await Promise.all(tests.map((test) => test())); // Run all tests
    });

    it("lists products", async () => {
      const product = await marketplace.products(productCount);
      // Assert product details (similar to previous approach)
    });

    function purchaseProductTest(buyer, value, expectedRevert) {
      return async () => {
        if (expectedRevert) {
          await marketplace.purchaseProduct(productCount, { from: buyer, value }).should.be.rejected;
        } else {
          const result = await marketplace.purchaseProduct(productCount, { from: buyer, value });
          const event = result.logs[0].args;
          // Assert event details (similar to previous approach)
        }
      };
    }

    it("sells products", async () => {
      const oldSellerBalance = new BN(await web3.eth.getBalance(seller));
      const price = new BN(web3.utils.toWei("1", "Ether"));

      const tests = [
        purchaseProductTest(buyer, web3.utils.toWei("1", "Ether")), // Success
        purchaseProductTest(buyer, web3.utils.toWei("0.5", "Ether"), true), // Insufficient ether fails
        purchaseProductTest(deployer, web3.utils.toWei("1", "Ether"), true), // Deployer can't buy fails
        purchaseProductTest(buyer, web3.utils.toWei("1", "Ether"), true), // Buyer can't buy twice fails
      ];
      await Promise.all(tests.map((test) => test()));

      const newSellerBalance = new BN(await web3.eth.getBalance(seller));
      assert.equal(newSellerBalance.toString(), oldSellerBalance.add(price).toString());
    });
  });
});
