from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField, SubmitField, SelectField
from wtforms.validators import DataRequired, NumberRange

class IngredientForm(FlaskForm):
    nom = StringField('Nom', validators=[DataRequired()])
    prix_unitaire = FloatField('Prix Unitaire', validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField('Ajouter')

class SauceForm(FlaskForm):
    nom = StringField('Nom', validators=[DataRequired()])
    nombre_portions = IntegerField('Nombre de Portions', validators=[DataRequired(), NumberRange(min=1)])
    coût_total = FloatField('Coût Total', validators=[DataRequired()])
    coût_par_portion = FloatField('Coût par Portion', validators=[DataRequired()])
    submit = SubmitField('Ajouter')

class PreparationForm(FlaskForm):
    nom = StringField('Nom', validators=[DataRequired()])
    nombre_portions = IntegerField('Nombre de Portions', validators=[DataRequired(), NumberRange(min=1)])
    coût_total = FloatField('Coût Total', validators=[DataRequired()])
    coût_par_portion = FloatField('Coût par Portion', validators=[DataRequired()])
    sauce_id = IntegerField('Sauce ID', validators=[DataRequired()])
    submit = SubmitField('Ajouter')

class ProduitSauceForm(FlaskForm):
    ingredient_id = SelectField('Ingrédient', coerce=int, validators=[DataRequired()])
    quantité = FloatField('Quantité', validators=[DataRequired(), NumberRange(min=0)])
    unité = StringField('Unité', validators=[DataRequired()])
    coût = FloatField('Coût', validators=[DataRequired(), NumberRange(min=0)])
    submit = SubmitField('Ajouter Produit')
