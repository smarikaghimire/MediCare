import dbConnect from "@/lib/database";
import ContactForm from "@/lib/models/ContactForm";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please provide name, email and message",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const contactForm = await ContactForm.create({ name, email, message });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
        data: contactForm,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);

    let status = 500;
    let errorMsg = error.message;

    if (error.name === "ValidationError") {
      status = 400;
      errorMsg = Object.values(error.errors).map((err) => err.message);
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
        error: errorMsg,
      }),
      {
        status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
