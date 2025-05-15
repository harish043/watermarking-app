# 🕵️‍♂️ Invisible Watermarking App (DWT-Based) – Academic Assignment Authenticator

A minimal, professional Streamlit web application to **embed and extract invisible watermarks** in academic documents using **Discrete Wavelet Transform (DWT)** and **OCR with EasyOCR**.

---

## 🚀 Features

- 🎯 **Invisible Watermarking** using DWT (Haar Wavelet)
- 🧠 **OCR Integration** using EasyOCR to read extracted text
- 🖼️ Upload & process PNG/JPEG images
- 📉 Displays embedding metrics (PSNR, SSIM, MSE)
- 💻 Clean, responsive Streamlit UI

---

## 📦 Tech Stack

- `Python`
- `Streamlit`
- `OpenCV`
- `PyWavelets`
- `EasyOCR`
- `NumPy`, `scikit-image`

---

## 📸 How It Works

### 🔐 Embedding
1. Upload your assignment image (PNG/JPG)
2. Enter your **registration number** (or any watermark text)
3. App embeds watermark invisibly into the **HH band** of the DWT

### 🕵️ Extraction
1. Upload the **watermarked image**
2. App extracts the HH sub-band, resizes the original watermark map
3. Uses **EasyOCR** to detect & display hidden text

---

## 📈 Example Output

- **Input:** `assignment1.png` + `"21BCEXXXX"`
- **Output:** `watermarked_image.png`
- **OCR Extracted Watermark:** `"21BCEXXXX"`

---

## 🛠️ Run Locally

```bash
git clone https://github.com/harish043/watermarking-app.git
cd watermarking-app
pip install -r requirements.txt
streamlit run app.py
