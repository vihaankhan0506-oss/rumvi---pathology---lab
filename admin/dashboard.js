const SUPABASE_URL = "https://swvnsamzoasocqhyrunu.supabase.co";

const SUPABASE_KEY = "sb_publishable_D4vwmhaWFKRTuojpTlGV6Q_h-OAlAiZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Check whether Jiju is logged in
async function checkLogin() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        window.location.href = "login.html";
        return false;
    }

    const jijuUserId = "4f8f8dca-2559-4b6e-b825-bc950c1d59a9";

    if (data.session.user.id !== jijuUserId) {
        await supabaseClient.auth.signOut();
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

    <label for="status-${booking.id}">Change Status</label>
    <select id="status-${booking.id}" class="booking-status">
        <option value="Pending" ${booking.status === "Pending" ? "selected" : ""}>Pending</option>
        <option value="Confirmed" ${booking.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
        <option value="Completed" ${booking.status === "Completed" ? "selected" : ""}>Completed</option>
    </select>

    <button type="button" class="update-booking-btn"
        data-id="${booking.id}">
        Update Status
    </button>
`;
        bookingsList.appendChild(bookingCard);
        const updateButton = bookingCard.querySelector(".update-booking-btn");

updateButton.addEventListener("click", async function () {
    const statusSelect = bookingCard.querySelector(".booking-status");
    const newStatus = statusSelect.value;

    const { error } = await supabaseClient
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", booking.id);

    if (error) {
        console.error(error);
        alert("Status update nahi hua. Please try again.");
        return;
    }

    alert("Booking status updated successfully!");
    await loadBookings();
});

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

    const numbers = document.querySelectorAll(".card .number");

    if (numbers.length >= 4) {
        numbers[0].textContent = total;
        numbers[1].textContent = pending;
        numbers[2].textContent = confirmed;
        numbers[3].textContent = completed;
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

// Preview patient report
document.getElementById("previewReportBtn").addEventListener("click", function() {
    const name = document.getElementById("patientName").value;
    const age = document.getElementById("patientAge").value;
    const gender = document.getElementById("patientGender").value;
    const patientId = document.getElementById("patientId").value;
    const reportNumber = document.getElementById("reportNumber").value;
    const reportDate = document.getElementById("reportDate").value;
    const doctor = document.getElementById("referringDoctor").value;
    const sample = document.getElementById("sampleType").value;
    const test = document.getElementById("testName").value;
    const results = document.getElementById("testResults").value;
    const notes = document.getElementById("reportNotes").value;

    const preview = document.getElementById("reportPreview");
    const content = document.getElementById("previewContent");

    content.textContent =
        "RUMVI PATHOLOGY LAB\n\n" +
        "Patient Name: " + name + "\n" +
        "Age: " + age + "\n" +
        "Gender: " + gender + "\n" +
        "Patient ID: " + patientId + "\n" +
        "Report Number: " + reportNumber + "\n" +
        "Report Date: " + reportDate + "\n" +
        "Referring Doctor: " + doctor + "\n" +
        "Sample Type: " + sample + "\n\n" +
        "Test Name: " + test + "\n\n" +
        "Investigation Results:\n" + results + "\n\n" +
        "Report Notes:\n" + notes;

    preview.style.display = "block";
});
// Save patient report
document.getElementById("saveReportBtn").addEventListener("click", async function () {
    const patientName = document.getElementById("patientName").value.trim();
    const patientId = document.getElementById("patientId").value.trim();
    const reportNumber = document.getElementById("reportNumber").value.trim();
    const testName = document.getElementById("testName").value.trim();

    if (!patientName || !patientId || !reportNumber || !testName) {
        alert("Please fill Patient Name, Patient ID, Report Number and Test Name.");
        return;
    }

    const report = {
        patient_id: patientId,
        patient_name: patientName,
        report_number: reportNumber,
        report_date: document.getElementById("reportDate").value || null,
        age: document.getElementById("patientAge").value || null,
        gender: document.getElementById("patientGender").value || null,
        referring_doctor: document.getElementById("referringDoctor").value.trim() || null,
        sample_type: document.getElementById("sampleType").value.trim() || null,
        test_name: testName,
        test_results: document.getElementById("testResults").value.trim() || null,
        report_notes: document.getElementById("reportNotes").value.trim() || null
    };

    const saveButton = document.getElementById("saveReportBtn");
    saveButton.disabled = true;

    const { error } = await supabaseClient
        .from("reports")
        .insert([report]);

    saveButton.disabled = false;

    if (error) {
        console.error("Report save error:", error);
        alert("Report save nahi hui. Please check the details and try again.");
        return;
    }

    alert("Report successfully saved!");
});
startDashboard();