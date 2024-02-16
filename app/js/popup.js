document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
    });


    var analyzeButton = document.getElementsByClassName("analyze-button")[0];
    if (analyzeButton) {
        analyzeButton.onclick = function () {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
            });
        };
    }


    var linkElement = document.getElementsByClassName("link")[0];
    if (linkElement) {
        linkElement.onclick = function () {
            chrome.tabs.create({
                url: linkElement.getAttribute("href"),
            });
        };
    }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "update_current_count") {
        var numberElement = document.getElementsByClassName("number")[0];
        if (numberElement) {
            numberElement.textContent = request.count;
        }
    }
});

// function openReportPopup() {

//     var popupWidth = 600;
//     var popupHeight = 400;
//     var left = (window.innerWidth - popupWidth) / 2;
//     var top = (window.innerHeight - popupHeight) / 2;


//     window.open('report.html', '_blank', 'width=' + popupWidth + ', height=' + popupHeight + ', top=' + top + ', left=' + left);
// }


// document.getElementById('report').addEventListener('click', openReportPopup);
document.addEventListener('DOMContentLoaded', function () {
    const reportButton = document.getElementById('report');
    reportButton.addEventListener('click', reportDarkPatterns);

    function reportDarkPatterns() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function (dataUrl) {
                const description = prompt('Enter description for the screenshot:');
                if (description === null) return;

                openModal(dataUrl, description);
            });
        });
    }

    function openModal(imageUrl, description) {
        const modal = document.getElementById('cropperModal');
        const cropperContainer = document.getElementById('cropperContainer');


        const img = new Image();
        img.onload = function () {

            cropperContainer.appendChild(img);


            modal.style.display = 'block';


            const cropper = new Cropper(img, {
                aspectRatio: NaN,
                viewMode: 1,
                zoomable: false,
            });


            document.getElementById('cropButton').addEventListener('click', function () {

                const canvas = cropper.getCroppedCanvas();

                const croppedDataUrl = canvas.toDataURL('image/png');


                modal.style.display = 'none';


                sendData(croppedDataUrl, description);
            });
        };


        img.src = imageUrl;
    }

    function sendData(imageData, description) {
        fetch('http://127.0.0.1:5000/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData,
                description: description
            })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error occurred while reporting. Please try again later.');
            });
    }


    document.getElementsByClassName('close')[0].addEventListener('click', function () {
        document.getElementById('cropperModal').style.display = 'none';
    });


    window.onclick = function (event) {
        const modal = document.getElementById('cropperModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});

document.getElementById('downloadDarkPatterns').addEventListener('click', function() {
    fetch('http://127.0.0.1:5000/download_text', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to download dark patterns');
        }
        return response.blob();
    })
    .then(blob => {
        // Create a new blob URL for the downloaded file
        const url = window.URL.createObjectURL(blob);

        // Create a new anchor element
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dark_patterns.txt'; // Specify the filename
        document.body.appendChild(a);

        // Trigger a click event to start the download
        a.click();

        // Remove the anchor element
        document.body.removeChild(a);

        // Release the blob URL
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while downloading dark patterns. Please try again later.');
    });
});
