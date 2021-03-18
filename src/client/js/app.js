// Make async POST req to server
const postData = async function(url='', data={}) {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        return await res.json();
    }
    catch(error) {
        console.log(`An error occurred in postGeoData: ${error}`);
    }
};

// Update the UI
const updateUI = async function(text="", id, elemData) {
    try {
        if (isImage(id)) {
            document.getElementById(id).src = elemData;
        }
        else {
            document.getElementById(id).innerHTML = text + elemData.toString();
        };
    }
    catch(error) {
        console.log(`An error occurred while updating the UI: ${error}`);
    }
};

const isImage = function(id) {
    return id == "trip-image";
}

// Export functions
export { 
    postData,
    updateUI,
    isImage
};