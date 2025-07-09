import pandas as pd
import sqlite3

# Cargar el CSV
df = pd.read_csv("Localidades.csv")

# Limpiar campos clave (por ejemplo, quitar comillas y espacios de SECCION)
df["SECCION"] = df["SECCION"].astype(str).str.replace("'", "").str.strip()

# Conectarse o crear la base de datos
conn = sqlite3.connect("Veracruz_2025.db")
cursor = conn.cursor()

# Eliminar la tabla si ya existe
cursor.execute("DROP TABLE IF EXISTS LOCALIDADES")

# Crear tabla con campos específicos
cursor.execute("""
CREATE TABLE LOCALIDADES (

    ENTIDAD_ID  INTEGER,
    ENTIDAD	TEXT,
    MUNICIPIO_ID INTEGER,	
    MUNICIPIO TEXT,
    SECCION	INTEGER,
    LOCALIDAD_ID INTEGER,	
    LOCALIDAD TEXT,
    TIPO TEXT
     )
""")

# Insertar los datos
df.to_sql("LOCALIDADES", conn, if_exists="append", index=False)

# Cerrar conexión
conn.commit()
conn.close()

print("Base de datos creada con éxito: Veracruz_2025.db")
