// app/api/callCustomer/route.js
import Airtable from "airtable";

export async function POST(req) {
  // Initialize Airtable with API key and base ID from environment variables
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );

  let customers;
  try {
    // Fetch records from "Customer" table with empty Feedback field
    const records = await base("Customer")
      .select({
        fields: ["PhoneNumber", "Name", "Feedback"],
        filterByFormula: '{Feedback} = ""',
      })
      .all();

    // Map records into a simplified customer object
    customers = records.map((record) => ({
      id: record.id,
      phone: record.fields.PhoneNumber,
      name: record.fields.Name || "Unnamed Customer",
    }));
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch data from Airtable",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Array to hold the result for each call
  const callResults = [];

  // For each customer, make a POST request to Vapi to initiate a call
  for (const customer of customers) {
    // Construct the payload for the Vapi API call
    const payload = {
      assistantId: "0882b608-4d88-4ce3-8b1a-02258db31041",
      customer: { number: customer.phone },
      name: "aaress Dental Feedback", // Must be ≤40 characters
      phoneNumber: {
        twilioAccountSid: "AC8d658708b307fd9065b92917d17b7cb9",
        twilioAuthToken: "541cd7c8c38930b9ac7b5caea81dc433",
        twilioPhoneNumber: "+19706605512",
      },
    };

    try {
      const res = await fetch("https://api.vapi.ai/call", {
        method: "POST",
        headers: {
          Authorization: "Bearer 57142fb1-17e8-413d-8387-af899da8fe86",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        callResults.push({
          customerId: customer.id,
          status: "failed",
          error: errorText,
        });
      } else {
        const callData = await res.json();
        callResults.push({
          customerId: customer.id,
          status: "success",
          call: callData,
        });
      }
    } catch (error) {
      callResults.push({
        customerId: customer.id,
        status: "failed",
        error: error.message,
      });
    }
  }

  return new Response(JSON.stringify({ results: callResults }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
