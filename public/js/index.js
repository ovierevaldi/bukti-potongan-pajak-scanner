function handleFileChange(e) {
    const fileInput = e.target;
    const files = fileInput.files;

    const submitButton = document.getElementById('submit-btn');

    if(files.length > 0){
        const file = files[0];
        if(file.type !== 'application/pdf'){
            submitButton.disabled = true;
            return;
        }
        else{
            const submitButton = document.getElementById('submit-btn');
            submitButton.disabled = false;
        }
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
    const content = JSON.parse(strArray);
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
