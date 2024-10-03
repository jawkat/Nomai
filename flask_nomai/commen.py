from app import app, db, Sauce, Ingredient


with app.app_context():
    # Récupérez la première sauce
    first_sauce = Sauce.query.first()

    if first_sauce:
        print(f"Sauce: {first_sauce.name}")  # Affichez le nom de la sauce
        print("Ingrédients et quantités :")

        # Parcourez les ingrédients de la sauce
        for sauce_ingredient in first_sauce.ingredients:
            ingredient = sauce_ingredient.ingredient  # Accédez à l'ingrédient
            quantity = sauce_ingredient.quantity  # Quantité de l'ingrédient
            print(f" - {ingredient.name}: {quantity} {ingredient.unite}")  # Affichez le nom et la quantité
    else:
        print("Aucune sauce trouvée.")
