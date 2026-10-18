const form = document.querySelector(".appointment-form");
const status = document.querySelector(".form-status");
const submitButton = form.querySelector(".form-submit");
const submitButtonLabel = submitButton.firstChild;
const submissionEndpoint = "POST http://localhost:3000/api/v1/forms/frm_bfb9d29425b3574f27/submissions";
const submissionToken = "frm_bfb9d29425b3574f27";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const firstName = form.elements.firstName.value.trim();
  submitButton.disabled = true;
  submitButtonLabel.textContent = "Sending request ";
  status.textContent = "";

  try {
    const response = await fetch(submissionEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${submissionToken}`,
      },
      body: JSON.stringify({
        firstName,
        lastName: form.elements.lastName.value.trim(),
        email: form.elements.email.value.trim(),
        service: form.elements.service.value,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Use the HTTP status when the API does not return JSON.
      }
      throw new Error(errorMessage);
    }

    status.textContent = `Thanks, ${firstName}! We'll be in touch within one business day.`;
    form.reset();
  } catch (error) {
    status.textContent = error instanceof TypeError
      ? "We couldn't connect to the appointment service. Please try again or call us directly."
      : `We couldn't submit your request: ${error.message}`;
  } finally {
    submitButton.disabled = false;
    submitButtonLabel.textContent = "Request an appointment ";
  }
});
