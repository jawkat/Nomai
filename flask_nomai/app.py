from flask import Flask, render_template, redirect, url_for, request, jsonify, flash,abort
from flask_sqlalchemy import SQLAlchemy
from forms import IngredientForm, SauceForm, PreparationForm, ProduitSauceForm  # Import des formulaires

# Configuration de l'application
app = Flask(__name__)
app.config['SECRET_KEY'] = 'you-will-never-guess'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser la base de données
db = SQLAlchemy(app)

# Modèles
class Ingrédient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    stock = db.Column(db.Float, nullable=False)
    prix_unitaire = db.Column(db.Float, nullable=False)
    produits_sauce = db.relationship('ProduitSauce', backref='ingredient', lazy=True)
    produits_plat = db.relationship('ProduitPlat', backref='ingredient', lazy=True)

class Sauce(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    nombre_portions = db.Column(db.Integer, nullable=False)
    coût_total = db.Column(db.Float, nullable=False, default=0.0)
    coût_par_portion = db.Column(db.Float, nullable=False, default=0.0)

    produits_sauce = db.relationship('ProduitSauce', backref='sauce', lazy=True)

    def calculer_cout_total(self):
        # Recalculer le coût total en fonction des produits de la sauce
        self.coût_total = sum(produit.coût for produit in self.produits_sauce)
        # Calculer le coût par portion
        if self.nombre_portions > 0:
            self.coût_par_portion = self.coût_total / self.nombre_portions
        else:
            self.coût_par_portion = 0.0
        db.session.commit()

    def __repr__(self):
        return f'<Sauce {self.nom}>'


class Préparation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    nombre_portions = db.Column(db.Integer, nullable=False)
    cout_total = db.Column(db.Float, nullable=False, default=0.0)
    cout_par_portion = db.Column(db.Float, nullable=False, default=0.0)

    sauce_id = db.Column(db.Integer, db.ForeignKey('sauce.id'), nullable=True)
    produits_plat = db.relationship('ProduitPlat', backref='plat', lazy=True)

    def calculer_cout_total(self):
        # Calculer le coût total des produits dans la préparation
        coût_produits = sum(produit.coût for produit in self.produits_plat)

        # Si une sauce est associée, ajouter le coût total de la sauce
        if self.sauce:
            coût_produits += self.sauce.coût_total

        self.coût_total = coût_produits

        # Calculer le coût par portion
        if self.nombre_portions > 0:
            self.coût_par_portion = self.coût_total / self.nombre_portions
        else:
            self.coût_par_portion = 0.0

        db.session.commit()

    def __repr__(self):
        return f'<Préparation {self.nom}>'


class ProduitSauce(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sauce_id = db.Column(db.Integer, db.ForeignKey('sauce.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingrédient.id'), nullable=False)
    quantite = db.Column(db.Float, nullable=False)
    unite = db.Column(db.String(50), nullable=False)
    cout = db.Column(db.Float, nullable=False)

class ProduitPlat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plat_id = db.Column(db.Integer, db.ForeignKey('préparation.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingrédient.id'), nullable=False)
    quantite = db.Column(db.Float, nullable=False)
    unite = db.Column(db.String(50), nullable=False)
    cout = db.Column(db.Float, nullable=False)

# Routes
@app.route('/')
def index():
    préparations = Préparation.query.all()
    sauces = Sauce.query.all()
    ingrédients = Ingrédient.query.all()
    return render_template('index.html', préparations=préparations, sauces=sauces, ingrédients=ingrédients)

@app.route('/ajouter_ingredient', methods=['GET', 'POST'])
def ajouter_ingredient():
    form = IngredientForm()
    if form.validate_on_submit():
        nouvel_ingredient = Ingrédient(nom=form.nom.data, prix_unitaire=form.prix_unitaire.data)
        db.session.add(nouvel_ingredient)
        db.session.commit()
        return jsonify({'message': 'Ingrédient ajouté avec succès !'}), 200
    return render_template('ajouter_ingredient.html', form=form)

@app.route('/ajouter_sauce', methods=['GET', 'POST'])
def ajouter_sauce():
    form = SauceForm()
    if form.validate_on_submit():
        nouvelle_sauce = Sauce(
            nom=form.nom.data,
            nombre_portions=form.nombre_portions.data,
            coût_total=form.coût_total.data,
            coût_par_portion=form.coût_par_portion.data
        )
        db.session.add(nouvelle_sauce)
        db.session.commit()
        return jsonify({'message': 'Sauce ajoutée avec succès !'}), 200
    return render_template('ajouter_sauce.html', form=form)

@app.route('/ajouter_preparation', methods=['GET', 'POST'])
def ajouter_preparation():
    form = PreparationForm()
    if form.validate_on_submit():
        nouvelle_preparation = Préparation(
            nom=form.nom.data,
            nombre_portions=form.nombre_portions.data,
            coût_total=form.coût_total.data,
            coût_par_portion=form.coût_par_portion.data,
            sauce_id=form.sauce_id.data
        )
        db.session.add(nouvelle_preparation)
        db.session.commit()
        return jsonify({'message': 'Préparation ajoutée avec succès !'}), 200
    return render_template('ajouter_preparation.html', form=form)


@app.route('/ajouter_produit_plat/<int:plat_id>', methods=['GET', 'POST'])
def ajouter_produit_plat(plat_id):
    plat = Préparation.query.get_or_404(plat_id)
    ingrédients = Ingrédient.query.all()

    form = ProduitPlatForm()
    form.ingredient_id.choices = [(ingredient.id, ingredient.nom) for ingredient in ingrédients]

    if form.validate_on_submit():
        ingredient_id = form.ingredient_id.data
        quantité = form.quantité.data
        unité = form.unité.data
        coût = form.coût.data

        # Ajouter le produit au plat
        nouveau_produit_plat = ProduitPlat(
            plat_id=plat_id,
            ingredient_id=ingredient_id,
            quantité=quantité,
            unité=unité,
            coût=coût
        )
        db.session.add(nouveau_produit_plat)
        db.session.commit()

        # Recalculer le coût total et le coût par portion du plat
        plat.calculer_cout_total()

        flash('Produit ajouté et coût mis à jour avec succès!', 'success')
        return redirect(url_for('index'))

    return render_template('ajouter_produit_plat.html', form=form, plat=plat)


@app.route('/ajouter_produit_sauce/<int:sauce_id>', methods=['GET', 'POST'])
def ajouter_produit_sauce(sauce_id):
    sauce = Sauce.query.get_or_404(sauce_id)
    ingrédients = Ingrédient.query.all()

    # Créer le formulaire et remplir le champ 'ingredient_id' avec les ingrédients disponibles
    form = ProduitSauceForm()
    form.ingredient_id.choices = [(ingredient.id, ingredient.nom) for ingredient in ingrédients]

    if form.validate_on_submit():
        # Récupérer les données du formulaire
        ingredient_id = form.ingredient_id.data
        quantité = form.quantité.data
        unité = form.unité.data
        coût = form.coût.data

        # Créer un nouveau produit pour la sauce
        nouveau_produit_sauce = ProduitSauce(
            sauce_id=sauce_id,
            ingredient_id=ingredient_id,
            quantité=quantité,
            unité=unité,
            coût=coût
        )
        db.session.add(nouveau_produit_sauce)
        db.session.commit()

        # Recalculer le coût total et le coût par portion de la sauce
        sauce.calculer_cout_total()

        flash('Produit ajouté et coûts mis à jour avec succès!', 'success')
        return redirect(url_for('index'))

    return render_template('ajouter_produit_sauce.html', form=form, sauce=sauce)


@app.route('/plat/<int:plat_id>')
def consulter_plat(plat_id):
    plat = Préparation.query.get(plat_id)
    if not plat:
        abort(404)  # Plat non trouvé

    # Récupérer les ingrédients associés
    ingredients = [produit for produit in plat.produits_plat]

    return render_template('consulter_plat.html', plat=plat, ingredients=ingredients)



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Crée les tables si elles n'existent pas
    app.run(debug=True)
