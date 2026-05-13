# Motus / Wordle

Un jeu de **Motus / Wordle** développé en JavaScript, entièrement personnalisable.
Choisissez votre lettre de départ, le nombre de lettres, le nombre de tentatives, ainsi que la disposition du clavier visuel (**AZERTY** ou **QWERTY**).

Si aucun paramètre n’est renseigné :

* la lettre de départ est choisie aléatoirement ;
* le nombre de lettres est défini à **6** ;
* le nombre de tentatives est défini à **6**.

## Aperçu

* 🎯 Génération aléatoire de mots
* 🔤 Lettre de départ personnalisable
* 📏 Nombre de lettres configurable
* ❤️ Nombre de tentatives configurable
* ⌨️ Clavier visuel AZERTY / QWERTY
* 🎨 Interface simple et rapide
* 🧩 Inspiré du célèbre Wordle / Motus

## Fonctionnement

Le but du jeu est de trouver le mot secret en un nombre limité de tentatives.

Après chaque essai :

* 🟩 Une lettre verte est bien placée
* 🟨 Une lettre jaune est présente mais mal placée
* ⬛ Une lettre grise n’est pas dans le mot

## Installation

Clonez le dépôt :

```bash
git clone https://github.com/FlexHeal/motus.git
```

Accédez au dossier :

```bash
cd motus
```

Puis ouvrez simplement le fichier `index.html` dans votre navigateur.

## Configuration

### Lettre de départ

Vous pouvez définir une lettre imposée au début du mot.

Exemple :

```txt
A
```

Si aucune lettre n’est indiquée, une lettre aléatoire sera utilisée.

---

### Nombre de lettres

Définit la longueur du mot.

Exemple :

```txt
5
```

Valeur par défaut :

```txt
6
```

---

### Nombre de tentatives

Définit le nombre maximal d’essais.

Exemple :

```txt
8
```

Valeur par défaut :

```txt
6
```

---

### Type de clavier

Deux dispositions sont disponibles :

* AZERTY
* QWERTY

## Technologies utilisées

* HTML
* CSS
* JavaScript
* PHP

## Captures d’écran
```md
<img width="1129" height="975" alt="image" src="https://github.com/user-attachments/assets/421259d6-db16-4c29-95b6-c4bf7a9eef45" />
```


## Licence

Ce projet est sous licence MIT.
