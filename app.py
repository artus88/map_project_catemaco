
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3

app = Flask(__name__, static_folder="static")
CORS(app)

DB_PATH = "catemaco.db"

def get_info_from_db(section_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Consultar por sección
        cursor.execute("SELECT SECCION, SUM(MC) AS MC, SUM(PAN) as PAN, SUM(PRI) AS PRI, SUM(PVEM+MOR+C_PVEM_MOR) AS MORENA, SUM(PT) AS PT, SUM(TOTAL_VOTOS_ASENTADO) AS TOTAL_VOTOS, SUM(LISTA_NOMINAL) AS NOMINAL   FROM casillas WHERE SECCION = ? LIMIT 1", (section_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            # Convertir a diccionario
            resultado = {key: row[key] for key in row.keys()}
            print('get_info_from_db')
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

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/info/<section_id>")
def get_section_info(section_id):
    #data = SECTIONS.get(section_id, {"error": "No se encontró la sección"})
    #return jsonify(data)
    data = jsonify(get_info_from_db(section_id))
    print (data)
    return data

if __name__ == "__main__":
    app.run(debug=True)
