import streamlit as st
import cv2
import numpy as np
import pywt
from PIL import Image
import io
from skimage.metrics import peak_signal_noise_ratio as psnr
from skimage.metrics import structural_similarity as ssim
import math
import easyocr

# DWT Parameter
alpha = 0.02

# Function to adjust contrast using CLAHE
def adjust_contrast(image):
    """Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to enhance OCR detection."""
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    return clahe.apply(image)

# Function to embed an invisible text watermark using DWT (HH sub-band)
def embed_text_watermark(image, text):
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

# Function to extract the watermark from the image using DWT
def extract_watermark(image, original_image):
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

# Function to calculate PSNR
def calculate_psnr(original, watermarked):
    mse = np.mean((original - watermarked) ** 2)
    if mse == 0:
        return 100  # No error, perfect match
    max_pixel = 255.0
    return 20 * math.log10(max_pixel / math.sqrt(mse))

# Layout configuration using Streamlit
st.set_page_config(page_title="Invisible Watermarking", page_icon=":guardsman:", layout="centered")

# Styling for the app
st.markdown("""
    <style>
        .header {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            color: #1a1a1a;
        }
        .subheader {
            font-size: 1.5em;
            font-weight: normal;
            text-align: center;
            color: #555;
        }
        .card {
            background-color: #f4f4f4;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
""", unsafe_allow_html=True)

st.title("Invisible Watermarking for Academic Assignments")

# File uploader and text input
col1, col2 = st.columns([3, 1])

with col1:
    uploaded_file = st.file_uploader("Upload an Image", type=["png", "jpg", "jpeg"])

with col2:
    watermark_text = st.text_input("Enter Watermark Text")

if uploaded_file and watermark_text:
    file_bytes = np.frombuffer(uploaded_file.read(), np.uint8)
    original_image = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)

    if original_image is None:
        st.error("Invalid image file")
    else:
        # Embed watermark in the image
        watermarked_image = embed_text_watermark(original_image, watermark_text)

        # Convert watermarked image to PIL format
        watermarked_pil_img = Image.fromarray(watermarked_image)

        # Display the watermarked image
        st.subheader("Watermarked Image")
        st.image(watermarked_pil_img, caption="Watermarked Image", use_column_width=True)

        # Calculate PSNR, SSIM, and MSE
        psnr_value = calculate_psnr(original_image, watermarked_image)
        ssim_value, _ = ssim(original_image, watermarked_image, full=True)
        mse_value = np.mean((original_image - watermarked_image) ** 2)

        # Display Metrics
        with st.container():
            st.markdown("### Metrics for Watermarked Image")
            st.write(f"**PSNR (Peak Signal-to-Noise Ratio)**: {psnr_value:.2f} dB")
            st.write(f"**SSIM (Structural Similarity Index)**: {ssim_value:.4f}")
            st.write(f"**MSE (Mean Squared Error)**: {mse_value:.2f}")

        # Download button for watermarked image
        with io.BytesIO() as buffer:
            watermarked_pil_img.save(buffer, format="PNG")
            buffer.seek(0)
            st.download_button("Download Watermarked Image", buffer, "watermarked_image.png")



reader = easyocr.Reader(['en'], gpu=False)  # Initialize OCR reader

st.subheader("Extract Watermark from Image")

col1, col2 = st.columns(2)

with col1:
    uploaded_watermarked = st.file_uploader("Upload Watermarked Image", type=["png", "jpg", "jpeg"])

with col2:
    uploaded_original = st.file_uploader("Upload Original (Unwatermarked) Image", type=["png", "jpg", "jpeg"])

if uploaded_watermarked and uploaded_original:
    watermarked_bytes = np.frombuffer(uploaded_watermarked.read(), np.uint8)
    original_bytes = np.frombuffer(uploaded_original.read(), np.uint8)

    extracted_image = cv2.imdecode(watermarked_bytes, cv2.IMREAD_GRAYSCALE)
    original_image = cv2.imdecode(original_bytes, cv2.IMREAD_GRAYSCALE)

    if extracted_image is None or original_image is None:
        st.error("One of the uploaded files is not a valid image.")
    else:
        extracted_watermark = extract_watermark(extracted_image, original_image)

        st.image(extracted_watermark, caption="Extracted Watermark (Raw Image)", use_column_width=True)

        # Use EasyOCR to detect text
        with st.spinner("Running OCR..."):
            results = reader.readtext(extracted_watermark)

        if results:
            st.success("Detected Watermark Text:")
            for (bbox, text, conf) in results:
                st.markdown(f"**Text:** `{text}` | **Confidence:** `{conf:.2f}`")
        else:
            st.warning("No readable text found in the extracted watermark.")

