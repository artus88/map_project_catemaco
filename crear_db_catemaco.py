import pandas as pd
import sqlite3

# Cargar el CSV
df = pd.read_csv("Result_Catemaco_2025.csv")

# Limpiar campos clave (por ejemplo, quitar comillas y espacios de SECCION)
df["SECCION"] = df["SECCION"].astype(str).str.replace("'", "").str.strip()

# Conectarse o crear la base de datos
conn = sqlite3.connect("catemaco.db")
cursor = conn.cursor()

# Eliminar la tabla si ya existe
cursor.execute("DROP TABLE IF EXISTS casillas")

# Crear tabla con campos específicos
cursor.execute("""
CREATE TABLE casillas (
CLAVE_CASILLA TEXT, 
CLAVE_ACTA TEXT, 
ID_ENTIDAD TEXT, 
ENTIDAD TEXT, 
ID_MUNICIPIO TEXT, 
MUNICIPIO TEXT, 
SECCION INTEGER, 
ID_CASILLA INTEGER, 
TIPO_CASILLA TEXT, 
EXT_CONTIGUA TEXT, 
UBICACION_CASILLA TEXT, 
TIPO_ACTA INTEGER, 
TOTAL_BOLETAS_SOBRANTES INTEGER, 
TOTAL_PERSONAS_VOTARON INTEGER, 
TOTAL_REP_PARTIDO_CI_VOTARON INTEGER, 
TOTAL_VOTOS_SACADOS INTEGER, 
PAN INTEGER, 
PRI INTEGER, 
PVEM INTEGER, 
PT INTEGER, 
MC INTEGER,  
MOR INTEGER, 
CAND_IND_1 TEXT, 
CAND_IND_2 TEXT, 
C_PVEM_MOR INTEGER, 
NO_REGISTRADAS TEXT, 
NULOS INTEGER, 
TOTAL_VOTOS_ASENTADO INTEGER, 
TOTAL_VOTOS_CALCULADO INTEGER, 
LISTA_NOMINAL INTEGER INTEGER, 
REPRESENTANTES_PP_CI TEXT, 
OBSERVACIONES TEXT, 
CONTABILIZADA TEXT, 
MECANISMOS_TRASLADO TEXT, 
CODIGO_INTEGRIDAD TEXT, 
FECHA_HORA_ACOPIO TEXT, 
FECHA_HORA_CAPTURA TEXT, 
FECHA_HORA_VERIFICACION TEXT, 
ORIGEN TEXT, 
DIGITALIZACION TEXT, 
TIPO_DOCUMENTO , 
COTEJADA TEXT
)
""")

# Insertar los datos
df.to_sql("casillas", conn, if_exists="append", index=False)

# Cerrar conexión
conn.commit()
conn.close()

print("Base de datos creada con éxito: catemaco.db")
