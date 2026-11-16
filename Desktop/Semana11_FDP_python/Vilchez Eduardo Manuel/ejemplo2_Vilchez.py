import os

def cargar_clientes():
    print("--- Ejemplo 2: Lectura de Archivo ---")
    
    carpeta_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_archivo = os.path.join(carpeta_actual, "clientes.txt")
    
    try:
        with open(ruta_archivo, "r", encoding="utf-8") as archivo:
            lineas = archivo.readlines()
            print("Clientes encontrados en el archivo:")
            for linea in lineas:
                print(linea.strip())
    except FileNotFoundError:
        print(f"El archivo 'clientes.txt' no fue encontrado.")

if __name__ == "__main__":
    cargar_clientes()