const { Migrations } = artifacts.require("Migrations"); // Destructuring for conciseness

module.exports = async (deployer) => {
  await deployer.deploy(Migrations);

  // Optional: Add deployment tracking or logging
  console.log("Migrations contract deployed successfully!");
};
