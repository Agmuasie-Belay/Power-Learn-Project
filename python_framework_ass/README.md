# CORD-19 Research Explorer


This project explores the CORD-19 dataset and provides a simple Streamlit web app to interactively analyze COVID-19 research publications. This project uses the CORD-19 `metadata.csv` file.  
Due to file size limitations, the dataset is not included in this repo.  
You can download it here: [CORD-19 Kaggle Dataset](https://www.kaggle.com/allen-institute-for-ai/CORD-19-research-challenge).  
Place the file inside the `data/` folder before running the code.


## Features
- Load and clean metadata.csv
- Explore publication trends by year
- Identify top publishing journals
- Generate word cloud of frequent title words
- Interactive Streamlit app with filters


## How to Run
1. Clone this repo
2. Install requirements: `pip install -r requirements.txt`
3. Place `metadata.csv` inside `data/`
4. Run Streamlit app: `streamlit run app/streamlit_app.py`