"use client";
import React, { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_SIMPLESWAP_API_KEY;

const popularSymbols = ["ETH", "BTC", "SOL", "USDC", "USDT", "BNB"];

// Helper to filter + separate popular vs. others
function getFilteredCurrencies(currencies, searchQuery) {
  const query = searchQuery.toLowerCase();

  const filtered = currencies.filter((currency) => {
    const nameMatch = currency.name.toLowerCase().includes(query);
    const symbolMatch = currency.symbol.toLowerCase().includes(query);
    return nameMatch || symbolMatch;
  });

  const popular = filtered.filter((c) =>
    popularSymbols.includes(c.symbol.toUpperCase())
  );
  const others = filtered.filter(
    (c) => !popularSymbols.includes(c.symbol.toUpperCase())
  );

  return { popular, others };
}

const SwapApp = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");

  const [minMax, setMinMax] = useState({ min: 0, max: 0 });
  const [estimated, setEstimated] = useState(null);
  const [swapStatus, setSwapStatus] = useState("");
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Dropdown toggles
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Search queries
  const [searchQueryFrom, setSearchQueryFrom] = useState("");
  const [searchQueryTo, setSearchQueryTo] = useState("");

  // 1. Fetch currencies
  const fetchCurrencies = async () => {
    try {
      const response = await fetch(
        `https://api.simpleswap.io/get_all_currencies?api_key=${API_KEY}`
      );
      const data = await response.json();
      const currencyList = Array.isArray(data) ? data : data.result || [];
      setCurrencies(currencyList);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // 2. Default to ETH -> SOL
  useEffect(() => {
    if (currencies.length > 0) {
      const defaultFrom = currencies.find(
        (c) => c.symbol.toUpperCase() === "ETH"
      );
      const defaultTo = currencies.find(
        (c) => c.symbol.toUpperCase() === "SOL"
      );
      setFromCurrency(defaultFrom || currencies[0]);
      setToCurrency(
        defaultTo || (currencies.length > 1 ? currencies[1] : currencies[0])
      );
    }
  }, [currencies]);

  // 3. Fetch range
  const fetchRange = async () => {
    if (!fromCurrency || !toCurrency) return;
    try {
      const response = await fetch(
        `https://api.simpleswap.io/get_ranges?api_key=${API_KEY}&fixed=true&currency_from=${fromCurrency.symbol}&currency_to=${toCurrency.symbol}`
      );
      const data = await response.json();
      setMinMax({ min: data.min, max: data.max });
    } catch (error) {
      console.error("Error fetching range:", error);
      setMinMax({ min: 0, max: 0 });
    }
  };

  // 4. Fetch estimated
  const fetchEstimated = async () => {
    if (!fromCurrency || !toCurrency || !amount) {
      setEstimated(null);
      return;
    }
    try {
      const response = await fetch(
        `https://api.simpleswap.io/get_estimated?api_key=${API_KEY}&fixed=true&currency_from=${fromCurrency.symbol}&currency_to=${toCurrency.symbol}&amount=${amount}`
      );
      const data = await response.json();
      const numericEstimated = parseFloat(data);
      if (!isNaN(numericEstimated)) {
        setEstimated(numericEstimated);
      } else {
        setEstimated(null);
      }
    } catch (error) {
      console.error("Error fetching estimated amount:", error);
      setEstimated(null);
    }
  };

  // 5. Use effects
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchRange();
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchEstimated();
  }, [fromCurrency, toCurrency, amount]);

  // If no amount, default to min
  useEffect(() => {
    if (minMax.min && !amount) {
      setAmount(minMax.min);
    }
  }, [minMax.min, amount]);

  // 6. Handle swap
  const handleSwap = async () => {
    if (!amount || !addressTo) {
      setSwapStatus("Please enter both amount and recipient address.");
      return;
    }
    const orderData = {
      fixed: true,
      currency_from: fromCurrency.symbol,
      currency_to: toCurrency.symbol,
      amount: amount,
      address_to: addressTo,
      extra_id_to: "",
      user_refund_address: "",
      user_refund_extra_id: "",
    };
    try {
      const response = await fetch(
        `https://api.simpleswap.io/create_exchange?api_key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );
      const data = await response.json();
      if (data.success) {
        setSwapStatus("Swap Successful!");
      } else {
        setSwapStatus(
          data.description
            ? `Swap failed: ${data.description}`
            : "Swap failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Swap error:", error);
      setSwapStatus("Error occurred during swap.");
    }
  };

  // 7. Filtered lists for From & To
  const filteredFrom = getFilteredCurrencies(currencies, searchQueryFrom);
  const filteredTo = getFilteredCurrencies(currencies, searchQueryTo);

  // 8. Render
  if (loadingCurrencies) {
    return <div className="text-center p-4">Loading currencies...</div>;
  }
  if (!fromCurrency || !toCurrency) {
    return <div className="text-center p-4">No currencies available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          SimpleSwap Clone
        </h1>

        {/* FROM Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">From</label>
          <div className="relative inline-block text-left w-full">
            <button
              type="button"
              onClick={() => setShowFromDropdown((prev) => !prev)}
              className="inline-flex w-full justify-between items-center bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
            >
              <div className="flex items-center space-x-2">
                {fromCurrency?.image && (
                  <img
                    src={fromCurrency.image}
                    alt={fromCurrency.name}
                    className="h-5 w-5"
                  />
                )}
                <span>{fromCurrency?.name}</span>
              </div>
              <svg className="ml-2 h-4 w-4 text-gray-700" viewBox="0 0 20 20">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>

            {showFromDropdown && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                {/* Search bar */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-2 py-1 border rounded focus:outline-none"
                    value={searchQueryFrom}
                    onChange={(e) => setSearchQueryFrom(e.target.value)}
                  />
                </div>

                {/* List container */}
                <div className="max-h-64 overflow-auto">
                  {/* Popular heading */}
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Popular
                  </div>
                  {filteredFrom.popular.map((currency) => (
                    <button
                      key={currency.symbol}
                      onClick={() => {
                        setFromCurrency(currency);
                        setShowFromDropdown(false);
                        setSearchQueryFrom("");
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    >
                      {currency.image && (
                        <img
                          src={currency.image}
                          alt={currency.name}
                          className="h-5 w-5 mr-2"
                        />
                      )}
                      <span className="text-sm">
                        {currency.name} - {currency.symbol.toUpperCase()}
                      </span>
                    </button>
                  ))}

                  {/* Others heading */}
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Others
                  </div>
                  {filteredFrom.others.map((currency) => (
                    <button
                      key={currency.symbol}
                      onClick={() => {
                        setFromCurrency(currency);
                        setShowFromDropdown(false);
                        setSearchQueryFrom("");
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    >
                      {currency.image && (
                        <img
                          src={currency.image}
                          alt={currency.name}
                          className="h-5 w-5 mr-2"
                        />
                      )}
                      <span className="text-sm">
                        {currency.name} - {currency.symbol.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TO Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">To</label>
          <div className="relative inline-block text-left w-full">
            <button
              type="button"
              onClick={() => setShowToDropdown((prev) => !prev)}
              className="inline-flex w-full justify-between items-center bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500"
            >
              <div className="flex items-center space-x-2">
                {toCurrency?.image && (
                  <img
                    src={toCurrency.image}
                    alt={toCurrency.name}
                    className="h-5 w-5"
                  />
                )}
                <span>{toCurrency?.name}</span>
              </div>
              <svg className="ml-2 h-4 w-4 text-gray-700" viewBox="0 0 20 20">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>

            {showToDropdown && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                {/* Search bar */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full px-2 py-1 border rounded focus:outline-none"
                    value={searchQueryTo}
                    onChange={(e) => setSearchQueryTo(e.target.value)}
                  />
                </div>

                {/* List container */}
                <div className="max-h-64 overflow-auto">
                  {/* Popular heading */}
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Popular
                  </div>
                  {filteredTo.popular.map((currency) => (
                    <button
                      key={currency.symbol}
                      onClick={() => {
                        setToCurrency(currency);
                        setShowToDropdown(false);
                        setSearchQueryTo("");
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    >
                      {currency.image && (
                        <img
                          src={currency.image}
                          alt={currency.name}
                          className="h-5 w-5 mr-2"
                        />
                      )}
                      <span className="text-sm">
                        {currency.name} - {currency.symbol.toUpperCase()}
                      </span>
                    </button>
                  ))}

                  {/* Others heading */}
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Others
                  </div>
                  {filteredTo.others.map((currency) => (
                    <button
                      key={currency.symbol}
                      onClick={() => {
                        setToCurrency(currency);
                        setShowToDropdown(false);
                        setSearchQueryTo("");
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    >
                      {currency.image && (
                        <img
                          src={currency.image}
                          alt={currency.name}
                          className="h-5 w-5 mr-2"
                        />
                      )}
                      <span className="text-sm">
                        {currency.name} - {currency.symbol.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Amount <span className="text-sm text-gray-600">(Min: {minMax.min} - Max: {minMax.max})</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Send Address Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Send Address</label>
          <input
            type="text"
            value={addressTo}
            onChange={(e) => setAddressTo(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Estimated Amount Display */}
        {estimated !== null ? (
          <div className="mb-6">
            <p className="text-gray-700 font-medium">
              1 {fromCurrency.symbol} = {(estimated / (amount || 1)).toFixed(4)}{" "}
              {toCurrency.symbol}
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-700 font-medium">
              Exchange rate not available.
            </p>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded"
        >
          Swap
        </button>

        {/* Swap Status */}
        {swapStatus && (
          <p className="mt-6 text-center text-lg text-gray-800">
            {swapStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default SwapApp;
