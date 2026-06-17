import os

path = r"C:\Users\ADMIN\.gemini\antigravity\brain\3de21e37-5661-415e-b0ed-02376966253f\scratch\v2_inv_legal_2.md"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

target = "*   **Multas (Art. 304 B):** El Instituto sanciona las infracciones (como omitir cuotas o declarar salarios menores) con multas cuantificadas en UMA, evaluando la gravedad, condiciones del infractor y la reincidencia. \n"
replacement = "*   **Multas (Art. 304 B):** El Instituto sanciona las infracciones (como omitir cuotas o declarar salarios menores) con multas cuantificadas en UMA, evaluando la gravedad, condiciones del infractor y la reincidencia. Dependiendo de la fracción del Artículo 304 A que se haya infringido, los rangos de las sanciones van de **20 a 75**, **20 a 125**, **20 a 210** y **20 a 350 veces la UMA**. Para infracciones más graves (como las de la fracción XXII), las multas pueden ser de **500 a 2,000 veces la UMA**.\n"

content = content.replace(target, replacement)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
