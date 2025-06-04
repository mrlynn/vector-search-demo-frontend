import React from "react";
import ProductCatalogWithoutSearch from "./components/ProductCatalogWithoutSearch";
import config from '../../config';

function App() {
  const apiUrl = config.apiUrl; // Replace with your actual backend URL

  return (
    <div className="App">
      {/* Presentation Slide for Product Catalog */}
      <ProductCatalogWithoutSearch apiUrl={apiUrl} />
    </div>
  );
}

export default App;
