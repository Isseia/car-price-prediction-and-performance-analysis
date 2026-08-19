from flask import Flask, render_template, jsonify
import pandas as pd
import os

app = Flask(__name__)
 
csv_path = "final_cleaned_data.csv"
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
else:
    df = None
    print(f"Warning: '{csv_path}' not found. Make sure it is in the same folder.")

@app.route("/")
def home():
    # Make sure you have a folder named 'templates' with 'cars.html' inside it
    return render_template("Cars.html")
@app.route("/api/mileage-price")
def mileage_price():

    data = df[
        ["horsepower", "cars_prices"]
    ].dropna()

    return jsonify(
        data.to_dict(orient="records")
    )

@app.route("/api/prices")
def prices():

    data = df["cars_prices"].dropna().tolist()

    return jsonify(data)

@app.route("/api/brand-price")
def brand_price():

    result = (
        df.groupby("company_names")["cars_prices"]
        .mean()
        .sort_values(ascending=False)
        .head(20)
    )

    return jsonify(
        result.to_dict()
    )
@app.route("/api/statistics")
def statistics():

    return jsonify({
        "rows": len(df),
        "features": len(df.columns),
        "median_price": df["cars_price"].median(),
        "mean_price": df["cars_price"].mean()
    })
if __name__ == "__main__":
    app.run(debug=True)

