import pandas as pd
import sqlite3

# Cargar el CSV
df = pd.read_csv("2Result_Veracruz_2017.csv")

# Limpiar campos clave (por ejemplo, quitar comillas y espacios de SECCION)
df["SECCION"] = df["SECCION"].astype(str).str.replace("'", "").str.strip()
df["ID_MUNICIPIO"] = df["ID_MUNICIPIO"].astype(str).str.replace("'", "").str.strip()
df["ID_CASILLA"] = df["ID_CASILLA"].astype(str).str.replace("'", "").str.strip()

# Conectarse o crear la base de datos
conn = sqlite3.connect("Veracruz_2025.db")
cursor = conn.cursor()

# Eliminar la tabla si ya existe
cursor.execute("DROP TABLE IF EXISTS casillas_2017")

# Crear tabla con campos específicos
cursor.execute("""
CREATE TABLE casillas_2017 (
ID_ESTADO INTEGER ,
ESTADO TEXT,
ID_MUNICIPIO INTEGER ,
MUNICIPIO TEXT,
SECCION INTEGER,
ID_CASILLA INTEGER,
TIPO_CASILLA TEXT,
EXT_CONTIGUA INTEGER,
UBICACION_CASILLA TEXT,
TIPO_ACTA INTEGER,
NUM_BOLETAS_SOBRANTES INTEGER,
TOTAL_CIUDADANOS_VOTARON INTEGER,
NUM_BOLETAS_EXTRAIDAS INTEGER,
PAN INTEGER,
PRI INTEGER,
PRD INTEGER,
PVEM INTEGER,
PT INTEGER,
MOVIMIENTO_CIUDADANO INTEGER,
NUEVA_ALIANZA INTEGER,
MORENA INTEGER,
ES INTEGER,
C_PAN_PRD INTEGER,
C_PRI_PVEM INTEGER,
CAND_IND_1 INTEGER,
CAND_IND_2 INTEGER,
CAND_IND_3 INTEGER,
NO_REGISTRADOS INTEGER,
NULOS INTEGER,
TOTAL_VOTOS INTEGER,
LISTA_NOMINAL INTEGER,
OBSERVACIONES TEXT,
CONTABILIZADA INTEGER,
MECANISMOS_TRASLADO TEXT,
SHA TEXT,
HORA_ACOPIO TEXT,
HORA_CAPTURA TEXT,
HORA_REGISTRO TEXT,
ORIGEN TEXT,
COTEJO TEXT               

)
""")
#print(df)

# Insertar los datos
df.to_sql("casillas_2017", conn, if_exists="append", index=False)

# Cerrar conexión
conn.commit()
conn.close()

print("Base de datos creada con éxito: Veracruz_2025_2017.db")
