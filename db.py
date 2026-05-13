import sqlite3

# Connexion à la base (créée si elle n'existe pas)
conn = sqlite3.connect("mots.db")
cursor = conn.cursor()

# Création de la table
cursor.execute("""
CREATE TABLE IF NOT EXISTS mots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    premiere_lettre TEXT,
    taille INTEGER,
    mot TEXT
)
""")

# Fonction de nettoyage
def clean_word(word):
    word = word.strip().upper()
    return word

# Lecture du fichier
with open("mots.txt", "r", encoding="utf-8") as file:
    for line in file:
        mot = clean_word(line)

        # Ignorer lignes vides ou invalides
        if not mot.isalpha():
            continue

        premiere_lettre = mot[0]
        taille = len(mot)

        cursor.execute(
            "INSERT INTO mots (premiere_lettre, taille, mot) VALUES (?, ?, ?)",
            (premiere_lettre, taille, mot)
        )

# Sauvegarde
conn.commit()
conn.close()

print("Import terminé ✅")