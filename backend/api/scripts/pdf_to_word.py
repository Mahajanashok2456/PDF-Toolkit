import sys
import os
from pdf2docx import Converter

def convert_pdf_to_word(pdf_file, docx_file):
    try:
        # Create Converter object
        cv = Converter(pdf_file)
        
        # Convert to docx
        # start=0, end=None means all pages
        cv.convert(docx_file, start=0, end=None)
        
        # Close converter
        cv.close()
        return True
    except Exception as e:
        print(f"Error converting: {str(e)}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pdf_to_word.py <input_pdf_path> <output_docx_path>", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    success = convert_pdf_to_word(input_path, output_path)
    
    if success:
        print("Conversion completed successfully")
        sys.exit(0)
    else:
        sys.exit(1)
