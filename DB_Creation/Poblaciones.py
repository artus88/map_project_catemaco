import pandas as pd
import sqlite3

# Cargar el CSV
df = pd.read_csv("Poblaciones.csv")

# Limpiar campos clave (por ejemplo, quitar comillas y espacios de SECCION)
df["SECCION"] = df["SECCION"].astype(str).str.replace("'", "").str.strip()

# Conectarse o crear la base de datos
conn = sqlite3.connect("catemaco_2025.db")
cursor = conn.cursor()

# Eliminar la tabla si ya existe
cursor.execute("DROP TABLE IF EXISTS Poblaciones")

# Crear tabla con campos específicos
cursor.execute("""
CREATE TABLE Poblaciones (
    SECCION INTEGER,
	POBLACION TEXT, 
    Municipio TEXT,	
    ID_MUNICIPIO INTEGER

)
""")

# Insertar los datos
df.to_sql("Poblaciones", conn, if_exists="append", index=False)

# Cerrar conexión
conn.commit()
conn.close()

print("Base de datos creada con éxito: catemaco_2025.db")
