import pandas as pd
import matplotlib.pyplot as plt
from js import document

# Carica i dataset (PyScript supporta il caricamento diretto di file statici)
df_players = pd.read_csv("players.csv")
df_teams = pd.read_csv("teams.csv")

def generate_chart(stat):
    """
    Genera un grafico basato sulla statistica selezionata.
    """
    # Filtra i dati (esempio: Top 3 squadre)
    top_3 = df_teams[["team_name", stat]].sort_values(by=stat, ascending=False).head(3)

    # Genera il grafico
    plt.figure(figsize=(8, 4))
    plt.barh(top_3["team_name"], top_3[stat], color=["#1f77b4", "#ff7f0e", "#2ca02c"])
    plt.title(f"Top 3 Teams by {stat.replace('_', ' ').title()}")
    plt.xlabel(stat.replace("_", " ").title())
    plt.ylabel("Teams")

    # Salva il grafico come immagine e mostralo nel browser
    plt.savefig("/tmp/chart.png")
    chart_output = document.getElementById("chart-output")
    chart_output.innerHTML = '<img src="/tmp/chart.png" alt="Generated Chart">'
    plt.close()
