import csv

with open('CC5208-DEIS-Chile-Deaths/data/DEFUNCIONES_FUENTE_DEIS_2016_2021_20052021.csv','r', encoding='ISO-8859-1') as csvin, open('CC5208-DEIS-Chile-Deaths/data/deis-data.csv', 'w', encoding='ISO-8859-1') as csvout:
    csvin = csv.reader(csvin, delimiter=";")
    csvout = csv.writer(csvout, delimiter=';', lineterminator="\n")
    next(csvin) 
    
    switcher =  {
    'De Valparaíso': 'VALPARAÍSO',
    'De Tarapacá': 'TARAPACÁ',
    'Metropolitana de Santiago': 'SANTIAGO',
    'Del Maule': 'MAULE',
    'De Magallanes y de La Antártica Chilena': 'MAGALLANES',
    'De Los Ríos': 'LOS RÍOS',
    'De Los Lagos': 'LOS LAGOS',
    'Del Libertador B. O\'Higgins': 'LIBERTADOR GENERAL BERNARDO O\'HIGGINS',
    'De La Araucanía': 'LA ARAUCANÍA',
    'De Coquimbo': 'COQUIMBO',
    'Del Bíobío': 'BÍO -BÍO',
    'De Aisén del Gral. C. Ibáñez del Campo': 'AYSEN DEL GEN. CARLOS IBÁÑEZ DEL CAMPO',
    'De Atacama': 'ATACAMA',
    'De Arica y Parinacota': 'ARICA Y PARINACOTA',
    'De Antofagasta': 'ANTOFAGASTA',
    'De Ñuble': 'REGIÓN DE ÑUBLE'}


    for row in csvin:
        region = row[7]
        if row[7] in switcher.keys():
            region = switcher[row[7]]

        csvout.writerow((row[0], row[1], row[2], row[3],
                         row[4], row[5], row[6], region,
                         row[8], row[9], row[10], row[11],
                         row[12], row[13], row[14], row[15],
                         row[16]))