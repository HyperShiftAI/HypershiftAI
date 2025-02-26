"use client"
import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { AiOutlineQrcode } from "react-icons/ai";

export default function CryptoSwap() {
  const [gigaAmount, setGigaAmount] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-7xl bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        
        <div className="flex justify-between text-gray-400 text-sm mb-4 border-b border-gray-700 pb-2">
          <span className="flex items-center">🔒 1 GIGA = 2,830.1362 PEPE</span>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-400 text-sm">YOU SEND</p>
            <p className="text-xl font-semibold">GIGA <span className="text-gray-400">$0.03</span></p>
            <p className="text-gray-400 text-sm">Gigachad</p>
            <span className="bg-blue-500 px-2 py-1 text-xs rounded">SOLANA NETWORK</span>
          </div>
          <img src="/giga-logo.png" alt="GIGA" className="w-12 h-12" />
        </div>

        <div className="text-center my-2">
          <FaExchangeAlt className="text-2xl text-gray-400" />
        </div>

        <div className="bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-400 text-sm">YOU RECEIVE</p>
            <p className="text-xl font-semibold">PEPE <span className="text-gray-400">$0.000009</span></p>
            <p className="text-gray-400 text-sm">Pepe</p>
            <span className="bg-blue-500 px-2 py-1 text-xs rounded">ETHEREUM NETWORK</span>
          </div>
          <img src="/pepe-logo.png" alt="PEPE" className="w-12 h-12" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">RECEIVING ADDRESS</label>
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <input
              type="text"
              placeholder="Your PEPE (Ethereum) address"
              className="flex-1 bg-transparent outline-none text-white px-2"
            />
            <button className="bg-blue-500 px-4 py-1 rounded text-sm">GET ADDRESS FROM WALLET</button>
            <AiOutlineQrcode className="ml-2 text-xl text-gray-400" />
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-lg font-semibold">
          SHIFT
        </button>
      </div>
    </div>
  );
}
