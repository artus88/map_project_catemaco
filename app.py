
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from queries import Map_query

app = Flask(__name__, static_folder="static")
CORS(app)

DB_PATH = "catemaco_2025.db"

def get_info_from_db(section_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Consultar por sección
        cursor.execute(Map_query, (section_id,))
        row = cursor.fetchone()
        conn.close()
            
        if row:
            # Convertir a diccionario
            resultado = {key: row[key] for key in row.keys()}
            print (resultado)
            return resultado
        
        else:
            return {"error": "Sección no encontrada"}

    except Exception as e:
        return {"error": str(e)}

# Simulación de base de datos (puedes reemplazar con SQLite si deseas)
SECTIONS = {
    "0646": {"columna2": "La Palma", "columna3": "Zona rural", "columna4": "Catemaco Norte"},
    "0647": {"columna2": "Centro", "columna3": "Zona urbana", "columna4": "Cerca del lago"}
}

@app.route("/map")
def index():
    return send_from_directory("static", "map.html")

@app.route("/map/<section_id>")
def get_section_info(section_id):
    #data = SECTIONS.get(section_id, {"error": "No se encontró la sección"})
    #return jsonify(data)
    data = jsonify(get_info_from_db(section_id))
    #print (data)
    return data

if __name__ == "__main__":
    app.run(debug=True)
