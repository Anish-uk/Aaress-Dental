import Airtable from "airtable";

export async function GET(req) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );

  try {
    const records = await base("Customer")
      .select({
        fields: ["PhoneNumber", "Name", "Feedback"],
        filterByFormula: '{Feedback} = ""',
      })
      .all();

    const formattedRecords = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    return new Response(JSON.stringify(formattedRecords), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors and return an appropriate response
    return new Response(
      JSON.stringify({
        error: "Failed to fetch data from Airtable",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
