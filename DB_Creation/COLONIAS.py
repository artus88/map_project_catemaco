import pandas as pd
import sqlite3

# Cargar el CSV
df = pd.read_csv("Colonias.csv")

# Limpiar campos clave (por ejemplo, quitar comillas y espacios de SECCION)
df["SECCION"] = df["SECCION"].astype(str).str.replace("'", "").str.strip()

# Conectarse o crear la base de datos
conn = sqlite3.connect("Veracruz_2025.db")
cursor = conn.cursor()

# Eliminar la tabla si ya existe
cursor.execute("DROP TABLE IF EXISTS COLONIAS")

# Crear tabla con campos específicos
cursor.execute("""
CREATE TABLE COLONIAS (
    ID INTEGER,
    ENTIDAD_ID  INTEGER,
    DISTRITO INTEGER,
    MUNICIPIO_ID INTEGER,	
    SECCION INTEGER,
    MUNICIPIO TEXT,
    TIPO_SEC TEXT,
    TIPO_COL TEXT,	
    NOMBRE_COL TEXT,
    CP TEXT,
    CONTROL TEXT           
     )
""")

# Insertar los datos
df.to_sql("COLONIAS", conn, if_exists="append", index=False)

# Cerrar conexión
conn.commit()
conn.close()

print("Base de datos creada con éxito: Veracruz_2025.db")
