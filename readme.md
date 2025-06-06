

Clone the repo in you local PC

Create and execute an Env. 

$ py -m venv venv


$ venv\Scripts\activate

execute to install the dependecies > 

$pip install -r requirements.txt

create the db in you pc

$ py crear_db_catemaco.py

Then you will be able tu execute the app. 

$ py app.py

Go to your blowser in http://127.0.0.1:5000/ URL. 

Command to convert .shp in geoJSON 

(base) C:\Users\artur>ogr2ogr -f GeoJSON -t_srs EPSG:4326 SECCION_2v_CATEMACO.geojson SECCION.shp -where "ENTIDAD = 30 AND DISTRITO_F = 19 AND DISTRITO_L = 25 AND MUNICIPIO = 34" 