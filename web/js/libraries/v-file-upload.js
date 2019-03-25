class FileUpload {
    constructor(url, headers = {}, onProgress = () => {}, type = 'POST') {
	this.url = url
	this.headers = headers
	this.onProgress = onProgress
	this.type = type
    }

    upload(file, additionalData = {}, onLoad = () => {}, onError = () => {}) {
	let xhr = new XMLHttpRequest()

	// Headers
	xhr.open(this.type, this.url, true)
	xhr.responseType = 'json'
	this._setXhrHeaders(xhr)

	// Events
	xhr.upload.addEventListener('progress', this.onProgress, false);
	xhr.onload = function () {
		if (xhr.status == 200)
			onLoad(xhr.response);
		else
			onError()
	};
	xhr.onerror = onError;

	// Start upload
	let formData = new FormData();
	formData.append('file', file);
	Object.keys(additionalData).forEach(p => {
	    formData.append(p, additionalData[p]);
	});
	xhr.send(formData);
    }

    _setXhrHeaders(xhr) {
	Object.keys(this.headers).forEach(p =>
					  xhr.setRequestHeader(p, this.headers[p])
					 )
    }
}
