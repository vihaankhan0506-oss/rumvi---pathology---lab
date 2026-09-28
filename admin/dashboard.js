const SUPABASE_URL = "https://swvnsamzoasocqhyrunu.supabase.co";

const SUPABASE_KEY = "sb_publishable_D4vwmhaWFKRTuojpTlGV6Q_h-OAlAiZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Check whether Jiju is logged in
async function checkLogin() {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}


// Load bookings
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

        updateStats([]);

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

    updateStats(data);
}


// Update dashboard numbers
function updateStats(bookings) {

    const total = bookings.length;

    const pending = bookings.filter(function(booking) {
        return booking.status === "Pending";
    }).length;

    const confirmed = bookings.filter(function(booking) {
        return booking.status === "Confirmed";
    }).length;

    const completed = bookings.filter(function(booking) {
        return booking.status === "Completed";
    }).length;


    const statCards = document.querySelectorAll(".stat-card");

    if (statCards.length >= 4) {

        statCards[0].querySelector("h2").textContent = total;

        statCards[1].querySelector("h2").textContent = pending;

        statCards[2].querySelector("h2").textContent = confirmed;

        statCards[3].querySelector("h2").textContent = completed;

    }
}


// Start dashboard
async function startDashboard() {

    const loggedIn = await checkLogin();

    if (!loggedIn) {
        return;
    }

    await loadBookings();

}


startDashboard();