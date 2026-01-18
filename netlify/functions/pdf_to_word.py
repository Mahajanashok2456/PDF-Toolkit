import base64
import json
import os
import tempfile
import uuid
from requests_toolbelt.multipart import decoder
from pdf2docx import Converter

def handler(event, context):
    if event['httpMethod'] != 'POST':
        return {'statusCode': 405, 'body': json.dumps({'error': 'Method not allowed'})}

    try:
        content_type = event['headers'].get('content-type') or event['headers'].get('Content-Type')
        if not content_type:
             return {'statusCode': 400, 'body': json.dumps({'error': 'Missing Content-Type'})}

        body = event.get('body')
        if event.get('isBase64Encoded', False):
            body = base64.b64decode(body)
        else:
            # If simplistic string, encode it. But simpler to rely on base64 from Netlify.
            body = body.encode('utf-8')

        # Decode Multipart
        multipart_data = decoder.MultipartDecoder(body, content_type)
        
        # Find the specific part (field name 'pdf' as per the multer config in server.js/frontend)
        pdf_part = None
        for part in multipart_data.parts:
            # Content-Disposition header usually looks like: form-data; name="pdf"; filename="foo.pdf"
            headers = {k.decode('utf-8').lower(): v.decode('utf-8') for k,v in part.headers.items()}
            disposition = headers.get('content-disposition', '')
            if 'name="pdf"' in disposition:
                pdf_part = part
                break
        
        if not pdf_part:
             # Fallback: just take the first part if specific one not found? Or error.
             if len(multipart_data.parts) > 0:
                 pdf_part = multipart_data.parts[0]
             else:
                 return {'statusCode': 400, 'body': json.dumps({'error': 'No file found in request'})}

        # Save to temp
        temp_dir = tempfile.gettempdir()
        unique_id = str(uuid.uuid4())
        input_path = os.path.join(temp_dir, f"input_{unique_id}.pdf")
        output_path = os.path.join(temp_dir, f"output_{unique_id}.docx")

        with open(input_path, 'wb') as f:
            f.write(pdf_part.content)

        # Convert
        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()

        with open(output_path, 'rb') as f:
            docx_content = f.read()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="converted.docx"'
            },
            'body': base64.b64encode(docx_content).decode('utf-8'),
            'isBase64Encoded': True
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f"Conversion error: {str(e)}"})
        }
    finally:
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        if 'output_path' in locals() and os.path.exists(output_path):
            os.remove(output_path)
