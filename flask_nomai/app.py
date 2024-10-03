from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, IntegerField, SubmitField, SelectField
from wtforms.validators import DataRequired
from flask_bootstrap import Bootstrap

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
Bootstrap(app)

# Models

# Models
class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    prix_unitaire = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Float, nullable=False)
    unite = db.Column(db.String(10), nullable=False)

class SauceIngredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sauce_id = db.Column(db.Integer, db.ForeignKey('sauce.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)

    # Relation to access the ingredient details
    ingredient = db.relationship('Ingredient')

class Sauce(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ingredients = db.relationship('SauceIngredient', backref='sauce', lazy=True)
    portions = db.Column(db.Integer, nullable=False)



class Plat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ingredients = db.relationship('PlatIngredient', backref='plat', lazy=True)
    sauce_id = db.Column(db.Integer, db.ForeignKey('sauce.id'), nullable=True)
    portions = db.Column(db.Integer, nullable=False)

class PlatIngredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plat_id = db.Column(db.Integer, db.ForeignKey('plat.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)

    # Relation to access the ingredient details
    ingredient = db.relationship('Ingredient')






# Dummy data function
@app.route('/initialize-data')
def initialize_data():
    # Clear the existing data
    db.drop_all()
    db.create_all()

    # Add dummy ingredients
    ingredients = [
        Ingredient(name='Poulet', prix_unitaire=70.00, stock=10, unite='Kg'),
        Ingredient(name='Aubergine', prix_unitaire=6.00, stock=10, unite='Kg'),
        Ingredient(name='Sauce tomate MUTTI', prix_unitaire=36.00, stock=10, unite='Kg'),
        Ingredient(name='Parmesan', prix_unitaire=180.00, stock=10, unite='Kg'),
        Ingredient(name='Mozzarella', prix_unitaire=57.00, stock=10, unite='Kg'),
        Ingredient(name='Basilic', prix_unitaire=15.00, stock=10, unite='Botte'),
        Ingredient(name='Sauce pesto', prix_unitaire=3.24, stock=20, unite='Portion'),
        Ingredient(name='Sel', prix_unitaire=10.00, stock=10, unite='Kg'),
        Ingredient(name='Poivre blanc', prix_unitaire=110.00, stock=10, unite='Kg'),
        Ingredient(name='Garniture', prix_unitaire=3.51, stock=10, unite='Portion')
    ]

    db.session.add_all(ingredients)

    # Add a sauce
    sauce_pesto = Sauce(name='Sauce pesto', portions=20)
    db.session.add(sauce_pesto)
    db.session.commit()

    print(sauce_pesto.id)
    # Add ingredients for sauce pesto
    sauce_ingredients = [
        SauceIngredient(sauce_id=sauce_pesto.id, ingredient_id=6, quantity=2.0),  # Basilic
        SauceIngredient(sauce_id=sauce_pesto.id, ingredient_id=7, quantity=0.25), # Huile d'olive
        SauceIngredient(sauce_id=sauce_pesto.id, ingredient_id=8, quantity=0.01), # Ail
        SauceIngredient(sauce_id=sauce_pesto.id, ingredient_id=4, quantity=0.07), # Parmesan
        SauceIngredient(sauce_id=sauce_pesto.id, ingredient_id=9, quantity=0.005), # Sel
        SauceIngredient(sauce_id=sauce_pesto.id, ingredient_id=10, quantity=0.005) # Poivre blanc
    ]
    db.session.add_all(sauce_ingredients)

    # Add a plat: Supreme de Poulet alla Parmiggiana
    plat = Plat(name='Supreme de poulet alla parmiggiana', portions=1, sauce_id=sauce_pesto.id)
    db.session.add(plat)
    db.session.commit()

    # Add ingredients for the plat
    plat_ingredients = [
        PlatIngredient(plat_id=plat.id, ingredient_id=1, quantity=0.160),  # Poulet
        PlatIngredient(plat_id=plat.id, ingredient_id=2, quantity=0.250),  # Aubergine
        PlatIngredient(plat_id=plat.id, ingredient_id=3, quantity=0.100),  # Sauce tomate MUTTI
        PlatIngredient(plat_id=plat.id, ingredient_id=4, quantity=0.040),  # Parmesan
        PlatIngredient(plat_id=plat.id, ingredient_id=5, quantity=0.080),  # Mozzarella
        PlatIngredient(plat_id=plat.id, ingredient_id=6, quantity=0.100),  # Basilic
        PlatIngredient(plat_id=plat.id, ingredient_id=9, quantity=0.005),  # Sel
        PlatIngredient(plat_id=plat.id, ingredient_id=10, quantity=0.005)  # Poivre blanc
    ]
    db.session.add_all(plat_ingredients)

    db.session.commit()

    return "Data initialized successfully!"

# Forms
class IngredientForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired()])
    prix_unitaire = DecimalField('Prix Unitaire', validators=[DataRequired()])
    stock = DecimalField('Stock', validators=[DataRequired()])
    submit = SubmitField('Ajouter')

class SauceForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired()])
    portions = IntegerField('Portions', validators=[DataRequired()])
    submit = SubmitField('Ajouter')

class PlatForm(FlaskForm):
    name = StringField('Nom', validators=[DataRequired()])
    submit = SubmitField('Ajouter')

# Routes
@app.route('/')
def index():
    return render_template('index.html')

# Ingredient Routes
@app.route('/ingredients')
def ingredients():
    ingredients = Ingredient.query.all()
    return render_template('ingredients.html', ingredients=ingredients)

@app.route('/ingredients/add', methods=['GET', 'POST'])
def add_ingredient():
    form = IngredientForm()
    if form.validate_on_submit():
        new_ingredient = Ingredient(name=form.name.data, prix_unitaire=form.prix_unitaire.data, stock=form.stock.data)
        db.session.add(new_ingredient)
        db.session.commit()
        flash('Ingrédient ajouté avec succès', 'success')
        return redirect(url_for('ingredients'))
    return render_template('add_ingredient.html', form=form)

# Sauce Routes
@app.route('/sauces')
def sauces():
    sauces = Sauce.query.all()  # Récupère toutes les sauces
    return render_template('sauces.html', sauces=sauces)  # Rendu du template avec les sauces

@app.route('/sauces/add', methods=['GET', 'POST'])
def add_sauce():
    form = SauceForm()
    if form.validate_on_submit():
        new_sauce = Sauce(name=form.name.data, portions=form.portions.data)
        db.session.add(new_sauce)
        db.session.commit()
        flash('Sauce ajoutée avec succès', 'success')
        return redirect(url_for('sauces'))
    return render_template('add_sauce.html', form=form)

# Plat Routes
@app.route('/plats')
def plats():
    plats = Plat.query.all()
    return render_template('plats.html', plats=plats)

@app.route('/plats/add', methods=['GET', 'POST'])
def add_plat():
    form = PlatForm()
    if form.validate_on_submit():
        new_plat = Plat(name=form.name.data)
        db.session.add(new_plat)
        db.session.commit()
        flash('Plat ajouté avec succès', 'success')
        return redirect(url_for('plats'))
    return render_template('add_plat.html', form=form)

# Templates
@app.route('/initialize')
def initialize():
    db.create_all()
    return "Base de données initialisée!"

# Run server
if __name__ == '__main__':
    app.run(debug=True)
