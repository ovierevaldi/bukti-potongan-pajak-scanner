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

    const result = await response.text();
    setPdfPajakValue(result);
}

const form = document.getElementById("pdf-upload-form");

form.addEventListener("submit", sendPDFile);

function setPdfPajakValue(strArray){
    const parsed = JSON.parse(strArray)
    // const data = {
    //     ref_id: strArray.ref_id,
    //     data: strArray.data
    // }

    const ref_id_element = document.getElementById('doc-ref-id');
    ref_id_element.innerHTML = parsed.ref_id;

    const content = parsed.data
    const resultElement = document.getElementById('content-value');

    content[0].content.forEach(element => {
        if(element.str != '' && element.str.trim() !== ""){
        const newElement = document.createElement('li');
        newElement.innerHTML = `
            <span style="
    margin-bottom: 10px;
    display: inline-block;"><span style="width: 55px; display: inline-block; font-weight: 600">Value:</span> <span style="">${element.str}</span></span> 
            <br> 
            <span style="margin-left: 1rem"><span style="width: 55px; display: inline-block; font-weight: 600">Details:</span> <span>{ x: ${element.x.toFixed(2)}, y: ${element.y.toFixed(2)}, width: ${element.width.toFixed(2)}, height: ${element.height.toFixed(2)} }</span></span>
        `;
        newElement.classList.add('list-group-item');
        resultElement.appendChild(newElement);
        }
});
};


async function downloadJson(){
    const ref_id_element = document.getElementById('doc-ref-id');
    const response = await fetch('/pdf-extract/download/' + ref_id_element.innerText);

    if (!response.ok) {
        console.error('Failed to download file:', response.statusText);
        return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ref_id_element.innerText}.json`; 
    document.body.appendChild(a);
    a.click(); // Simulate click to download
    a.remove(); // Remove the link after downloading
    window.URL.revokeObjectURL(url); // Clean up the URL.createObjectURL
}
