
from flask import Flask, jsonify, send_from_directory, render_template
from flask_cors import CORS
import sqlite3
from queries import Map_query_casillas_2025, Map_query_casillas_2021

app = Flask(__name__, static_folder="static")
CORS(app)

DB_PATH = "catemaco_2025.db"

def get_info_from_db(section_id, year):
    if year == '2025':
        Map_query = Map_query_casillas_2025
    elif year =='2021': 
        
        Map_query = Map_query_casillas_2021
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

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/map/<mun_id_01>")
def map(mun_id_01):
    print(mun_id_01)
    return render_template( "map.html", mun_id = mun_id_01)

@app.route("/map/<mun_id>/<section_id>")
def get_section_info(mun_id,section_id):
    #data = SECTIONS.get(section_id, {"error": "No se encontró la sección"})
    #return jsonify(data)
    votos_2025 = get_info_from_db(section_id,'2025')
    votos_2021 = get_info_from_db(section_id,'2021')
    data_2025 = jsonify({"2025" :votos_2025, "2021" :votos_2021})
    print (mun_id)
    return data_2025

if __name__ == "__main__":
    app.run(debug=True)
