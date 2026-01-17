from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import os
import tempfile
import uuid

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "pdf-to-word-python"})

@app.route('/api/pdf-to-word', methods=['POST'])
def convert_pdf_to_word():
    if 'pdf' not in request.files:
        return {"error": "No PDF file provided"}, 400
    
    pdf_file = request.files['pdf']
    
    # Create unique temp paths
    temp_dir = tempfile.gettempdir()
    unique_id = str(uuid.uuid4())
    input_path = os.path.join(temp_dir, f"input_{unique_id}.pdf")
    output_path = os.path.join(temp_dir, f"output_{unique_id}.docx")
    
    try:
        # Save uploaded file
        pdf_file.save(input_path)
        
        # Convert PDF to DOCX with high fidelity
        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        
        # Return the file
        return send_file(
            output_path,
            as_attachment=True,
            download_name="converted.docx",
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        return {"error": str(e)}, 500
        
    finally:
        # Cleanup
        if os.path.exists(input_path):
            os.remove(input_path)

# Vercel needs this "app" variable exposed
if __name__ == '__main__':
    app.run(port=3002)
