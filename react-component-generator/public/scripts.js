document.getElementById('renameForm').addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get references to DOM elements
    const projectNameInput = document.getElementById('projectName');
    const instructionInput = document.getElementById('instruction');
    const loader = document.getElementById('loader');
    const submitButton = document.getElementById('submit-button');

    // Disable form inputs and hide submit button
    projectNameInput.disabled = true;
    instructionInput.disabled = true;
    submitButton.style.display = "none";

    // Show loader
    loader.style.display = "block";

    // Get values from input fields
    const projectName = projectNameInput.value;
    const instruction = instructionInput.value;

    // Create FormData object
    const form = new FormData();
    form.append('projectName', projectName);
    form.append('instruction', instruction);

    // Send data to server
    try {
        const response = await fetch('/submit', {
            method: 'POST',
            body: form,
        });

        if (response.ok) {
            alert('File saved to Download Folder');
        } else {
            alert('An error occurred while executing the script.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while executing the script.');
    } finally {
        // Hide loader, enable form inputs, and show submit button
        loader.style.display = "none";
        projectNameInput.disabled = false;
        instructionInput.disabled = false;
        submitButton.style.display = "block";
    }
});
