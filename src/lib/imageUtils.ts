// using js for this since it was pretty freaking annoying to have to deal with this weird types I still don't understand
// also, with my poor knowledge of file and image processing in JS I'm pretty sure this is kinda dirty and can be improved


/**
 * Crops an image to a specified size and position.
 * @param image - The image to crop.
 * @param width - The desired width of the cropped image (default 300).
 * @param height - The desired height of the cropped image (default 300).
 * @param position - The position to crop from: 'top', 'center', or 'bottom' (default 'center').
 * @returns A Promise that resolves to a data URL representing the cropped image.
 */
export async function cropImage(image: HTMLImageElement, width = 300, height = 300, position = 'center'): Promise<string> {
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
   * Resizes an image to a specified size while preserving its aspect ratio.
   * @param image - The image to resize.
   * @param width - The desired width of the resized image (default 300).
   * @param height - The desired height of the resized image (default 300).
   * @returns A Promise that resolves to a data URL representing the resized image.
   */
  export async function resizeImageWithAspectRatio(image: HTMLImageElement, width = 300, height = 300): Promise<string> {
	const resizeCanvas = document.createElement('canvas');
	const resizeContext = resizeCanvas.getContext('2d');
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
 * Resizes an image with aspect ratio then crops it to the specified dimensions and position.
 * 
 * @param image - HTMLImageElement
 * @param width - number
 * @param height - number
 * @param position - string
 * 
 * @returns A Promise that resolves to the Data URL string of the cropped image.
 */
export async function resizeThenCrop(image: HTMLImageElement, width = 300, height = 300, position = 'center'): Promise<string> {
	const resized = await resizeImageWithAspectRatio(image, width, height);
	const resizedImage = new Image();
	resizedImage.src = resized;
  
	const resizedPromise = new Promise<string>((resolve) => {
	  resizedImage.onload = async () => {
		const cropped = await cropImage(resizedImage, width, height, position);
		resolve(cropped);
	  };
	});
  
	resizedImage.src = resized;
	const croppedResult = await resizedPromise;
	return croppedResult;
  }
  
  /**
   * Converts a Data URL to a Blob.
   * 
   * @param dataURI - The Data URL to convert.
   * 
   * @returns A Blob object created from the Data URL.
   */
  export function dataURItoBlob(dataURI: string): Blob {
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
   * 
   * @param file - The file to read.
   * 
   * @returns A Promise that resolves to the Data URL string of the read file.
   */
  export function readFileAsDataURL(file: File): Promise<string> {
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
   * 
   * @param dataURL - The Data URL to load the image from.
   * 
   * @returns A Promise that resolves to the loaded HTMLImageElement.
   */
  export function loadImage(dataURL: string): Promise<HTMLImageElement> {
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
   * Returns the URL for a given image file.
   * @param {string} table - The name of the table the image is associated with.
   * @param {string} id - The ID of the record the image is associated with.
   * @param {string} imageId - The ID of the image file.
   * @return {string} - The URL of the image file.
   */
  export function getImageUrl(table: string, id: string, imageId: string): string {
	return `${config.apiUrl}/api/files/${table}/${id}/${imageId}`;
  }
  
  /**
   * Calculates the new dimensions of an image while maintaining its aspect ratio.
   * If the image is smaller than the target dimensions, the original dimensions are returned.
   * @param {number} width - The original width of the image.
   * @param {number} height - The original height of the image.
   * @param {number} [higherDimension=1200] - The maximum width for the resized image.
   * @param {number} [lowerDimension=675] - The maximum height for the resized image.
   * @returns {{width: number, height: number}} - The resized image dimensions.
   */
  export function getResizeDimensions(width: number, height: number, higherDimension = 1200, lowerDimension = 675): { width: number, height: number } {
	if (width > height) {
	  // horizontal images
	  if (width <= higherDimension && height <= lowerDimension) {
		return { width, height };
	  } else if (width / height > 16 / 9) {
		return { width: higherDimension, height: height / (width / higherDimension) };
	  } else {
		return { height: lowerDimension, width: width / (height / lowerDimension) };
	  }
	} else {
	  // vertical, square images
	  if (width <= lowerDimension && height <= higherDimension) {
		return { width, height };
	  } else if (height / width > 16 / 9) {
		return { height: higherDimension, width: width / (height / higherDimension) };
	  } else {
		return { width: lowerDimension, height: height / (width / lowerDimension) };
	  }
	}
  }
  