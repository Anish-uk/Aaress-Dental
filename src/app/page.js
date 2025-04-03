"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Info,
  Phone,
  User,
  RefreshCw,
  Users,
  Calendar,
  Star,
  MessageSquare,
  ChevronRight,
  Clock,
  MapPin,
  Mail,
  Shield,
  Award,
} from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
              <Star className="text-blue-600 w-6 h-6 mr-2" />
              Customer Feedback Portal
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Manage and collect patient feedback to improve dental services
            </p>
          </div>

          <button
            onClick={handleCallAll}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm mt-6 md:mt-0 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200"
            disabled={callAllLoading}
          >
            {callAllLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Call All Customers</span>
              </>
            )}
          </button>
        </header>

        {callAllResult && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-center text-blue-800 text-sm flex items-center justify-center">
            {callAllResult.error ? (
              <>
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                <span>{`Error: ${callAllResult.error}`}</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 mr-2 text-blue-600" />
                <span>Successfully initiated calls to all customers.</span>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            title="Total Customers"
            value={customers.length}
            loading={loadingData}
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-green-600" />}
            title="Feedback Collected"
            value={customers.filter((c) => c.fields?.Feedback).length}
            loading={loadingData}
          />
          <StatCard
            icon={<Phone className="w-5 h-5 text-purple-600" />}
            title="Calls Made"
            value="24"
            loading={loadingData}
          />
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mr-3" />
            <p className="text-gray-600">Loading customer data...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="mr-2 w-5 h-5 text-blue-600" />
                Customer Directory
              </h2>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  {customers.length} records
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer.fields} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ icon, title, value, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{title}</p>
          {loading ? (
            <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Star className="text-blue-600 w-6 h-6" />
          <h1 className="text-2xl font-bold text-blue-800">Aaress Dental</h1>
        </div>
        <div className="flex items-center flex-wrap justify-center gap-4 md:gap-6">
          <Link
            href="/"
            className="flex items-center text-gray-700 hover:text-blue-700 transition-colors text-sm group"
          >
            <Home className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center text-gray-700 hover:text-blue-700 transition-colors text-sm group"
          >
            <Info className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
            <span>About</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center text-gray-700 hover:text-blue-700 transition-colors text-sm group"
          >
            <Phone className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
            <span>Contact</span>
          </Link>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5 duration-200">
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Star className="text-blue-400 w-5 h-5 mr-2" />
              <span className="font-bold text-lg">Aaress Dental Clinic</span>
            </div>
            <p className="text-gray-400 text-sm">
              Providing quality dental care and patient satisfaction since 2005.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                <span>123 Dental Street, Medical City</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span>contact@aaressdental.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-lg">Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span>Saturday: 10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Aaress Dental. All rights
            reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 transform hover:-translate-y-1">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
        <h2 className="font-medium text-gray-800 truncate flex items-center">
          <User className="w-4 h-4 mr-2 text-blue-600" />
          {customer.Name || "Unnamed Customer"}
        </h2>
        <button
          onClick={handleCall}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
            callLoading
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
          disabled={callLoading}
        >
          {callLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Calling...</span>
            </>
          ) : (
            <>
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
          <span className="font-medium">
            {customer.PhoneNumber || "No phone number"}
          </span>
        </div>

        {customer.Feedback && (
          <div className="mt-3 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start">
              <MessageSquare className="w-3.5 h-3.5 mr-2 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Feedback:
                </p>
                <p className="text-sm text-gray-700">{customer.Feedback}</p>
              </div>
            </div>
          </div>
        )}

        {callResult && (
          <div
            className={`mt-3 px-3 py-2 rounded-lg text-xs flex items-center ${
              callResult.error
                ? "bg-red-50 text-red-700 border border-red-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
          >
            {callResult.error ? (
              <>
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                <span>{callResult.error}</span>
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5 mr-1.5" />
                <span>Call initiated successfully</span>
              </>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
          <Link
            href={`/customer/${customer.id}`}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            View Details
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
