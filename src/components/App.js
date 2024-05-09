import React, { useState, useEffect } from "react";
import Web3 from "web3";
import logo from "../logo.png";
import "./App.css";
import Marketplace from "../abis/Marketplace.json";
import Navbar from "./Navbar";
import Main from "./Main";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3);
        } catch (error) {
          // Handle user rejection of permission request
          console.error("User denied account access:", error);
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }

      if (web3) {
        const networkId = await web3.eth.net.getId();
        const networkData = Marketplace.networks[networkId];
        if (networkData) {
          const marketplaceContract = web3.eth.Contract(
            Marketplace.abi,
            networkData.address
          );
          setMarketplace(marketplaceContract);

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const productCount = await marketplaceContract.methods
            .productCount()
            .call();
          setProductCount(productCount);

          const fetchedProducts = [];
          for (let i = 1; i <= productCount; i++) {
            const product = await marketplaceContract.methods.products(i).call();
            fetchedProducts.push(product);
          }
          setProducts(fetchedProducts);
        } else {
          window.alert("Marketplace contract not deployed to detected network.");
        }
      }
      setLoading(false);
    };

    loadBlockchainData();
  }, []);

  const createProduct = (name, price) => {
    setLoading(true);
    marketplace.methods
      .createProduct(name, price)
      .send({ from: account })
      .once("receipt", (receipt) => {
        setLoading(false);
      });
  };

  const purchaseProduct = (id, price) => {
    setLoading(true);
    marketplace.methods
      .purchaseProduct(id)
      .send({ from: account, value: price })
      .once("receipt", (receipt) => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {loading ? (
              <div id="loader" className="text-center">
                <p className="text-center">Loading...</p>
              </div>
            ) : (
              <Main
                products={products}
                createProduct={createProduct}
                purchaseProduct={purchaseProduct}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
