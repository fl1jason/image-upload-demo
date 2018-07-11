var theImageForm = document.querySelector('#theImageForm');
var theImageField = document.querySelector('#theImageField');
var theImageContainer = document.querySelector('#theImageContainer');
var theErrorMessage = document.querySelector('#errorMessage');
var theClearImageLink = document.querySelector('#clearImage');

var fileName = "";

[
    'drag', 
    'dragstart', 
    'dragend', 
    'dragover', 
    'dragenter', 
    'dragleave',
    'drop' 
].forEach(function (dragEvent) {
    theImageContainer.addEventListener(dragEvent, preventDragDefault);
});

theImageContainer.addEventListener('drop', function (e) {
    if(e.dataTransfer.files.length > 1) {
        theErrorMessage.innerHTML = "Drag only one file...";
        return false;
    }
    var theFile = e.dataTransfer.files[0];
    theImageField.files[0] = theFile;
    handleUploadedFile(theFile);
})

theImageField.onchange = function (e) {
    var theFile = e.target.files[0];

    if (theFile.type !== "image/png" && theFile.type !== "image/jpeg") {
        console.log('File type mismatch');
        theErrorMessage.innerHTML = "File type should be png or jpg/jpeg...";
        this.value = null;
        return false;
    }

    if (theFile.size > 500000) {
        console.log('File too large');
        theErrorMessage.innerHTML = "File too large, cannot be more than 500KB...";
        this.value = null;
        return false;
    }

    handleUploadedFile(theFile);
}

theImageForm.onsubmit = function (e) {
    e.preventDefault();
    var theImageTag = document.querySelector('#theImageTag');
    jQuery.ajax({
        method: 'POST',
        url: '/upload',
        data: {
            theFile: theImageTag.getAttribute('src'),
            name: fileName
        }
    })
    .done(function (resp) {
        console.log(resp);
    })
}

theClearImageLink.onclick = clearImage;



function preventDragDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleUploadedFile(file) {
    fileName = file.name;
    clearImage();
    var img = document.createElement("img");
    img.setAttribute('id', 'theImageTag');
    img.file = file;
    theImageContainer.appendChild(img);
    
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
}

function clearImage(e) {
    if(e) {
        e.preventDefault();
    }

    var theImageTag = document.querySelector('#theImageTag');

    if(theImageTag) {
        theImageContainer.removeChild(theImageTag);
        theImageField.value = null;
    }
}