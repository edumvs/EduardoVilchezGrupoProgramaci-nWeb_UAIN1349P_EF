def gestionar_clientes():
    print("--- Ejemplo 3: Gestión de Clientes ---")
    clientes = ["Juan Perez", "Maria Gomez", "Carlos Lopez"]
    
    print("Lista de clientes registrados:")
    for i, cliente in enumerate(clientes, start=1):
        print(f"{i}. {cliente}")

if __name__ == "__main__":
    gestionar_clientes()