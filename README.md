# 🚗 Car Price Prediction & Performance Analysis

> **An end-to-end machine learning and automotive benchmarking pipeline that accurately predicts vehicle market prices (R² = 0.954) from powertrain specifications and quantifies brand premiums across global automakers.**

---

## 📌 Business Problem

In the modern automotive marketplace, setting the optimal price for a vehicle is a complex challenge influenced by evolving powertrain architectures (Internal Combustion Engines, Hybrids, and Battery Electric Vehicles), mechanical performance figures, and intangible brand equity. 

* **For Dealerships & Online Marketplaces:** Inaccurate vehicle valuation leads to margin loss on underpriced inventory or prolonged inventory holding costs on overpriced units.
* **For Lenders & Insurers:** Reliable residual value estimation reduces financial underwriting and collateral risk.
* **For Automakers & Consumers:** Quantitative performance benchmarking identifies which mechanical attributes (horsepower, torque, acceleration) drive tangible market value versus brand markup.

This project delivers a robust **pricing intelligence and performance analysis framework** that transforms messy automotive specifications into reliable valuation predictions with **over 95.4% explained variance**, empowering stakeholders to make data-driven buying, selling, and pricing decisions.

---

## 📊 The Dataset

* **Source:** [Kaggle: Cars Datasets 2025](https://www.kaggle.com/datasets/abdulmalik1518/cars-datasets-2025) imported via `kagglehub` (`abdulmalik1518/cars-datasets-2025`).
* **Raw Dimensions:** **1,218 records** across **11 raw categorical/object features** (`Company Names`, `Cars Names`, `Engines`, `CC/Battery Capacity`, `HorsePower`, `Total Speed`, `Performance(0-100)KM/H`, `Cars Prices`, `Fuel Types`, `Seats`, `Torque`).
* **Cleaned Dimensions:** **1,213 validated vehicles** and **16 structured numerical/categorical features**.
* **Key Constraints & Preprocessing Challenges:**
  * Unstructured string columns containing mixed units (`"3990 cc"`, `"963 hp"`, `"340 km/h"`, `"2.5 sec"`, `"$1,100,000"`, `"800 Nm"`).
  * Range values (e.g., `"70-85 hp"`, `"$12,000-$15,000"`) requiring mid-point resolution.
  * Multi-powertrain specifications combining ICE displacement (`cc`) and electric battery capacity (`kWh`).
  * Right-skewed multi-order-of-magnitude price distribution (from budget hatchbacks under \$15,000 to ultra-luxury hypercars exceeding \$4,000,000).

---

## ⚙️ Methodology & Approach

The project is structured into an end-to-end 5-phase data science workflow:

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  01. Data Ingestion     │ ──> │  02. Cleaning & Extract │ ──> │  03. EDA & Benchmarking │
│  • KaggleHub Automated  │     │  • Regex unit parsing   │     │  • Segment analysis     │
│  • Raw CSV validation   │     │  • EV/ICE split & types │     │  • Performance score    │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
                                                                               │
┌──────────────────────────┐     ┌──────────────────────────┐                  │
│  05. Tuning & Insights   │ <── │  04. Model Evaluation    │ <────────────────┘
│  • RandomizedSearchCV    │     │  • Scikit-Learn Pipeline │
│  • Residual & Feature Imp│     │  • Log Target (log1p)    │
└──────────────────────────┘     └──────────────────────────┘
```

1. **Data Ingestion (`notebook/01_import_dataset.py`):**
   * Programmatic download of latest 2025 automotive specification records using `kagglehub`.
2. **Data Cleaning & Type Validation (`notebook/02_data_cleaning_&_validation1.ipynb`):**
   * Regex extraction and conversion of numerical attributes: horsepower (`hp`), displacement (`cc`), battery capacity (`kWh`), acceleration time (`0–100 km/h`), torque (`Nm`), top speed (`km/h`), and pricing (`USD`).
   * Powertrain flag separation (`has_battery`, `has_engine`, `vehicle_type`).
   * Median imputation for numerical attributes and modal imputation for categoricals; removal of duplicates.
3. **Exploratory Data Analysis & Performance Scoring (`03_exploratory_data_analysis.ipynb`):**
   * Price tier classification into 4 market segments: **Budget** (<$50k), **Mid-range** ($50k–$100k), **Luxury** ($100k–$250k), and **Ultra-luxury** (>$250k).
   * Composite **Vehicle Performance Score** derived from percentile ranks of horsepower, torque, top speed, and inverse 0–100 km/h acceleration.
4. **Machine Learning Pipeline (`04_modeling.ipynb`):**
   * Target normalization using $\log(1 + \text{price})$ to stabilize error variance across extreme price scales.
   * `ColumnTransformer` pipeline integrating `SimpleImputer(strategy='median')` for continuous metrics and `OneHotEncoder(handle_unknown='ignore')` for high-cardinality nominals.
   * Benchmarked multiple regression algorithms with an 80/20 train-test split (`random_state=42`).
5. **Hyperparameter Tuning & Interpretability (`05_tuning_&_interpretation.ipynb`):**
   * 5-fold cross-validated `RandomizedSearchCV` optimizing tree depth, sample splits, and feature sub-sampling.
   * Residual homoscedasticity diagnostics and Gini feature importance analysis.
   * Market discrepancy evaluation calculating automaker-level **Brand Premium**.

---

## 🏆 Key Results & Impact

### 📈 Model Benchmark Comparison

| Model | MAE (log scale) | RMSE (log scale) | R² Score | Performance vs Baseline |
| :--- | :---: | :---: | :---: | :---: |
| **Random Forest (Tuned)** | **0.1489** | **0.2039** | **0.9541** | **+101.7% Error Reduction** |
| Random Forest (Default) | 0.1512 | 0.2125 | 0.9502 | +98.7% Error Reduction |
| Gradient Boosting | 0.1799 | 0.2486 | 0.9317 | +74.6% Error Reduction |
| Linear Regression | 0.1858 | 0.2747 | 0.9167 | +72.0% Error Reduction |
| Baseline (Train Median) | 0.6925 | 0.9812 | -0.0629 | *Reference Model* |

> 🎯 **Primary Model Achievement:** The **Tuned Random Forest Regressor** achieved an **R² of 0.954 (95.41% variance explained)** with a **Mean Absolute Error (MAE) of 0.1489**, cutting pricing error by **78.5%** over the naive baseline.

---

### 🔍 Top Drivers of Vehicle Valuation

The top 5 mechanical attributes account for **over 48.8%** of the model's total predictive power:

1. **Horsepower (`num__horsepower`)**: **12.34%** importance
2. **Torque (`num__torque`)**: **10.92%** importance
3. **0–100 km/h Acceleration (`num__acceleration_0_100`)**: **9.89%** importance
4. **Top Speed (`num__total_speed`)**: **8.21%** importance
5. **Engine Displacement (`num__engine_cc`)**: **7.53%** importance
6. **Ultra-Luxury Automaker & Powertrain Flags**: **Bugatti Brand Flag (3.33%)**, **7993 cc Quad-Turbo W16 (3.29%)**, and **V12 Engine Configuration (3.11%)**.

---

### 💡 Business & Market Insights

* **Automaker Brand Premium:** Residual valuation analysis revealed that premium European marques (**Volvo, Mercedes-Benz, Porsche**) consistently capture higher market prices than what base mechanical specifications alone predict, reflecting strong brand equity and cabin luxury.
* **Performance-to-Price Efficiency:** Mass-market and performance-focused brands (**Hyundai, Mazda, Honda, Nissan**) deliver superior horsepower-per-dollar ratios, presenting higher value propositions for budget-conscious buyers.
* **Powertrain Impact:** High-torque hybrid and electric powertrains significantly shift pricing dynamics, commanding premiums in acceleration benchmarks compared to equivalent displacement ICE vehicles.

---

## 📁 Repository Structure

```text
car-price-prediction-and-performance-analysis/
├── dataset/
│   ├── Cars Datasets 2025.csv             # Raw automotive dataset (1,218 records)
│   └── final_cleaned_data.csv            # Cleaned & engineered dataset (1,213 records)
├── notebook/
│   ├── 01_import_dataset.py              # Automated data ingestion via KaggleHub
│   └── 02_data_cleaning_&_validation1.ipynb # Data cleaning, regex parsing & type validation
├── 03_exploratory_data_analysis.ipynb    # EDA, market tiers & performance scoring
├── 04_modeling.ipynb                     # Scikit-learn pipelines & model benchmarking
├── 05_tuning_&_interpretation.ipynb      # Hyperparameter tuning, residual & feature analysis
├── requirements.txt                      # Project dependencies
└── README.md                             # Project documentation
```

---

## 🚀 How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/Isseia/car-price-prediction-and-performance-analysis.git
cd car-price-prediction-and-performance-analysis
```

### 2. Set Up a Virtual Environment
```bash
# On macOS / Linux
python3 -m venv venv
source venv/bin/activate

# On Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. (Optional) Re-download Raw Data from Kaggle
```bash
python notebook/01_import_dataset.py
```

### 5. Launch Jupyter Notebooks
```bash
jupyter notebook
```
Open and execute the notebooks in sequence:
1. [`notebook/02_data_cleaning_&_validation1.ipynb`](notebook/02_data_cleaning_&_validation1.ipynb) — Data preprocessing & validation
2. [`03_exploratory_data_analysis.ipynb`](03_exploratory_data_analysis.ipynb) — EDA & performance scoring
3. [`04_modeling.ipynb`](04_modeling.ipynb) — Pipeline construction & model benchmarking
4. [`05_tuning_&_interpretation.ipynb`](05_tuning_&_interpretation.ipynb) — Tuning, feature importance & brand premium analysis

---

## 🛠️ Tech Stack

* **Language:** Python 3.10+
* **Data Manipulation & Analysis:** `pandas`, `numpy`
* **Machine Learning:** `scikit-learn` (Pipelines, ColumnTransformer, RandomForestRegressor, GradientBoostingRegressor)
* **Data Visualization:** `matplotlib`, `seaborn`
* **Data Extraction:** `kagglehub`
