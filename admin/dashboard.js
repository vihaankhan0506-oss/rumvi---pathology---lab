const SUPABASE_URL = "https://swvnsamzoasocqhyrunu.supabase.co";

const SUPABASE_KEY = "sb_publishable_D4vwmhaWFKRTuojpTlGV6Q_h-OAlAiZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadBookings() {

    const bookingsList = document.getElementById("bookingsList");

    const { data, error } = await supabaseClient
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        bookingsList.innerHTML =
            "<p class='empty'>Unable to load bookings.</p>";
        return;
    }

    if (!data || data.length === 0) {
        bookingsList.innerHTML =
            "<p class='empty'>No bookings available yet.</p>";
        return;
    }

    bookingsList.innerHTML = "";

    data.forEach(function(booking) {

        const bookingCard = document.createElement("div");

        bookingCard.className = "booking-card";

        bookingCard.innerHTML = `
            <h3>${booking.booking_code}</h3>

            <p><strong>Patient Name:</strong> ${booking.patient_name}</p>

            <p><strong>Mobile:</strong> ${booking.mobile}</p>

            <p><strong>Test:</strong> ${booking.test}</p>

            <p><strong>Preferred Date:</strong> ${booking.preferred_date}</p>

            <p><strong>Sample Collection:</strong> ${booking.sample_collection}</p>

            <p><strong>Additional Information:</strong>
                ${booking.additional_info || "None"}
            </p>

            <p><strong>Status:</strong> ${booking.status}</p>
        `;

        bookingsList.appendChild(bookingCard);

    });
}


loadBookings();