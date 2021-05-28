import csv

with open('original-data/DEFUNCIONES_FUENTE_DEIS_2016_2021_20052021.csv', 'r',
          encoding='ISO-8859-1') as csvin, open('data/deis-data.csv', 'w',
                                                encoding='ISO-8859-1') as csvout:
    csvin = csv.reader(csvin, delimiter=";")
    csvout = csv.writer(csvout, delimiter=';', lineterminator="\n")
    next(csvin)

    switcher = {
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

with open('original-data/INE-PROYECCIONES-POBLACION-POR-COMUNA-2015-2020.csv','r', encoding='ISO-8859-1') as xlin, open('data/ine-data.csv', 'w', encoding='ISO-8859-1') as csvout:
    xlin = csv.reader(xlin, delimiter=";")
    csvout = csv.writer(csvout, delimiter=';', lineterminator="\n")
    next(xlin)

    for row in xlin:
        region = row[0]
        comuna = row[1]
        a2015, a2016, a2017, a2018, a2019, a2020 = row[2], row[3], row[4], row[5], row[6], row[7]
        csvout.writerow((region, comuna, 2015, a2015))
        csvout.writerow((region, comuna, 2016, a2016))
        csvout.writerow((region, comuna, 2017, a2017))
        csvout.writerow((region, comuna, 2018, a2018))
        csvout.writerow((region, comuna, 2019, a2019))
        csvout.writerow((region, comuna, 2020, a2020))

