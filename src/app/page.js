"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [callAllLoading, setCallAllLoading] = useState(false);
  const [callAllResult, setCallAllResult] = useState(null);

  // Fetch customer records from your Airtable endpoint
  useEffect(() => {
    async function fetchCustomerRecords() {
      try {
        const res = await fetch("/api/airtable/customer");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
      setLoadingData(false);
    }
    fetchCustomerRecords();
  }, []);

  const handleCallAll = async () => {
    setCallAllLoading(true);
    setCallAllResult(null);
    try {
      const res = await fetch("/api/callCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No phone provided means all customers will be called
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setCallAllResult(data);
    } catch (error) {
      setCallAllResult({ error: error.message });
    }
    setCallAllLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Aaress Dental Clinic - Customer Feedback
        </h1>
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCallAll}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={callAllLoading}
          >
            {callAllLoading ? "Calling All..." : "Call All Customers"}
          </button>
        </div>
        {loadingData ? (
          <p className="text-center">Loading customers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer.fields} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Aaress Dental Clinic</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto px-4 py-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Aaress Dental Clinic. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

function CustomerCard({ customer }) {
  const [callLoading, setCallLoading] = useState(false);
  const [callResult, setCallResult] = useState(null);

  const handleCall = async () => {
    setCallLoading(true);
    setCallResult(null);
    try {
      const res = await fetch("/api/callCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: customer.PhoneNumber,
          name: customer.Name,
        }),
      });
      const data = await res.json();
      setCallResult(data);
    } catch (error) {
      setCallResult({ error: error.message });
    }
    setCallLoading(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {customer.Name || "Unnamed Customer"}
      </h2>
      <p className="text-gray-700 mb-2">
        <strong>Phone:</strong> {customer.PhoneNumber || "Not provided"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Feedback:</strong>{" "}
        {customer.Feedback ? customer.Feedback : "No feedback yet."}
      </p>
      <button
        onClick={handleCall}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={callLoading}
      >
        {callLoading ? "Calling..." : "Call Customer"}
      </button>
    </div>
  );
}
