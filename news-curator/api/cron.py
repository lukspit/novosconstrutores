import sys
import os

# Adds the project root to the python path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from http.server import BaseHTTPRequestHandler
from main import main

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            main()
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Curadoria concluida com sucesso!")
        except Exception as e:
            import traceback
            error = traceback.format_exc()
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(f"Erro na curadoria:\n{error}".encode('utf-8'))
