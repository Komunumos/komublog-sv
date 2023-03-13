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