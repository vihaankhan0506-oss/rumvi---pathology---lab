const SUPABASE_URL = "https://swvnsamzoasocqhyrunu.supabase.co";

const SUPABASE_KEY = "sb_publishable_D4vwmhaWFKRTuojpTlGV6Q_h-OAlAiZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
document.getElementById("bookingForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = this.querySelector('input[placeholder="Enter patient name"]').value;
    const mobile = this.querySelector('input[placeholder="Enter mobile number"]').value;

    const selects = this.querySelectorAll("select");
    const service = selects[0].value;
    const sampleCollection = selects.length > 1 ? selects[1].value : "Not specified";

    const date = this.querySelector('input[type="date"]').value;
    const information = this.querySelector("textarea").value;

    const bookingCode =
        "RUMVI-" +
        new Date().getFullYear() +
        "-" +
        Date.now().toString().slice(-6);

    const { error } = await supabaseClient
        .from("bookings")
        .insert([
            {
                booking_code: bookingCode,
                patient_name: name,
                mobile: mobile,
                test: service,
                preferred_date: date,
                sample_collection: sampleCollection,
                additional_info: information,
                status: "Pending"
            }
        ]);

    if (error) {
        console.error(error);
        alert("Booking save nahi ho paayi. Please try again.");
        return;
    }

    alert(
        "Booking successfully submitted!\\n\\n" +
        "Your Booking ID: " + bookingCode
    );

    this.reset();

});
document.querySelector("#reports .report-box button").addEventListener("click", function() {

    const reportId = document.querySelector(
        '#reports input[placeholder="Patient ID / Report ID"]'
    ).value;

    const mobile = document.querySelector(
        '#reports input[placeholder="Mobile Number"]'
    ).value;

    if (reportId === "" || mobile === "") {
        alert("Please enter Patient ID / Report ID and Mobile Number.");
        return;
    }

    alert("Report search feature is ready. Online report system will be connected later.");

});