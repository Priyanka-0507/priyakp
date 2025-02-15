from flask import Flask, request, jsonify
import cv2
import pytesseract
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img = Image.open(file.stream)

    # Convert to grayscale and apply OCR
    img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2GRAY)
    text = pytesseract.image_to_string(img)

    return jsonify({'extracted_text': text})

if __name__ == '__main__':
    app.run(debug=True)
