from datetime import datetime
from flask import Flask, render_template, url_for, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo

app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prix_unitaire = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Ingredient {self.nom}>'

class Sauce(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    nombre_portions = db.Column(db.Integer, nullable=False)
    ingredients = db.relationship('ProduitSauce', backref='sauce', lazy=True)

    def __repr__(self):
        return f'<Sauce {self.nom}>'

class Preparation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    nombre_portions = db.Column(db.Integer, nullable=False)
    ingredients = db.relationship('ProduitPlat', backref='preparation', lazy=True)

    def __repr__(self):
        return f'<Preparation {self.nom}>'

class ProduitSauce(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sauce_id = db.Column(db.Integer, db.ForeignKey('sauce.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False)
    quantité = db.Column(db.Float, nullable=False)
    coût = db.Column(db.Float, nullable=False)

class ProduitPlat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plat_id = db.Column(db.Integer, db.ForeignKey('preparation.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False)
    quantité = db.Column(db.Float, nullable=False)
    coût = db.Column(db.Float, nullable=False)


def ajouter_donnees_fictives():
    with app.app_context():
        db.create_all()  # Créer toutes les tables si elles n'existent pas

        # Ingrédients
        ingredient1 = Ingredient(nom='Poulet', prix_unitaire=70)
        ingredient2 = Ingredient(nom='Aubergine', prix_unitaire=6)
        ingredient3 = Ingredient(nom='Sauce Tomate MUTTI', prix_unitaire=36)
        ingredient4 = Ingredient(nom='Parmesan', prix_unitaire=180)
        ingredient5 = Ingredient(nom='Mozzarella', prix_unitaire=57)
        ingredient6 = Ingredient(nom='Basilic', prix_unitaire=15)
        ingredient7 = Ingredient(nom='Sauce Pesto', prix_unitaire=3.24)

        # Ajouter les ingrédients à la base de données
        db.session.add_all([
            ingredient1, ingredient2, ingredient3, ingredient4, ingredient5,
            ingredient6, ingredient7
        ])
        db.session.commit()  # Commiter les ingrédients pour obtenir leurs IDs

        # Sauces
        sauce_pesto = Sauce(nom='Sauce Pesto', nombre_portions=20)
        db.session.add(sauce_pesto)
        db.session.commit()  # Commiter la sauce pour obtenir son ID

        # Produits de sauce
        produit_sauce1 = ProduitSauce(sauce_id=sauce_pesto.id, ingredient_id=ingredient6.id, quantité=2, coût=30)
        produit_sauce2 = ProduitSauce(sauce_id=sauce_pesto.id, ingredient_id=ingredient7.id, quantité=0.5, coût=1.62)

        # Plats
        preparation1 = Preparation(nom='Suprême de Poulet alla Parmiggiana', nombre_portions=4)
        db.session.add(preparation1)
        db.session.commit()  # Commiter la préparation pour obtenir son ID

        produit_plat1 = ProduitPlat(plat_id=preparation1.id, ingredient_id=ingredient1.id, quantité=0.4, coût=28)
        produit_plat2 = ProduitPlat(plat_id=preparation1.id, ingredient_id=ingredient2.id, quantité=0.25, coût=1.5)
        produit_plat3 = ProduitPlat(plat_id=preparation1.id, ingredient_id=ingredient3.id, quantité=0.1, coût=3.6)
        produit_plat4 = ProduitPlat(plat_id=preparation1.id, ingredient_id=ingredient4.id, quantité=0.05, coût=9)

        # Ajouter les produits de sauce et de plat à la base de données
        db.session.add_all([
            produit_sauce1, produit_sauce2,
            produit_plat1, produit_plat2, produit_plat3, produit_plat4
        ])
        db.session.commit()



@app.route("/")
def plats():
    ingredients = Ingredient.query.all()
    return render_template('plats.html', ingredients=ingredients)

if __name__ == '__main__':
    ajouter_donnees_fictives()
    app.run(debug=True)
