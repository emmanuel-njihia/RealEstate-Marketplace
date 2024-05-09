import React, { useState } from 'react';
import './main.css';

const Main = ({ createProduct, purchaseProduct, products }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const priceInWei = window.web3.utils.toWei(productPrice.toString(), 'Ether');
    createProduct(productName, priceInWei);
    setProductName('');
    setProductPrice('');
  };

  return (
    <div id="content">
      <h1>Add Property</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mr-sm-2">
          <label htmlFor="productName">Property Description</label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group mr-sm-2">
          <label htmlFor="productPrice">Property Price (Eth)</label>
          <input
            id="productPrice"
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Property
        </button>
      </form>

      <h2>Buy Property</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price (Eth)</th>
            <th scope="col">Owner</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, key) => (
            <tr key={key}>
              <th scope="row">{product.id.toString()}</th>
              <td>{product.name}</td>
              <td>
                {window.web3.utils.fromWei(product.price.toString(), 'Ether')}
              </td>
              <td>{product.owner}</td>
              <td>
                {!product.purchased ? (
                  <button
                    className="buy-btn"
                    onClick={() => purchaseProduct(product.id, product.price)}
                  >
                    Buy
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Main;
