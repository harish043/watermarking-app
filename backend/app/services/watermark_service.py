import cv2
import numpy as np
import pywt
from PIL import Image
import io
from skimage.metrics import peak_signal_noise_ratio as psnr
from skimage.metrics import structural_similarity as ssim
import math
import easyocr
import os
from pathlib import Path

# DWT Parameter
alpha = 0.02

class WatermarkService:
    def __init__(self):
        self.reader = easyocr.Reader(['en'], gpu=False)
    
    def adjust_contrast(self, image):
        """Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to enhance OCR detection."""
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        return clahe.apply(image)

    def embed_text_watermark(self, image, text):
        """Embed an invisible text watermark using DWT (HH sub-band)."""
        if len(image.shape) == 3:  
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image  # Already grayscale

        watermark = np.zeros_like(gray, dtype=np.uint8)

        font = cv2.FONT_HERSHEY_SIMPLEX
        text_x, text_y = 10, gray.shape[0] - 10
        cv2.putText(watermark, text, (text_x, text_y), font, 1, (255,), 2, cv2.LINE_AA)

        coeffs2 = pywt.dwt2(gray, 'haar')
        LL, (LH, HL, HH) = coeffs2

        watermark_resized = cv2.resize(watermark, (HH.shape[1], HH.shape[0]))
        HH_watermarked = HH + alpha * watermark_resized

        watermarked_image = pywt.idwt2((LL, (LH, HL, HH_watermarked)), 'haar')
        return np.clip(watermarked_image, 0, 255).astype(np.uint8)

    def extract_watermark_from_image(self, image, original_image):
        """Extract the watermark from the image using DWT."""
        if len(image.shape) == 3:  
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image  # Already grayscale

        coeffs2 = pywt.dwt2(gray, 'haar')
        LL, (LH, HL, HH) = coeffs2

        coeffs2_original = pywt.dwt2(original_image, 'haar')
        LL_original, (LH_original, HL_original, HH_original) = coeffs2_original

        watermark_extracted = (HH - HH_original) / alpha
        watermark_extracted_resized = cv2.resize(watermark_extracted, (original_image.shape[1], original_image.shape[0]))

        return np.clip(watermark_extracted_resized, 0, 255).astype(np.uint8)

    def calculate_psnr(self, original, watermarked):
        """Calculate PSNR between original and watermarked images."""
        mse = np.mean((original - watermarked) ** 2)
        if mse == 0:
            return 100  # No error, perfect match
        max_pixel = 255.0
        return 20 * math.log10(max_pixel / math.sqrt(mse))

    def calculate_metrics(self, original, watermarked):
        """Calculate all quality metrics."""
        psnr_value = self.calculate_psnr(original, watermarked)
        ssim_value, _ = ssim(original, watermarked, full=True)
        mse_value = np.mean((original - watermarked) ** 2)
        
        return {
            "psnr": psnr_value,
            "ssim": ssim_value,
            "mse": mse_value
        }

    def save_image(self, image, filename, upload_dir="uploads"):
        """Save image to file system."""
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)
        
        if len(image.shape) == 3:
            # Color image
            cv2.imwrite(filepath, image)
        else:
            # Grayscale image
            cv2.imwrite(filepath, image)
        
        return filepath

    def embed_watermark(self, image_bytes, watermark_text):
        """Main function to embed watermark in an image."""
        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        original_image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        
        if original_image is None:
            raise ValueError("Invalid image file")
        
        # Embed watermark
        watermarked_image = self.embed_text_watermark(original_image, watermark_text)
        
        # Calculate metrics
        metrics = self.calculate_metrics(original_image, watermarked_image)
        
        # Save watermarked image
        filename = f"watermarked_{hash(watermark_text)}_{len(image_bytes)}.png"
        filepath = self.save_image(watermarked_image, filename)
        
        return {
            "filepath": filepath,
            "filename": filename,
            "metrics": metrics
        }

    def extract_watermark(self, watermarked_bytes, original_bytes):
        """Main function to extract watermark from an image."""
        # Convert bytes to numpy arrays
        watermarked_nparr = np.frombuffer(watermarked_bytes, np.uint8)
        original_nparr = np.frombuffer(original_bytes, np.uint8)
        
        watermarked_image = cv2.imdecode(watermarked_nparr, cv2.IMREAD_GRAYSCALE)
        original_image = cv2.imdecode(original_nparr, cv2.IMREAD_GRAYSCALE)
        
        if watermarked_image is None or original_image is None:
            raise ValueError("Invalid image file")
        
        # Extract watermark
        extracted_watermark = self.extract_watermark_from_image(watermarked_image, original_image)
        
        # Use OCR to detect text
        results = self.reader.readtext(extracted_watermark)
        
        extracted_text = ""
        if results:
            extracted_text = " ".join([text for (bbox, text, conf) in results])
        
        return {
            "extracted_text": extracted_text,
            "ocr_results": results
        } 