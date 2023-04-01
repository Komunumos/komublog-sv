// using js for this since it was pretty freaking annoying to have to deal with this weird types I still don't understand
// also, with my poor knowledge of file and image processing in JS I'm pretty sure this is kinda dirty and can be improved


/**
 * @param {HTMLImageElement} image
 * @param {number} width
 * @param {number} height
 * @param {string} position
 */
export async function cropImage(image, width = 300, height = 300, position = 'center') {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	// Set canvas dimensions to match desired output size
	canvas.width = width;
	canvas.height = height;
	// Calculate position to start cropping from
	let x = 0, y = 0;
	if (image.width / image.height > width / height) {
	  // Image is wider than desired aspect ratio
	  switch (position) {
		case 'center':
		  x = (image.width - image.height * width / height) / 2;
		  break;
		case 'bottom':
		  x = (image.width - image.height * width / height);
		  break;
		// 'top' is default
	  }
	} else {
	  // Image is taller than desired aspect ratio
	  switch (position) {
		case 'center':
		  y = (image.height - image.width * height / width) / 2;
		  break;
		case 'bottom':
		  y = (image.height - image.width * height / width);
		  break;
		// 'top' is default
	  }
	}
	// Draw image onto canvas at desired position
	ctx?.drawImage(image, x, y, image.width - 2 * x, image.height - 2 * y, 0, 0, width, height);
	return canvas.toDataURL();
  }
  /**
   * @param {HTMLImageElement} image
   * @param {number} width
   * @param {number} height
   */
  export async function resizeImageWithAspectRatio(image, width = 300, height = 300) {
	  let resizeCanvas = document.createElement('canvas');
	  let resizeContext = resizeCanvas.getContext('2d');
	  const desiredAspectRatio = width / height;
	  const currentAspectRatio = image.width / image.height;
	  let newWidth = 0;
	  let newHeight = 0;
	  // respect aspect ratio
	  if (desiredAspectRatio != currentAspectRatio) {
		  if (image.width > image.height) {
			  resizeCanvas.width = newWidth = width * currentAspectRatio;
			  resizeCanvas.height = newHeight = height;
		  } else {
			  const otherAspectRatio = image.height / image.width;
			  resizeCanvas.width = newWidth = width;
			  resizeCanvas.height = newHeight = height * otherAspectRatio;
		  }
	  }
	  resizeContext?.drawImage(image, 0, 0, newWidth, newHeight);
	  return resizeCanvas.toDataURL();
  }

/**
 * @param {HTMLImageElement} image
 * @param {number} width
 * @param {number} height
 * @param {string} position
 * @return {Promise<string>} - A promise that resolves to the Data URL string.
 */
export async function resizeThenCrop(image, width = 300, height = 300, position = 'center') {
	const resized = await resizeImageWithAspectRatio(image, width, height);
	const resizedImage = new Image();
	resizedImage.src = resized;

	let resizedPromise = new Promise((resolve) => {
		resizedImage.onload = async () => {
			const cropped = await cropImage(resizedImage, width, height, position);
			resolve(cropped);
		};
	});

	resizedImage.src = resized;
	let croppedResult = await resizedPromise;
	return croppedResult;
}

/**
 * @param {string} dataURI
 */
export function dataURItoBlob(dataURI) {
	const byteString = atob(dataURI.split(',')[1]);
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: mimeString });
}

/**
 * Reads a file and returns its Data URL representation.
 * @param {File} file - The file to be read.
 * @return {Promise<string>} - A promise that resolves to the Data URL string.
 */
export function readFileAsDataURL(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			if (typeof event.target?.result === 'string') {
				resolve(event.target.result);
			} else {
				reject(new Error('Data URL not found'));
			}
		};
		reader.onerror = (error) => {
			reject(error);
		};
		reader.readAsDataURL(file);
	});
}

/**
 * Loads an image from a Data URL.
 * @param {string} dataURL - The Data URL to load the image from.
 * @return {Promise<HTMLImageElement>} - A promise that resolves to the loaded image element.
 */
export function loadImage(dataURL) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => {
			resolve(image);
		};
		image.onerror = (error) => {
			reject(error);
		};
		image.src = dataURL;
	});
}

import config from '../config';
/**
 * @param {string} table
 * @param {string} id
 * @param {string} imageId
 * @return {string} - Image Url
 */
export function getImageUrl(table, id, imageId) {
	return `${config.apiUrl}/api/files/${table}/${id}/${imageId}`;
}

/**
 * Resizes an image's dimensions while maintaining its aspect ratio.
 * If the image is smaller than the target dimensions, the original dimensions are returned.
 *
 * @param {number} width - The original width of the image.
 * @param {number} height - The original height of the image.
 * @param {number} [higherDimension=1200] - The maximum width for the resized image.
 * @param {number} [lowerDimension=675] - The maximum height for the resized image.
 * @returns {{width?: number, height?: number}} - The resized image dimensions.
 */
export function getResizeDimensions(width, height, higherDimension = 1200, lowerDimension = 675) {
	if (width > height) {
		// horizontal images
		if (width <= higherDimension && height <= lowerDimension) {
			return { width, height };
		} else if (width / height > 16 / 9) {
			return { width: higherDimension };
		} else {
			return { height: lowerDimension };
		}
	} else {
		// vertical, square images
		if (width <= lowerDimension && height <= higherDimension) {
			return { width, height };
		} else if (height / width > 16 / 9) {
			return { height: higherDimension };
		} else {
			return { width: lowerDimension };
		}
	}
}

/**
 * Convert an HTMLImageElement to a Data URL.
 * @param {HTMLImageElement} img - The image element to be converted.
 * @returns {string} The Data URL of the image.
 */
export function imageToDataURL(img) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;

	const ctx = canvas.getContext('2d');
	ctx?.drawImage(img, 0, 0);

	return canvas.toDataURL();
}
