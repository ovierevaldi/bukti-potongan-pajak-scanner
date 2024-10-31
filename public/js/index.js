function handleFileChange(e) {
    const fileInput = e.target;
    const files = fileInput.files;

    const submitButton = document.getElementById('submit-btn');

    if(files.length > 0){
        const file = files[0];
        
        if(file.type !== 'application/pdf'){
            submitButton.disabled = true;
            showErrorAlert(true, 'File format is wrong.');
            return;
        }
        showErrorAlert(false)
        submitButton.disabled = false;
    }
}

function showErrorAlert(value = false, message = ''){
    const errorAlert = document.getElementById('error-alert');
    if(value){
        errorAlert.innerHTML = message;
        errorAlert.hidden = false;

        setTimeout(() => {
            showErrorAlert(false);
        }, 4000)
    }
    else{
        errorAlert.innerHTML = '';
        errorAlert.hidden = true
    }
}

async function sendPDFile(event){
    event.preventDefault();
    const formData = new FormData(this);

    const response = await fetch('/pdf-extract', {
        method: 'POST',
        body: formData
    })
    if(!response.ok){
        showErrorAlert(true, 'Something wrong, Please try again');
        return;
    }

    setPdfPajakData(await response.text());
}

function setPdfPajakData(strArray){
    const parsedData = JSON.parse(strArray);
    
    const data = {
        ref_id: parsedData.ref_id,
        data: parsedData.data
    }
    // Set ID ref for downloading json
    const ref_id_element = document.getElementById('doc-ref-id');
    ref_id_element.innerHTML = data.ref_id;

    // get the PDF scan data
    const pages = data.data.pages[0].content;
    const resultElement = document.getElementById('content-value');
    
    pages.forEach(data => {
        // Eleminate the whitespace string
        if(data.str != '' && data.str.trim() !== ""){
            const dataElement = document.createElement('li');
            
            // HTML
            dataElement.innerHTML = `
            <span 
                style="margin-bottom: 10px;
                display: inline-block;">
                <span 
                    style="width: 55px; display: inline-block; font-weight: 600">
                    Value:
                </span>
                <span style="">${data.str}</span>
            </span> 
            <br>
            <span style="margin-left: 1rem">
                <span 
                    style="width: 55px; display: inline-block; font-weight: 600">
                    Details:
                </span> 
                <span>
                    { x: ${data.x.toFixed(2)}, y: ${data.y.toFixed(2)}, width: ${data.width.toFixed(2)}, height: ${data.height.toFixed(2)} }
                </span>
            </span>`;

            dataElement.classList.add('list-group-item');
            resultElement.appendChild(dataElement);
        }
    });

    return;
};


async function downloadJson(){
    const ref_id_element = document.getElementById('doc-ref-id');

    // Call the download json data API
    const response = await fetch('/pdf-extract/download/' + ref_id_element.innerText);

    if (!response.ok) {
        showErrorAlert(true, 'Failed to download data, please try again');
        return;
    }

    // Create download file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ref_id_element.innerText}.json`; 
    document.body.appendChild(a);
    // Simulate click to download
    a.click(); 
    // Remove the link after downloading
    a.remove(); 
    // Clean up the URL.createObjectURL
    window.URL.revokeObjectURL(url); 
}

// Event Listener
const form = document.getElementById("pdf-upload-form");
form.addEventListener("submit", sendPDFile);